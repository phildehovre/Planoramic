import React, { useEffect } from "react";
import Table from "./Table";
import { useParams } from "react-router-dom";
import "./Create.scss";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import NewRessource from "./Modals/NewRessource";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "../App";
import { v4 as uuidv4 } from "uuid";
import { selectedTemplateContext } from "../contexts/SelectedTemplateContext";
import { selectedCampaignContext } from "../contexts/SelectedCampaignContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "@tanstack/react-query";

function Create(props: { ressourceType?: string; content?: string }) {
  const { ressourceType, content } = props;
  const navigate = useNavigate();
  const params = useParams();
  const queryClient = useQueryClient();

  const type = ressourceType || params.ressource;

  const [showModal, setShowModal] = React.useState(false);
  const [name, setName] = React.useState("");

  const { setSelectedTemplateId, selectedTemplateId } = React.useContext(
    selectedTemplateContext
  );
  const { setSelectedCampaignId } = React.useContext(selectedCampaignContext);

  const handleCreateRessource = (type: string | undefined) => {
    const ressourceId = uuidv4();
    addRessource
      .mutateAsync([
        {
          name: name,
          created_at: new Date(),
          [`${type}_id`]: ressourceId,
        },
      ])

      .then((res) => {
        if (type === "template" && res.data) {
          setSelectedTemplateId(ressourceId);
          navigate(`/dashboard/template/${ressourceId}`);
        }
        if (type === "campaign" && res.data) {
          setSelectedCampaignId(ressourceId);
          navigate(`/dashboard/campaign/${ressourceId}`);
        }
      })
      .then((res) => {
        if (type === "template") {
          console.log("is triggered?");
          addInitialEvent
            .mutateAsync({
              description: "Initial Event",
              created_at: new Date(),
              template_id: ressourceId,
              phase_number: 1,
              phase_name: "Initial Phase",
            })
            .then(() => {
              queryClient.invalidateQueries({
                queryKey: ["template_events"],
              });
            })
            .then(() =>
              queryClient.invalidateQueries({
                queryKey: [`${type}s`],
              })
            );
        }
        // ADD NEW EVENT WITH PHASE NUMBER 1
      });
  };

  const addRessource = useMutation({
    mutationFn: async (event: any) =>
      await supabase.from(`${type}s`).insert(event).select(),
  });
  const addInitialEvent = useMutation({
    mutationFn: async (event: any) =>
      await supabase.from(`${type}_events`).insert(event).select(),
  });

  const handleOpenModalWithRessource = () => {
    setShowModal(true);
  };

  return (
    <div className="create-ctn">
      <button onClick={() => handleOpenModalWithRessource()}>
        {!content && <FontAwesomeIcon icon={faPlus} size="lg" />}
        {content && <h2>{content}</h2>}
      </button>
      <Modal
        showModal={showModal}
        onSave={() => handleCreateRessource(type)}
        onClose={() => setShowModal(false)}
        title={`Create ${type}`}
        content={<NewRessource name={name} setName={setName} type={type} />}
        setShowModal={setShowModal}
        showFooter={true}
      />
    </div>
  );
}

export default Create;
