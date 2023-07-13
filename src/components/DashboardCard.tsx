import React from "react";
import "./DashboardCard.scss";

function DashboardCard(props: {
  children: React.ReactNode;
  ressourceType: string;
  content: string;
  title: string;
}) {
  const { children, title, ressourceType, content } = props;
  return (
    <div className="dashboard_card-ctn">
      <h1>{title}</h1>
      <p>{content}</p>
      {children}
    </div>
  );
}

export default DashboardCard;
