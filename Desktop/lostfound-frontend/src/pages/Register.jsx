import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';

const Register = ({ setCurrentPage }) => {
  const [formData, setFormData] = useState({
    name: '', branch: '', year: '', mobileNo: '', email: '', password: '', role: 'USER'
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8091/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
         let errorMsg = 'Registration failed.';
         try {
             const errorData = await response.json();
             errorMsg = errorData.message || errorMsg;
         } catch(e) {
             const textData = await response.text();
             errorMsg = textData || errorMsg;
         }
         throw new Error(errorMsg);
      }
      setCurrentPage('login');
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || 'Registration failed. Please check your data.');
    }
  };

  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Card style={{ width: '600px' }} className="shadow">
        <Card.Body>
          <h3 className="text-center mb-4">Register</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleRegister}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control type="text" name="name" onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                 <Form.Group className="mb-3">
                  <Form.Label>Mobile No.</Form.Label>
                  <Form.Control type="text" name="mobileNo" onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Branch</Form.Label>
                  <Form.Control type="text" name="branch" onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                 <Form.Group className="mb-3">
                  <Form.Label>Year</Form.Label>
                  <Form.Control type="number" name="year" onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" name="email" onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" onChange={handleChange} required />
            </Form.Group>
            <Button variant="success" type="submit" className="w-100">
              Register
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;
