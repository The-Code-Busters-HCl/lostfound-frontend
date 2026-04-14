import React, { useState, useEffect } from "react";
import { Container, Table, Button, Modal, Form, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const Items = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    itemName: "",
    itemLocation: "",
    status: false,
    seeker: null,
  });

  // Native fetch with Token wrapper
  const fetchAPI = async (endpoint, options = {}) => {
    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`http://localhost:8091${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) throw new Error("API request failed");

    // For DELETE or empty responses
    const text = await res.text();
    return text ? JSON.parse(text) : {};
  };

  const fetchItems = async () => {
    try {
      const data = await fetchAPI("/items/");
      setItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetchAPI("/items", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      setShowModal(false);
      setFormData({ itemName: "", itemLocation: "", status: false });
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await fetchAPI(`/items/${id}`, { method: "DELETE" });
        fetchItems();
      } catch (err) {
        console.error(err);
        alert("Could not delete item. You are probably not the owner!");
      }
    }
  };

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Lost & Found Items</h2>
        <Button variant="primary" onClick={() => navigate("/createitem")}>
          Report New Item
        </Button>
      </div>

      <Table striped bordered hover responsive className="shadow-sm bg-white">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Item Name</th>
            <th>Location</th>
            <th>Seeker ID</th>
            <th>Seeker MobileNo</th>
            <th>Owner ID</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.itemId}>
              <td>{item.itemId}</td>

              <td>{item.itemName || "N/A"}</td>

              <td>{item.itemLocation || "N/A"}</td>

              {/* 🔐 Seeker */}
              <td>
                {item.seeker
                  ? `${item.seeker?.name || "N/A"}`
                  : "No User"}
              </td>
              <td>
                {item.seeker
                  ? `${item.seeker?.mobileNo || "N/A"}`
                  : "No User"}
              </td>
              {/* 👤 Owner */}
              <td>{item.owner ? item.owner.userId : "No User"}</td>

              {/* 📊 Status */}
              <td>
                <Badge bg={item.status ? "success" : "warning"}>
                  {item.status ? "Found/Returned" : "Lost"}
                </Badge>
              </td>

              {/* ⚙️ Actions */}
              <td>
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-2"
                  onClick={() => navigate(`/updateitem/${item.itemId}`)}
                >
                  Update
                </Button>

                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(item.itemId)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}

          {items.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center">
                No items reported yet.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default Items;
