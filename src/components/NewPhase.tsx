import React from "react";
import "./NewPhase.scss";
import { FontAwesomeIcon as FontawesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import UpdatableInput from "./UpdatableInput";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../App";

function NewPhase(props: {
  phases: any;
  ressourceId: string;
  ressourceType: string | undefined;
}) {
  const { phases, ressourceId, ressourceType } = props;

  const queryClient = useQueryClient();

  const addInitialEvent = useMutation({
    mutationFn: async (event: any) =>
      await supabase.from(`${ressourceType}_events`).insert(event).select(),
  });

  console.log(phases);

  return (
    <div className="new_phase-ctn">
      <div
        className="new_phase-btn"
        onClick={() => {
          addInitialEvent
            .mutateAsync({
              phase_name: "New phase",
              phase_number: Object.keys(phases).length + 1,
              [`${ressourceType}_id`]: ressourceId,
              description: "New event",
            })
            .then((res) => {
              console.log(res);
              queryClient.invalidateQueries({
                queryKey: [`${ressourceType}_events`],
              });
            });
        }}
      >
        <FontawesomeIcon icon={faPlus} />
      </div>
    </div>
  );
}

export default NewPhase;
