import React, { useEffect } from "react";
import "./ErrorNotification.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClose,
  faQuestion,
  faQuestionCircle,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";

function ErrorNotification(props: {
  ressourceType?: string;
  ressource?: any;
  show: boolean;
  setshow: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element {
  const { ressourceType, ressource, show, setShow } = props;

  const [type, setType] = React.useState<string>("warning");
  const [additionnalContent, setAdditionnalContent] =
    React.useState<string>("");

  useEffect(() => {
    // Test for emtpy cells
    setType("error");
    setAdditionnalContent(
      `All template cell must be filled before creating a campaign.`
    );
  }, [ressource]);

  const renderNotificationContent = () => {
    switch (type) {
      case "tips":
        return (
          <>
            <FontAwesomeIcon icon={faQuestionCircle} color="blue" size="lg" />
            <h3>Tip</h3>
            <p>Here is a tip: tippity tip</p>
          </>
        );
      case "error":
        return (
          <>
            <FontAwesomeIcon icon={faWarning} color="red" size="lg" />
            <h3>Error</h3>
            <p>Some cells require your attention:</p>
            <p>{additionnalContent}</p>
          </>
        );
      case "warning":
        return (
          <>
            <FontAwesomeIcon icon={faWarning} color="orange" size="lg" />
            <h3>Warning</h3>
            <p>This is all wrong</p>
          </>
        );
      default:
        return (
          <>
            <FontAwesomeIcon icon={faQuestion} color="blue" size="lg" />
          </>
        );
    }
  };

  return (
    <>
      {show && type && (
        <div className={`notification-ctn ${type}`}>
          <FontAwesomeIcon
            icon={faClose}
            className="close"
            onClick={() => setShow(false)}
          />
          <span>{renderNotificationContent()}</span>
        </div>
      )}
    </>
  );
}

export default ErrorNotification;
