import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';

const Navigation = ({ setCurrentPage }) => {
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentPage('login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand href="#" onClick={() => setCurrentPage('home')}>Lost & Found</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => setCurrentPage('home')}>Home</Nav.Link>
            {token && <Nav.Link onClick={() => setCurrentPage('dashboard')}>Items</Nav.Link>}
          </Nav>
          <Nav>
            {!token ? (
              <>
                <Nav.Link onClick={() => setCurrentPage('login')}>Login</Nav.Link>
                <Nav.Link onClick={() => setCurrentPage('register')}>Register</Nav.Link>
              </>
            ) : (
              <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
