import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Badge } from 'react-bootstrap';
import api from '../api/api';

const Items = () => {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ itemName: '', itemLocation: '', status: false });

  const fetchItems = async () => {
    try {
      const res = await api.get('/items/');
      setItems(res.data);
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
      await api.post('/items', formData);
      setShowModal(false);
      setFormData({ itemName: '', itemLocation: '', status: false });
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    try {
      await api.patch(`/items/${id}`, { status: !currentStatus });
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this item?")) {
      try {
         await api.delete(`/items/${id}`);
         fetchItems();
      } catch (err) {
         console.error(err);
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
                <Button variant="outline-success" size="sm" className="me-2" onClick={() => handleStatusChange(item.itemId, item.status)}>
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
