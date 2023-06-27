import React from "react";

interface NotFoundProps {
  message?: string;
}

const NotFound: React.FC<NotFoundProps> = ({ message }) => {
  return (
    <div>
      <h1>404 - Not Found</h1>
      {message && <p>{message}</p>}
    </div>
  );
};

export default NotFound;
