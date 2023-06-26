import React, { useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { supabase } from "../App";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import { selectedTemplateContext } from "../contexts/SelectedTemplateContext";
import { selectedCampaignContext } from "../contexts/SelectedCampaignContext";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { set, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTemplateEvents } from "../util/db";
import {
  checkFalsyValuesInEvents,
  formatTemplateEventsToCampaign,
} from "../utils/helpers";
import TemplateDescriptionEdit from "./Modals/TemplateDescriptionEdit";
import Modal from "./Modal";
import Dropdown from "./Dropdown";
import NewCampaignFromTemplate from "./Modals/NewCampaignFromTemplate";
import "./RessourceHeader.scss";
import UpdatableInput from "./UpdatableInput";
import ErrorNotification from "./ErrorNotification";

const schema = yup.object().shape({
  artistName: yup.string().required("You must enter a name"),
  songName: yup.string().required("You must enter a name"),
  targetDate: yup.string().required("Select a type of task"),
});

function RessourceHeader(props: any) {
  const [showEditDescriptionModal, setShowEditDescriptionModal] =
    React.useState(false);
  const [description, setDescription] = React.useState("");
  const [showNewCampaignModal, setShowNewCampaignModal] = React.useState(false);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [showNotification, setShowNotification] = React.useState(false);
  const [targetDate, setTargetDate] = React.useState<Date>(
    dayjs().add(1, "month").toDate()
  );
  const { ressource, ressourceType } = props;
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const session = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const { selectedTemplateId, setSelectedTemplateId } = React.useContext(
    selectedTemplateContext
  );
  const { selectedCampaignId, setSelectedCampaignId } = React.useContext(
    selectedCampaignContext
  );
  const {
    data: templateEventsData,
    isLoading,
    error,
  } = useTemplateEvents(selectedTemplateId);

  const ressourceId =
    ressourceType === "template"
      ? ressource?.data?.template_id
      : ressource?.data?.campaign_id;
  const ressourceKey = ressourceType === "template" ? "template" : "campaign";

  // ================= Update description =================

  const updateCellFn = async ({ id, key, val }: any) => {
    return await supabase
      .from(`${ressourceType}s`)
      .update({ [key]: val })
      .eq(ressourceKey + "_id", id)
      .select();
  };

  const updateCell = useMutation({
    mutationFn: ({ id, key, val }: any) => updateCellFn({ id, key, val }),
  });

  const submitDescription = async (description: string) => {
    updateCell
      .mutateAsync({ id: ressourceId, key: "description", val: description })
      .then(() =>
        queryClient.invalidateQueries({
          queryKey: [ressourceKey, { [`${ressourceKey}_id`]: ressourceId }],
        })
      );
  };

  // ================= New campaign from template =================

  const addCampaign = useMutation({
    mutationFn: async (campaign: any) =>
      await supabase.from("campaigns").insert(campaign).select(),
  });

  const addDateToCampaign = (campaign: any, targetDate: Date) => {
    campaign.targetDate = targetDate;
    return campaign;
  };

  // ==================Add all template events to campaign events ==============
  const copyTemplateEventsToCampaignEvents = useMutation({
    mutationFn: async (templateEvents: any) => {
      await supabase.from("campaign_events").insert(templateEvents);
    },
  });

  const onSubmit = (data: any) => {
    setSelectedTemplateId(selectedTemplateId);
    const campaignSansDate = {
      name: data.artistName + " - " + data.songName,
      description: `Template: ${ressource.data.name}`,
      template_id: selectedTemplateId,
      campaign_id: uuidv4(),
      author_id: session?.user.id,
      artist_name: data.artistName,
      song_name: data.songName,
      target_date: data.targetDate,
    };
    const campaign = addDateToCampaign(campaignSansDate, targetDate);

    addCampaign
      .mutateAsync(campaign)
      .then((res) => {
        if (res.data !== null) {
          var campaignId = res.data[0].campaign_id;
          var templateId = res.data[0].template_id;

          sessionStorage.setItem("campaign_id", campaignId);
          sessionStorage.setItem("template_id", templateId);
        }
        return res;
      })
      .then((res: any) => {
        queryClient.invalidateQueries({ queryKey: ["campaigns"] });
        setShowNewCampaignModal(false);
        var campaignId = res.data[0].campaign_id;
        setSelectedCampaignId(campaignId);
        const templateEventsFormatted = formatTemplateEventsToCampaign(
          templateEventsData?.data as any,
          campaignId
        );
        copyTemplateEventsToCampaignEvents.mutateAsync(templateEventsFormatted);
        navigate(`/dashboard/campaign/${campaignId}`);
      })
      .catch((err) => alert(err));
  };

  // ================= Delete ressource =================

  const deleteRessourceFn = async () => {
    const res = await supabase
      .from(`${ressourceType}s`)
      .delete()
      .eq("id", ressource.data.id);
    return res;
  };
  const deleteRessourceMutation = useMutation(deleteRessourceFn, {});

  const handleDeleteRessource = async () => {
    await deleteRessourceMutation.mutateAsync().then(() => {
      queryClient.invalidateQueries([`${ressourceType}s`]);
      navigate(`/dashboard/${ressourceType}`);
    });
    setShowEditDescriptionModal(false);
  };

  // =================== Handle Notification display ===================

  const [hasFalsyValue, keysWithFalsyValues] = checkFalsyValuesInEvents(
    templateEventsData?.data
  );
  // ======== Remove notification when template events are updated ========
  useEffect(() => {
    setShowNotification(false);
  }, [templateEventsData?.data]);

  // ======== Trigger check on click ========
  const onOptionClick = (option: string) => {
    if (option === "New campaign from Template") {
      if (keysWithFalsyValues.length > 0) {
        setShowNotification(true);
      } else {
        setShowNewCampaignModal(true);
        setShowNotification(false);
      }
    } else if (option === "Delete") {
      handleDeleteRessource();
    }
    setShowDropdown(false);
  };
  // ============================= Render ============================

  const renderHeader = () => {
    return (
      <div className="ressource-header">
        <span className="title-ctn" style={{ position: "relative" }}>
          <UpdatableInput
            value={ressource.data.name}
            ressourceType={ressourceType}
            ressourceId={ressource.data[ressourceKey + "_id"]}
            label={"name"}
            size="larger"
            weight="bolder"
          />
          <div className="dropdown-btn">
            <FontAwesomeIcon
              icon={faEllipsisV}
              size="lg"
              onClick={() => setShowDropdown(!showDropdown)}
            />
            {showDropdown && (
              <Dropdown
                options={["New campaign from Template", "Delete"]}
                onOptionClick={onOptionClick}
                setIsOpen={setShowDropdown}
              />
            )}
          </div>
        </span>
        <ErrorNotification
          ressource={templateEventsData}
          ressourceType={ressourceType}
          show={showNotification}
          setShow={setShowNotification}
        />
        <UpdatableInput
          value={ressource.data.description}
          ressourceType={ressourceType}
          ressourceId={ressource.data[ressourceKey + "_id"]}
          label={"description"}
          size="regular"
          weight="bold"
        />
        {ressourceType === "campaign" && (
          <div className="campaign_info-ctn">
            <span>
              <h4>Artist:</h4>
              <UpdatableInput
                value={ressource.data.artist_name}
                ressourceType={ressourceType}
                ressourceId={ressource.data[ressourceKey + "_id"]}
                label={"artist_name"}
                size="regular"
                weight="regular"
              />
            </span>
            <span>
              <h4>Song:</h4>
              <UpdatableInput
                value={ressource.data.song_name}
                ressourceType={ressourceType}
                ressourceId={ressource.data[ressourceKey + "_id"]}
                label={"song_name"}
              />
            </span>
            <span>
              <h4>Target date:</h4>
              <UpdatableInput
                value={dayjs(ressource.data.target_date).format(
                  "dddd, DD-MM-YYYY"
                )}
                ressourceType={ressourceType}
                ressourceId={ressource.data[ressourceKey + "_id"]}
                label={"target_date"}
                type="date"
              />
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {showNewCampaignModal && (
        <Modal
          onClose={() => {
            console.log("closing");
          }}
          onSave={() => {
            handleSubmit(onSubmit);
          }}
          showModal={showNewCampaignModal}
          setShowModal={setShowNewCampaignModal}
          title={`New Campaign from ${ressource?.data.name}`}
          content={
            <NewCampaignFromTemplate
              ressource={ressource}
              placeholder="Describe this template"
              ressourceType={ressourceType}
              onSubmit={onSubmit}
            />
          }
        />
      )}
      {!ressource || ressource.isLoading ? <Spinner /> : renderHeader()}
    </>
  );
}

export default RessourceHeader;
