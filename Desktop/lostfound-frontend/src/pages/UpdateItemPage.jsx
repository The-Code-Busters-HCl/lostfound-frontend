import React, { useEffect, useState } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import UserInfoTable from "./UserInfoTable"; // ✅ IMPORTANT

const UpdateItemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    itemName: "",
    itemLocation: "",
    seekerId: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔥 Owner states
  const [ownerFound, setOwnerFound] = useState(false);
  const [ownerId, setOwnerId] = useState("");
  const [ownerData, setOwnerData] = useState(null);
  const [ownerError, setOwnerError] = useState("");

  // 🔐 API wrapper
  const fetchAPI = async (endpoint, options = {}) => {
    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`http://localhost:8091${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) throw new Error("API error");

    const text = await res.text();
    return text ? JSON.parse(text) : {};
  };

  // 📦 Fetch item
  const fetchItem = async () => {
    try {
      const data = await fetchAPI(`/items/${id}`);

      setFormData({
        itemName: data.itemName || "",
        itemLocation: data.itemLocation || "",
        seekerId: data.seeker?.userId || "",
      });
    } catch {
      setError("Failed to load item");
    }
  };

  // 🔍 Fetch owner details
  const fetchOwner = async () => {
    try {
      if (!ownerId) {
        setOwnerError("Please enter Owner ID");
        return;
      }

      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:8091/userdetails/${ownerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      setOwnerData(data);
      setOwnerError("");
    } catch {
      setOwnerData(null);
      setOwnerError("No owner found");
    }
  };

  useEffect(() => {
    fetchItem();
  }, []);

  // 🚀 Update item
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await fetchAPI(`/items/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          itemName: formData.itemName,
          itemLocation: formData.itemLocation,
          seekerId: formData.seekerId || null,
          ownerId: ownerFound ? ownerId : null, // ✅ NEW
        }),
      });

      setSuccess("Item updated successfully!");
      setError("");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch {
      setError("Update failed");
      setSuccess("");
    }
  };

  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Card style={{ width: "500px" }} className="shadow">
        <Card.Body>
          <h4 className="text-center mb-3">Update Item</h4>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleUpdate}>
            {/* Item Name */}
            <Form.Group className="mb-3">
              <Form.Label>Item Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.itemName}
                onChange={(e) =>
                  setFormData({ ...formData, itemName: e.target.value })
                }
                required
              />
            </Form.Group>

            {/* Location */}
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={formData.itemLocation}
                onChange={(e) =>
                  setFormData({ ...formData, itemLocation: e.target.value })
                }
                required
              />
            </Form.Group>

            {/* Seeker */}
            <Form.Group className="mb-4">
              <Form.Label>Seeker ID</Form.Label>
              <Form.Control
                type="number"
                value={formData.seekerId}
                onChange={(e) =>
                  setFormData({ ...formData, seekerId: e.target.value })
                }
              />
            </Form.Group>

            {/* 🔄 Owner Toggle */}
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                label="Owner Found"
                checked={ownerFound}
                onChange={(e) => {
                  setOwnerFound(e.target.checked);
                  if (!e.target.checked) {
                    setOwnerId("");
                    setOwnerData(null);
                  }
                }}
              />
            </Form.Group>

            {/* 👤 Owner Section */}
            {ownerFound && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Owner User ID</Form.Label>

                  <div className="d-flex gap-2">
                    {/* 🔢 3/4 Input */}
                    <Form.Control
                      type="number"
                      placeholder="Enter Owner ID"
                      value={ownerId}
                      onChange={(e) => {
                        setOwnerId(e.target.value);
                        setOwnerData(null);
                      }}
                      style={{ flex: 3 }}
                    />
                    {/* 1/4 fetch buttoin */}
                    <Button
                      variant="info"
                      onClick={fetchOwner}
                      style={{ flex: 1 }}
                      disabled={!ownerId} // 🔥 main logic
                    >
                      Fetch
                    </Button>
                  </div>
                </Form.Group>

                {/* ❌ Error */}
                {ownerError && (
                  <p className="text-danger text-center">{ownerError}</p>
                )}

                {/* ✅ Owner Info */}
                <UserInfoTable user={ownerData} />
              </>
            )}

            <Button variant="warning" type="submit" className="w-100">
              Update Item
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UpdateItemPage;
