import React, { useEffect, useRef } from "react";
import Row from "./Row";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faCaretDown,
  faCaretUp,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";
import NewRow from "./NewRow";
import Modal from "./Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../App";
import Dropdown from "./Dropdown";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import TableHeaders from "./TableHeaders";
import UpdatableInput from "./UpdatableInput";

function Phase(props: {
  name: string;
  events: any;
  number: number;
  rowProps: {
    keys: string[];
    setSelectedRows: React.Dispatch<React.SetStateAction<any[]>>;
    selectedRows: string[];
  };
  newRowProps: any;
  ressourceType: string | undefined;
}) {
  const [isChecked, setIsChecked] = React.useState(false);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [modalCallback, setModalCallback] = React.useState<any>(null);
  const [modalPrompt, setModalPrompt] = React.useState("");
  const [showModal, setShowModal] = React.useState(false);
  const [showPhase, setShowPhase] = React.useState(1);
  const contentRef = useRef();

  const {
    name: phaseName,
    events,
    number: phaseNumber,
    rowProps,
    newRowProps,
    ressourceType,
  } = props;

  const { keys, setSelectedRows, selectedRows } = rowProps;
  const ressourceId =
    ressourceType === "template"
      ? events[0].template_id
      : events[0].campaign_id;

  const queryClient = useQueryClient();

  useEffect(() => {
    if (
      selectedRows.length === 0 ||
      !events.every((event: any) => selectedRows.includes(event.id))
    ) {
      setIsChecked(false);
    }

    if (events.every((event: any) => selectedRows.includes(event.id))) {
      setIsChecked(true);
    }
  }, [selectedRows]);

  const handleSelectAllPhaseEvents = () => {
    let phaseEvents = events?.map((event: any) => {
      return event.id;
    });
    if (!isChecked) {
      setSelectedRows((prev) => [...prev, ...phaseEvents]);
      setIsChecked(true);
    } else if (isChecked) {
      setSelectedRows((prev) =>
        prev.filter((id: string) => !phaseEvents.includes(id))
      );
      setIsChecked(false);
    }
  };

  const deletePhaseMutation = useMutation(async () => {
    const res = await supabase
      .from(`${ressourceType}_events`)
      .delete()
      .eq("phase_name", phaseName)
      .eq("phase_number", phaseNumber);
    return res;
  }, {});

  const deletePhase = () => {
    deletePhaseMutation
      .mutateAsync()
      .then((res) =>
        queryClient.invalidateQueries([`${ressourceType}_events`])
      );
  };

  const duplicatePhaseMutation = useMutation(async () => {
    await supabase.from(`${ressourceType}_events`).insert(
      events.map((event: any) => {
        const { id, ...newEvent } = event;
        return {
          ...newEvent,
          phase_number: phaseNumber + 1,
          phase_name: phaseName + " (copy)",
        };
      })
    );
  });

  const duplicatePhase = () => {
    duplicatePhaseMutation
      .mutateAsync()
      .then((res) =>
        queryClient.invalidateQueries([`${ressourceType}_events`])
      );
  };

  const handlePhaseDisplay = () => {
    if (showPhase == phaseNumber) {
      setShowPhase(0);
    } else {
      setShowPhase(phaseNumber);
    }
  };

  const handleOptionClick = (option: string) => {
    setShowModal(true);
    if (option === "Delete") {
      setModalCallback(() => deletePhase);
      setModalPrompt("Are you sure you want to delete this phase?");
    } else if (option === "Duplicate") {
      duplicatePhase();
      setModalPrompt("");
    }
    setShowDropdown(false);
  };

  const renderRows = () => {
    return events?.map((row: any) => {
      return <Row row={row} key={row.id} {...rowProps} />;
    });
  };

  return (
    <>
      <span className="phase-header">
        <div className="checkbox-ctn">
          <Checkbox.Root
            className="CheckboxRoot"
            checked={isChecked}
            onCheckedChange={handleSelectAllPhaseEvents}
          >
            <Checkbox.Indicator className="CheckboxIndicator">
              <CheckIcon />
            </Checkbox.Indicator>
          </Checkbox.Root>
        </div>
        <UpdatableInput
          onClick={handlePhaseDisplay}
          label={"phase_name"}
          value={phaseName}
          ressourceType={ressourceType}
          ressourceId={ressourceId}
          inputType="phase"
          weight="bold"
          size="large"
        ></UpdatableInput>
        <span
          style={{
            position: "relative",
            cursor: "pointer",
            padding: "0 1.5em",
          }}
        >
          <FontAwesomeIcon
            icon={faEllipsis}
            onClick={() => setShowDropdown(true)}
          />
          {showDropdown && (
            <Dropdown
              options={["Duplicate", "Delete"]}
              onOptionClick={(option: string) => {
                handleOptionClick(option);
              }}
              setIsOpen={setShowDropdown}
            />
          )}
        </span>
        <div onClick={handlePhaseDisplay} className="phase-toggle">
          {showPhase == phaseNumber ? (
            <FontAwesomeIcon icon={faCaretUp} />
          ) : (
            <FontAwesomeIcon icon={faCaretDown} />
          )}
        </div>
      </span>
      <div className="phase-ctn">
        {showPhase == phaseNumber && (
          <>
            <TableHeaders keys={keys} ressourceType={ressourceType} />
            {renderRows()}
            <NewRow
              {...newRowProps}
              phaseNumber={phaseNumber}
              phaseName={phaseName}
            />
          </>
        )}
        <Modal
          onClose={() => setShowModal(false)}
          onSave={modalCallback}
          title={modalPrompt}
          showModal={showModal && modalPrompt !== ""}
          setShowModal={setShowModal}
          showFooter={true}
        />
      </div>
    </>
  );
}

export default Phase;
