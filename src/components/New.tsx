import React from "react";
import { Outlet } from "react-router";
import Create from "./Create";
import NewResLayout from "../layouts/NewResLayout";
import DashboardCard from "./DashboardCard";

function New() {
  const content = {
    template:
      "Discover our revolutionary template creation feature for social media marketing campaigns! Design a schema with visuals, copy, and posting schedules. Customize details like event dates, campaign names, and content for different audiences. Streamline your marketing process, ensuring brand consistency and saving time.",
    campaign:
      "Maximize your social media marketing potential with our comprehensive campaign management system. Integrate templates, manage multiple campaigns, and track metrics in one intuitive dashboard. Monitor post success, engage with your audience, and analyze performance for optimized strategy. Focus on content creation while our system ensures flawless execution and outstanding results.",
  };

  return (
    <NewResLayout
      content={
        <>
          <DashboardCard
            ressourceType="template"
            title="Template Creation for Social Media Marketing Campaigns"
            content={content.template}
          >
            <Create ressourceType="template" content="Create template" />
          </DashboardCard>
          <DashboardCard
            ressourceType="campaign"
            title=" Campaign Management System"
            content={content.campaign}
          >
            <Create ressourceType="campaign" content="Create campaign" />
          </DashboardCard>
        </>
      }
    />
  );
}

export default New;
