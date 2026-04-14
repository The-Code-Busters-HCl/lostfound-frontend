import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Badge } from 'react-bootstrap';

const Items = () => {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ itemName: '', itemLocation: '', status: false });

  // Native fetch with Token wrapper
  const fetchAPI = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`http://localhost:8091${endpoint}`, {
      ...options,
      headers
    });
    
    if (!res.ok) throw new Error('API request failed');
    
    // For DELETE or empty responses
    const text = await res.text();
    return text ? JSON.parse(text) : {};
  };

  const fetchItems = async () => {
    try {
      const data = await fetchAPI('/items/');
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
      await fetchAPI('/items', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setShowModal(false);
      setFormData({ itemName: '', itemLocation: '', status: false });
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (item) => {
    try {
      await fetchAPI(`/items/${item.itemId}`, {
        method: 'PATCH',
        body: JSON.stringify({ 
           itemName: item.itemName,
           itemLocation: item.itemLocation,
           status: !item.status 
        })
      });
      fetchItems();
    } catch (err) {
      console.error(err);
      alert("Unauthorized or server error.");
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this item?")) {
      try {
         await fetchAPI(`/items/${id}`, { method: 'DELETE' });
         fetchItems();
      } catch (err) {
         console.error(err);
         alert("Could not delete item. You are probably not the owner!");
      }
    }
  }

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Lost & Found Items</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>Report Item</Button>
      </div>

      <Table striped bordered hover responsive className="shadow-sm bg-white">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Item Name</th>
            <th>Location</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.itemId}>
              <td>{item.itemId}</td>
              <td>{item.itemName}</td>
              <td>{item.itemLocation}</td>
              <td>
                <Badge bg={item.status ? 'success' : 'warning'}>
                  {item.status ? 'Found/Returned' : 'Lost'}
                </Badge>
              </td>
              <td>
                <Button variant="outline-success" size="sm" className="me-2" onClick={() => handleStatusChange(item)}>
                  Toggle Status
                </Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item.itemId)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center">No items reported yet.</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Report New Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Item Name</Form.Label>
              <Form.Control type="text" required onChange={(e) => setFormData({...formData, itemName: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control type="text" required onChange={(e) => setFormData({...formData, itemLocation: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check type="checkbox" label="Found/Returned (Check if not lost)" onChange={(e) => setFormData({...formData, status: e.target.checked})} />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">Submit</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Items;
