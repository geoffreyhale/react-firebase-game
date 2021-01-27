/**
 * FrontPage is intended to serve as home for unauthorized users
 */
import React from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import About from '../About';
import { LogInButton } from '../UserAuth';

const FrontPage = ({ login }) => (
  <>
    {/* <Card className="mt-1">
      <Card.Body
        style={{
          paddingBottom: '0.25rem',
          paddingTop: '0.25rem',
        }}
      >
        <div>
          <small className="text-muted">
            <em>
              New online community that will never sell your data.
              <br />
              Join the discussion now for free.
            </em>
          </small>
        </div>
      </Card.Body>
    </Card> */}
    <div className="mt-3">
      <About />
    </div>
    <Row>
      <Col></Col>
      <Col sm={8}>
        <Card className="mt-3">
          <Card.Body style={{ textAlign: 'center' }}>
            <LogInButton
              login={login}
              style={{ fontSize: '2rem', padding: '1rem' }}
            >
              Start Here
            </LogInButton>
          </Card.Body>
        </Card>
      </Col>
      <Col></Col>
    </Row>
  </>
);
export default FrontPage;
