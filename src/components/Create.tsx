import React from "react";
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

function Create(props: { ressourceType?: string }) {
  const { ressourceType } = props;
  const navigate = useNavigate();
  const params = useParams();

  const type = ressourceType || params.ressource;

  const [showModal, setShowModal] = React.useState(false);
  const [name, setName] = React.useState("New ressource");

  const { setSelectedTemplateId } = React.useContext(selectedTemplateContext);
  const { setSelectedCampaignId } = React.useContext(selectedCampaignContext);

  const handleCreateRessource = (type: string | undefined) => {
    addRessource
      .mutateAsync([
        { name: name, created_at: new Date(), [`${type}_id`]: uuidv4() },
      ])
      .then((res) => {
        if (type === "template" && res.data) {
          setSelectedTemplateId(res?.data[0].template_id);
          navigate(`/dashboard/template/${res?.data[0].template_id}`);
        }
        if (type === "campaign" && res.data) {
          setSelectedCampaignId(res?.data[0].campaign_id);
          navigate(`/dashboard/campaign/${res?.data[0].campaign_id}`);
        }
      });
  };

  const addRessource = useMutation({
    mutationFn: async (event: any) =>
      await supabase.from(`${type}s`).insert(event).select(),
  });

  const handleOpenModalWithRessource = () => {
    setShowModal(true);
  };

  return (
    <div className="create-ctn">
      <button
        style={{ border: "1px solid red" }}
        onClick={() => handleOpenModalWithRessource()}
      >
        <FontAwesomeIcon icon={faPlus} size="lg" />
      </button>
      <Modal
        showModal={showModal}
        onSave={() => handleCreateRessource(type)}
        onClose={() => setShowModal(false)}
        title={`Create ${type}`}
        content={<NewRessource name={name} setName={setName} />}
        setShowModal={setShowModal}
        showFooter={true}
      />
    </div>
  );
}

export default Create;
