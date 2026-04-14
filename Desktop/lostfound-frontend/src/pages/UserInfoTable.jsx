import React from "react";
import { Card } from "react-bootstrap";

const UserInfoTable = ({ user }) => {
  if (!user) return null;

  return (
    <Card className="p-3 mt-3 bg-light">
      <h6 className="text-primary">User Details</h6>
      <hr />
      <p><b>Name:</b> {user?.name || "N/A"}</p>
      <p><b>Branch:</b> {user?.branch || "N/A"}</p>
      <p><b>Mobile:</b> {user?.mobileNo || "N/A"}</p>
      <p><b>Email:</b> {user?.email || "N/A"}</p>
    </Card>
  );
};

export default UserInfoTable;