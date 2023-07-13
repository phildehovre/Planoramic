import React from "react";
import "./NewPhase.scss";
import { FontAwesomeIcon as FontawesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import UpdatableInput from "./UpdatableInput";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../App";
import Spinner from "./Spinner";

function NewPhase(props: {
  phases: any;
  ressourceId: string;
  ressourceType: string | undefined;
}) {
  const { phases, ressourceId, ressourceType } = props;

  const queryClient = useQueryClient();
  //   const [user] = useAuthState(getAuth());

  const addInitialEvent = useMutation({
    mutationFn: async (event: any) =>
      await supabase.from(`${ressourceType}_events`).insert(event).select(),
  });

  const incrementPhaseNumber = (phasesObject: any) => {
    const phaseNumbers = Object.keys(phasesObject);
    let newPhaseNumber = 1;
    console.log(phaseNumbers, newPhaseNumber);
    while (phaseNumbers.includes(newPhaseNumber.toString())) {
      newPhaseNumber = newPhaseNumber + 1;
    }
    return newPhaseNumber;
  };

  const handleCreatePhaseAndInitialEvent = () => {
    addInitialEvent
      .mutateAsync({
        // author_id: user?.uid,
        phase_name: "New phase",
        phase_number: incrementPhaseNumber(phases),
        [`${ressourceType}_id`]: ressourceId,
        description: "New event",
      })
      .then((res) => {
        queryClient.invalidateQueries({
          queryKey: [`${ressourceType}_events`],
        });
      });
  };

  return (
    <div className="new_phase-ctn">
      <div className="new_phase-btn" onClick={handleCreatePhaseAndInitialEvent}>
        {addInitialEvent.isLoading ? (
          <Spinner />
        ) : (
          <>
            <FontawesomeIcon icon={faPlus} />
            <p>New phase</p>
          </>
        )}
      </div>
    </div>
  );
}

export default NewPhase;
