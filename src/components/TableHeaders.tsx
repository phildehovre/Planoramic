import React from "react";

function TableHeaders(props: {
  ressourceType: string | undefined;
  keys: string[];
}) {
  const { ressourceType, keys } = props;

  const renderColumnHeaders = () => {
    let labels: any = {
      description: "Task",
      position: "When",
      category: "Category",
      entity_responsible: "Who",
    };
    return keys.map((key: string) => {
      return (
        <div className={`cell-ctn headers  ${key} ${ressourceType}`} key={key}>
          {labels[key]}
        </div>
      );
    });
  };

  return (
    <div
      style={{ backgroundColor: "white" }}
      className={`row-ctn ${ressourceType} headers`}
    >
      {renderColumnHeaders()}
    </div>
  );
}

export default TableHeaders;
