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
    data: campaignData,
    isLoading: isCampaignLoading,
    error: campaignError,
  } = useCampaign(id, ressourceType === "campaign" && id ? true : false);

  const templateToFetchId =
    ressourceType === "template" ? id : campaignData?.data?.template_id;

  const {
    data: templateData,
    isLoading: isTemplateLoading,
    error: templateError,
  } = useTemplate(id || templateToFetchId, templateToFetchId ? true : false);

  console.log(templateData);

  const { data: campaignTemplateData } = useTemplate(
    campaignData?.data?.template_id,
    campaignData?.data?.template_id ? true : false
  );

  useEffect(() => {
    setRessource(ressourceType === "template" ? templateData : campaignData);
  }, [ressourceType, templateData, campaignData]);

  const headerProps = {
    ressource: ressourceType === "template" ? templateData : campaignData,
    ressourceType: ressourceType,
    campaignTemplateData: campaignTemplateData,
  };
  console.log(ressource);
  return (
    <>
      {ressource && ressource?.data?.template_id && (
        <RessourceLayout
          header={<RessourceHeader {...headerProps} />}
          outlet={<Outlet />}
        />
      )}
      {!ressource && <Spinner />}
    </>
  );
}

export default RessourcePage;
