import React, { useEffect, useRef } from "react";
import "./UpdatableInput.scss";
import { supabase } from "../App";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function UpdatableInput(props: {
  label: string;
  value: string | number | undefined;
  ressourceType: string | undefined;
  size?: string;
  weight?: string;
  ressourceId: string;
  type?: string;
  inputType?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  placeholder?: string;
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
    placeholder,
  } = props;

  const [isEditing, setIsEditing] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value);
  const [initialValue, setInitialtValue] = React.useState(value);

  useEffect(() => {
    setInitialtValue((prev) => (value !== prev ? value : prev));
  }, [value]);

  const inputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  const updateUpdatableInputFn = async ({ id, key, val }: any) => {
    if (label.includes("phase")) {
      const { data: existingPhase } = await supabase
        .from(`${ressourceType}_events`)
        .select()
        .eq(ressourceType + "_id", id)
        .eq("phase_name", val);

      if (existingPhase && existingPhase.length === 0) {
        return await supabase
          .from(`${ressourceType}_events`)
          .update({ [key]: inputValue })
          .eq(ressourceType + "_id", id)
          .eq(key, initialValue)
          .select();
      } else {
        alert("Phase name already exists");
        setInputValue(initialValue);
      }
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
          // console.log(res);
          queryClient.invalidateQueries({
            queryKey: [`${ressourceType}_events`, ressourceId],
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
    if (isEditing && label === "phase_name") {
      return (
        <input
          className={`input ${size} ${weight}`}
          type={inputType}
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
          ref={inputRef}
          autoFocus
        />
      );
    }
    if (isEditing && label === "phase_number") {
      return (
        <input
          className={`input ${size} ${weight}`}
          type={type}
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
          ref={inputRef}
          placeholder={value?.toString()}
          size={value?.toString().length}
          autoFocus
        />
      );
    }
    if (isEditing && !label.includes("phase")) {
      return (
        <input
          className={`input ${size} ${weight}`}
          type={type}
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
          ref={inputRef}
          placeholder={value?.toString()}
          size={value?.toString().length}
          autoFocus
        />
      );
    }
    return (
      <div
        onClick={() => setIsEditing(true)}
        className={`input-value ${size} ${weight} ${label}`}
      >
        {label === "phase_number" && `Phase `}
        {value}
        {!value && placeholder && (
          <span className="placeholder italic">{placeholder}</span>
        )}
      </div>
    );
  };
  return <div>{renderInput()}</div>;
}

export default UpdatableInput;
