import React, { useEffect } from "react";
import RessourceLayout from "../layouts/RessourceLayout";
import { Outlet, useParams } from "react-router";
import RessourceHeader from "../components/RessourceHeader";
import { useSession } from "@supabase/auth-helpers-react";
import { useCampaign, useTemplate } from "../util/db";
import Spinner from "../components/Spinner";

function RessourcePage(props: any) {
  const session = useSession();
  const { ressource: ressourceType, id } = useParams();

  const [ressource, setRessource] = React.useState<any>(undefined);

  const {
    data: templateData,
    isLoading: isTemplateLoading,
    error: templateError,
  } = useTemplate(id, ressourceType === "template" && id ? true : false);

  const {
    data: campaignData,
    isLoading: isCampaignLoading,
    error: campaignError,
  } = useCampaign(id, ressourceType === "campaign" && id ? true : false);

  useEffect(() => {
    setRessource(ressourceType === "template" ? templateData : campaignData);
  }, [ressourceType, templateData, campaignData]);

  const headerProps = {
    ressource: ressourceType === "template" ? templateData : campaignData,
    ressourceType: ressourceType,
  };

  return (
    <>
      {!ressource && <Spinner />}
      {ressource && (
        <RessourceLayout
          header={<RessourceHeader {...headerProps} />}
          outlet={<Outlet />}
        />
      )}
    </>
  );
}

export default RessourcePage;
