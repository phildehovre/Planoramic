import React, { useEffect, useRef } from "react";
import "./UpdatableInput.scss";
import { supabase } from "../App";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function UpdatableInput(props: {
  label: string;
  value: string;
  ressourceType: string | undefined;
  size?: string;
  weight?: string;
  ressourceId: string;
  type?: string;
}) {
  const {
    label,
    value,
    ressourceType,
    size = "1em",
    weight = "regular",
    type = "text",
    ressourceId,
  } = props;

  const [isEditing, setIsEditing] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value);

  const inputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  const updateUpdatableInputFn = async ({ id, key, val }: any) => {
    console.log("updateUpdatableInputFn", id, key, val, inputValue);
    return await supabase
      .from(`${ressourceType}s`)
      .update({ [key]: val })
      .eq(ressourceType + "_id", id)
      .select();
  };

  const updateUpdatableInput = useMutation({
    mutationFn: ({ id, key, val }: any) =>
      updateUpdatableInputFn({ id, key, val }),
  });

  const handleClickOutside = (event: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing && inputValue !== value) {
      updateUpdatableInput
        .mutateAsync({
          id: ressourceId,
          key: label,
          val: inputValue,
        })
        .then(() =>
          queryClient.invalidateQueries({
            queryKey: [ressourceType, { [`${ressourceType}_id`]: ressourceId }],
          })
        );
    }
  }, [isEditing, inputValue]);

  const renderInput = () => {
    if (isEditing) {
      return (
        <input
          type={type}
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
          ref={inputRef}
          placeholder={value}
        />
      );
    }
    return (
      <div
        onClick={() => setIsEditing(true)}
        className={`input-value ${size} ${weight}`}
      >
        {value}
      </div>
    );
  };

  return <div>{renderInput()}</div>;
}

export default UpdatableInput;
