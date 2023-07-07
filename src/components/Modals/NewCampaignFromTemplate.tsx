import React, { useEffect } from "react";
import "./Modals.scss";
import { useForm } from "react-hook-form";
import * as yup from "yup";

function NewCampaignFromTemplate(props: {
  placeholder?: string | undefined;
  ressource?: any;
  ressourceType?: string | undefined;
  onSubmit: any;
}) {
  const { ressource, ressourceType, onSubmit } = props;

  const { handleSubmit, register } = useForm();

  async function handleFormSubmit(data: any) {
    await handleSubmit((formData: any) => onSubmit(formData))(data);
    // This code will execute after the handleSubmit Promise is resolved
  }

  return (
    <form className="modal_form-ctn" onSubmit={handleFormSubmit}>
      <input
        type="text"
        {...register("artistName")}
        name="artistName"
        placeholder="Artist name..."
        autoComplete="off"
      />
      <input
        type="text"
        {...register("songName")}
        name="songName"
        placeholder="Song title..."
        autoComplete="off"
      />
      <input type="date" {...register("targetDate")} name="targetDate" />
      <button className="new_campaign-btn" type="submit">
        Create
      </button>
    </form>
  );
}

export default NewCampaignFromTemplate;
