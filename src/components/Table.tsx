import React, { Dispatch, SetStateAction, useEffect } from "react";
import Row from "./Row";
import "./Table.scss";
import TableHeader from "./TableHeader";
import { supabase } from "../App";
import Phase from "./Phase";
import ErrorNotification from "./ErrorNotification";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { formatAndUpdateEvent } from "../apis/googleCalendar";
import { useSession } from "@supabase/auth-helpers-react";
import { selectedCampaignContext } from "../contexts/SelectedCampaignContext";
import { useCampaign } from "../util/db";
import NewRow from "./NewRow";
import TableHeaders from "./TableHeaders";

const schema = yup.object().shape({
  position: yup.number().min(1).required("A duration is required"),
  position_units: yup.string().required("Select days, weeks, or month(s)"),
  category: yup.string().required("Please chose a category"),
  description: yup.string().required("A description is required"),
  entity_responsible: yup.string().required("Select a responsible entity"),
  type: yup.string().required("Select a type of task"),
});

function Table(props: {
  ressource: any;
  ressourceType: string | undefined;
  selectedRows: any[];
  setSelectedRows: Dispatch<SetStateAction<any[]>>;
}) {
  const { ressource, ressourceType } = props;
  const queryClient = useQueryClient();
  const session = useSession();
  const { selectedRows, setSelectedRows } = props;

  const [eventId, setEventId] = React.useState(null);
  // const [selectedRows, setSelectedRows] = React.useState<any[]>([]);
  const [phases, setPhases] = React.useState<any>({});

  const {
    register,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const { selectedCampaignId } = React.useContext(selectedCampaignContext);
  const { data: campaignData } = useCampaign(
    selectedCampaignId,
    !!selectedCampaignId
  );

  const templateKeys = [
    "position",
    "position_units",
    "category",
    "description",
    "entity_responsible",
  ];
  const campaignKeys = [
    "position",
    "category",
    "description",
    "entity_responsible",
    "completed",
  ];
  const keys = ressourceType === "template" ? templateKeys : campaignKeys;

  useEffect(() => {
    let data = ressource?.data?.data;
    let phases: any = {};
    for (let i = 0; i < data?.length; i++) {
      if (!phases[data[i].phase_number] && data[i].phase_number !== null) {
        phases[data[i].phase_number] = data[i].phase_name;
      }
    }
    setPhases(phases);
  }, [ressource]);

  const updateCellFn = async ({ id, key, val }: any) => {
    return await supabase
      .from(`${ressourceType}_events`)
      .update({ [key]: val })
      .eq("id", id)
      .select();
  };

  const updateCell = useMutation({
    mutationFn: ({ id, key, val }: any) => updateCellFn({ id, key, val }),
  });

  const onSubmit = (formData: any) => {
    try {
      let keys = Object.keys(formData);
      let key = keys[0];
      let value = formData[key];
      updateCell
        .mutateAsync({ id: eventId, key: key, val: value })
        .then((res: any) => {
          formatAndUpdateEvent(
            res.data[0],
            campaignData?.data?.targetDate,
            session
          );
          queryClient.invalidateQueries({
            queryKey: [`${ressourceType}_events`],
          });
        });
    } catch (error) {
      alert(error);
    }
  };

  const rowProps = {
    keys: keys,
    onSubmit: onSubmit,
    setEventId: setEventId,
    selectedRows: selectedRows,
    setSelectedRows: setSelectedRows,
    eventId: eventId,
    ressourceType: ressourceType,
  };

  const newRowProps = {
    propKeys: ["description"],
    onSubmit: onSubmit,
    ressource: ressource,
    ressourceType: ressourceType,
    register: register,
  };

  const renderPhases = () => {
    let data = ressource?.data?.data;
    let phaseKeys = Object.keys(phases);
    return phaseKeys.map((phase: any, i: number) => {
      let phaseEvents = data?.filter((row: any) => {
        return row.phase_number === Number(phaseKeys[i]);
      });
      return (
        <Phase
          name={phases[phase]}
          number={phase}
          events={phaseEvents}
          rowProps={rowProps}
          key={phase}
          newRowProps={newRowProps}
          ressourceType={ressourceType}
        />
      );
    });
  };

  const renderRows = () => {
    let data = ressource?.data?.data;
    // .sort((a: any, b: any) => dayjs(a.position).isAfter(dayjs(b.position)? -1 : 1))
    return data?.map((row: any) => {
      if (row.phase_number === null) {
        return <Row row={row} key={row.id} {...rowProps} />;
      }
    });
  };

  const renderRowswithoutPhase = () => {
    let data = ressource?.data?.data.filter((row: any) => {
      return row.phase_number === null;
    });
    if (data?.length > 0) {
      return (
        <>
          <TableHeaders keys={keys} ressourceType={ressourceType} />
          {data?.map((row: any) => {
            return <Row row={row} key={row.id} {...rowProps} />;
          })}
        </>
      );
    }
  };

  return (
    <div className="table-ctn">
      <TableHeader
        setSelectedRows={setSelectedRows}
        selectedRows={selectedRows}
        ressource={ressource}
        ressourceType={ressourceType}
        events={ressource?.data?.data}
        phases={phases}
      />
      {/* <ErrorNotification ressourceType={ressourceType} ressource={ressource} /> */}
      {ressource?.data?.data.length > 0 && renderPhases()}
      {ressource?.data?.data.length === 0 ? (
        <>
          <h3>No events yet.</h3>
          <NewRow keys={["description"]} {...newRowProps} />
        </>
      ) : (
        <>{renderRowswithoutPhase()}</>
      )}
    </div>
  );
}

export default Table;
