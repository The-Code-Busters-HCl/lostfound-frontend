import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // 🔐 check login

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="text-center shadow">
            <Card.Body>
              <Card.Title className="display-4 text-primary">
                Welcome to Lost & Found
              </Card.Title>

              <Card.Text className="lead mt-3">
                Have you lost something? Or found an item that belongs to someone else?
                Our platform helps reunite lost belongings with their rightful owners!
              </Card.Text>

              <hr />

              <p>Login or Register to start reporting and browsing items.</p>

              <div className="mt-4">

                {/* 🔐 If logged in */}
                {token ? (
                  <Button
                    variant="success"
                    onClick={() => navigate('/dashboard')}
                  >
                    Go to Dashboard
                  </Button>
                ) : (
                  <>
                    {/* 🔓 If not logged in */}
                    <Button
                      variant="primary"
                      className="me-3"
                      onClick={() => navigate('/login')}
                    >
                      Login
                    </Button>

                    <Button
                      variant="outline-primary"
                      onClick={() => navigate('/register')}
                    >
                      Register
                    </Button>
                  </>
                )}

              </div>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;