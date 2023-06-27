import React, { SetStateAction, useEffect } from "react";
import "./Sidebar.scss";
import { useNavigate } from "react-router";
import Create from "./Create";
import { useParams } from "react-router-dom";
import { selectedCampaignContext } from "../contexts/SelectedCampaignContext";
import { selectedTemplateContext } from "../contexts/SelectedTemplateContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp } from "@fortawesome/free-solid-svg-icons";
("../contexts/SelectedTemplateContext");

function Sidebar(props: {
  ressources: any[];
  ressourceType: string | undefined;
}) {
  const { ressources } = props;

  const navigate = useNavigate();
  const params = useParams();

  const [displayRessources, setDisplayRessources] = React.useState<string[]>(
    []
  );

  const { setSelectedCampaignId } = React.useContext(selectedCampaignContext);
  const { setSelectedTemplateId } = React.useContext(selectedTemplateContext);

  useEffect(() => {
    if (params.ressource === "campaign") {
      setDisplayRessources((prev: string[]) => [...prev, "campaigns"]);
    }
    if (params.ressource === "template") {
      setDisplayRessources((prev: string[]) => [...prev, "templates"]);
    }
  }, []);

  const handleRessourceSelection = (ressourceType: string, id: string) => {
    if (ressourceType === "campaigns") {
      setSelectedCampaignId(id);
    }
    if (ressourceType === "templates") {
      setSelectedTemplateId(id);
    }
  };

  const renderData = () => {
    return ressources?.map((ressource: any) => {
      const type = ressource.type.slice(0, -1);
      return (
        <React.Fragment key={ressource.type}>
          <h4
            style={{ cursor: "pointer" }}
            onClick={() => {
              setDisplayRessources((prev: string[]) => {
                if (prev?.length && prev.includes(ressource.type)) {
                  return prev.filter((item) => item !== ressource.type);
                } else {
                  return [...prev, ressource.type];
                }
              });
            }}
          >
            {ressource.type.toUpperCase()}{" "}
            <FontAwesomeIcon
              icon={faCaretUp}
              className={`caret-icon ${
                displayRessources.includes(ressource.type) ? "open" : "closed"
              }`}
            />
          </h4>
          {displayRessources.includes(ressource.type) &&
            ressource.data.map((item: any) => {
              return (
                <div
                  key={item.id}
                  className="sidebar-content__item"
                  onClick={() => {
                    navigate(`/dashboard/${type}/${item[`${type}_id`]}`);
                    handleRessourceSelection(
                      ressource.type,
                      item[`${type}_id`]
                    );
                  }}
                >
                  {item.name}
                </div>
              );
            })}
          {displayRessources === ressource.type && (
            <Create ressourceType={type} />
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="sidebar">
      <div className={`sidebar-content`}>{renderData()}</div>
    </div>
  );
}

export default Sidebar;
