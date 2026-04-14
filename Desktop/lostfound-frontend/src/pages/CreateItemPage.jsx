import React, { useState } from "react";
import {
  Container,
  Form,
  Button,
  Card,
  Alert,
  Row,
  Col,
} from "react-bootstrap";

import UserInfoTable from "./UserInfoTable";

const CreateItemPage = () => {
  const [formData, setFormData] = useState({
    itemName: "",
    itemLocation: "",
    seekerId: "",
  });

  const [seekerData, setSeekerData] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ validation AFTER state
  const isFormValid =
    formData.itemName.trim() !== "" &&
    formData.itemLocation.trim() !== "" &&
    formData.seekerId !== "" &&
    seekerData !== null;

  // 🔍 Fetch seeker
  const fetchSeeker = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:8091/userdetails/${formData.seekerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) throw new Error();

      const data = await res.json();
      setSeekerData(data);
      setError("");
    } catch {
      setSeekerData(null);
      setError("No details found");
    }
  };

  // 🚀 Submit item
  const handleSubmit = async () => {
    try {
      if (!seekerData) {
        setError("Please fetch valid seeker first");
        return;
      }

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8091/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemName: formData.itemName,
          itemLocation: formData.itemLocation,
          seekerId: formData.seekerId,
        }),
      });

      if (!res.ok) throw new Error();

      setSuccess("Item created successfully!");
      setError("");
      setFormData({ itemName: "", itemLocation: "", seekerId: "" });
      setSeekerData(null);
    } catch {
      setSuccess("");
      setError("Failed to create item");
    }
  };

  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Card style={{ width: "500px" }} className="shadow">
        <Card.Body>
          <h4 className="text-center mb-3">Report Item</h4>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Item Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.itemName}
                onChange={(e) =>
                  setFormData({ ...formData, itemName: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={formData.itemLocation}
                onChange={(e) =>
                  setFormData({ ...formData, itemLocation: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Seeker ID</Form.Label>
              <Form.Control
                type="number"
                value={formData.seekerId}
                onChange={(e) => {
                  setFormData({ ...formData, seekerId: e.target.value });
                  setSeekerData(null); // 🔥 reset validation
                }}
              />
            </Form.Group>

            <Row className="mb-3">
              <Col>
                <Button
                  variant="info"
                  className="w-100"
                  onClick={fetchSeeker}
                  disabled={
                    !formData.seekerId || formData.seekerId.trim() === ""
                  }
                >
                  Fetch Seeker
                </Button>
              </Col>
              <Col>
                <Button
                  variant="success"
                  className="w-100"
                  onClick={handleSubmit}
                  disabled={!isFormValid}
                >
                  Submit Item
                </Button>
              </Col>
            </Row>

            {/* helper message */}
            {!isFormValid && (
              <p className="text-muted text-center">
                Fill all fields & fetch valid seeker
              </p>
            )}
            {/* seeker details */}
            <UserInfoTable user={seekerData} title="Seeker Details" />

            {!seekerData && error && (
              <p className="text-danger text-center">No details found</p>
            )}
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateItemPage;
