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
  inputType?: string;
  onClick?: () => void;
}) {
  const {
    label,
    value,
    ressourceType,
    size = "1em",
    weight = "regular",
    type = "text",
    ressourceId,
    inputType,
  } = props;

  const [isEditing, setIsEditing] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value);
  const [initialValue, setInitialtValue] = React.useState(value);

  useEffect(() => {
    setInitialtValue(value);
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  const updateUpdatableInputFn = async ({ id, key, val }: any) => {
    if (inputType === "phase") {
      return await supabase
        .from(`${ressourceType}_events`)
        .update({ [key]: inputValue })
        .eq(ressourceType + "_id", id)
        .eq(key, initialValue)
        .select();
    }
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
        .then((res) => {
          console.log(res);
          queryClient.invalidateQueries({
            queryKey: [[`${ressourceType}_events`]],
          });
        })
        .then((res) =>
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
          className={`input ${size} ${weight}`}
          type={type}
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
          ref={inputRef}
          placeholder={value}
          size={value.length}
          autoFocus
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
