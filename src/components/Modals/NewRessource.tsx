import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import "./Modals.scss";

function NewRessource(props: {
  name: string | undefined;
  setName: (description: string) => void;
  placeholder?: string | undefined;
  ressource?: any;
  type?: string;
}) {
  const { setName, name, type } = props;

  return (
    <div className="new_ressource-modal">
      <input
        autoFocus
        placeholder={`Name your new ${type}`}
        onChange={(e) => {
          setName(e.target.value);
        }}
        value={name}
      />
    </div>
  );
}

export default NewRessource;
