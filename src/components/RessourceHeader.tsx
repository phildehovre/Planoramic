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
import { updateRessourceFn, useTemplate, useTemplateEvents } from "../util/db";
import {
  checkFalsyValuesInEvents,
  formatTemplateEventsToCampaign,
} from "../utils/helpers";
import Modal from "./Modal";
import Dropdown from "./Dropdown";
import NewCampaignFromTemplate from "./Modals/NewCampaignFromTemplate";
import "./RessourceHeader.scss";
import UpdatableInput from "./UpdatableInput";
import ErrorNotification from "./ErrorNotification";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";

const schema = yup.object().shape({
  artistName: yup.string().required("You must enter a name"),
  songName: yup.string().required("You must enter a name"),
  targetDate: yup.string().required("Select a type of task"),
});

function RessourceHeader(props: any) {
  const [showEditDescriptionModal, setShowEditDescriptionModal] =
    React.useState(false);
  const [showNewCampaignModal, setShowNewCampaignModal] = React.useState(false);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [showNotification, setShowNotification] = React.useState(false);
  const [targetDate, setTargetDate] = React.useState<Date>(
    dayjs().add(1, "month").toDate()
  );
  const [starIcon, setStarIcon] = React.useState(regularStar);
  const { ressource, ressourceType } = props;
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const session = useSession();
  const {
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const { selectedTemplateId, setSelectedTemplateId } = React.useContext(
    selectedTemplateContext
  );
  const { selectedCampaignId, setSelectedCampaignId } = React.useContext(
    selectedCampaignContext
  );

  const { data: campaignTemplateData } = useTemplate(
    ressource?.data?.template_id,
    ressource?.data?.template_id ? true : false
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

  useEffect(() => {
    ressource?.data?.is_favorite
      ? setStarIcon(solidStar)
      : setStarIcon(regularStar);
  }, [ressource]);

  // ======================= Update description ===========================

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

  // ===================== New campaign from template =====================

  const addCampaign = useMutation({
    mutationFn: async (campaign: any) =>
      await supabase.from("campaigns").insert(campaign).select(),
  });

  const addDateToCampaign = (campaign: any, targetDate: Date) => {
    campaign.targetDate = targetDate;
    return campaign;
  };

  // ================Add all template events to campaign events ============
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
      targetDate: data.targetDate,
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

  // ======================== Update ressource =========================

  const updateRessourceMutation = useMutation(updateRessourceFn, {
    onMutate: async ({ type, ressource, data }: any) => {
      queryClient.setQueryData(
        [ressourceType, { [`${ressourceType}_id`]: ressourceId }],
        updateRessourceFn({ type, ressource, data })
      );
    },
  });

  const handleUpdateRessource = async ({ type, ressource, data }: any) => {
    await updateRessourceMutation
      .mutateAsync({ type, ressource, data })
      .then(() => {
        queryClient.invalidateQueries([
          ressourceType,
          { [`${ressourceType}_id`]: ressourceId },
        ]);
      });
  };

  // ====================== Delete ressource ===========================

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
      handleNewCampaignClick();
    } else if (option === "Delete") {
      handleDeleteRessource();
    }
    setShowDropdown(false);
  };

  const handleNewCampaignClick = () => {
    if (keysWithFalsyValues.length > 0) {
      setShowNotification(true);
    } else {
      setShowNewCampaignModal(true);
      setShowNotification(false);
    }
  };
  // ============================= Render ============================

  const renderHeader = () => {
    return (
      <div className="ressource_header-ctn">
        <div className="ressource_header-header">
          <div className="ressource_header-column left">
            <span className="title-ctn" style={{ position: "relative" }}>
              <UpdatableInput
                value={ressource.data.name}
                ressourceType={ressourceType}
                ressourceId={ressource.data[ressourceKey + "_id"]}
                label={"name"}
                size="larger"
                weight="bolder"
              />
              <FontAwesomeIcon
                icon={starIcon}
                size="lg"
                style={{ cursor: "pointer" }}
                color="orange"
                onClick={() => {
                  handleUpdateRessource({
                    type: ressourceType,
                    ressource,
                    data: {
                      key: "is_favorite",
                      val: !ressource.data.is_favorite,
                    },
                  });
                }}
              />
              <div
                className="dropdown-btn"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <FontAwesomeIcon icon={faEllipsisV} size="lg" />
                {showDropdown && (
                  <Dropdown
                    options={["New campaign from Template", "Delete"]}
                    onOptionClick={onOptionClick}
                    setIsOpen={setShowDropdown}
                  />
                )}
              </div>
            </span>
            <UpdatableInput
              value={ressource.data.description}
              ressourceType={ressourceType}
              ressourceId={ressource.data[ressourceKey + "_id"]}
              label={"description"}
              size="regular"
              weight="bold"
              placeholder="Enter a description..."
            />
          </div>
          <div className="ressource_header-column right">
            {ressourceType === "template" && (
              <button
                className="new_campaign-btn"
                onClick={handleNewCampaignClick}
              >
                New campaign from template
              </button>
            )}
          </div>
        </div>
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
                weight="bold"
              />
            </span>
            <span>
              <h4>Song:</h4>
              <UpdatableInput
                value={ressource.data.song_name}
                ressourceType={ressourceType}
                ressourceId={ressource.data[ressourceKey + "_id"]}
                label={"song_name"}
                weight="bold"
              />
            </span>
            <span>
              <h4>Target date:</h4>
              <UpdatableInput
                value={dayjs(ressource.data.targetDate).format(
                  "dddd, DD-MM-YYYY"
                )}
                ressourceType={ressourceType}
                ressourceId={ressource.data[ressourceKey + "_id"]}
                label={"targetDate"}
                type="date"
                weight="bold"
              />
            </span>
            <span>
              <h4>Template:</h4>
              <p style={{ fontWeight: "bold" }}>
                {campaignTemplateData?.data?.name}
              </p>
            </span>
          </div>
        )}
        <ErrorNotification
          ressource={templateEventsData}
          ressourceType={ressourceType}
          show={showNotification}
          setShow={setShowNotification}
        />
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
