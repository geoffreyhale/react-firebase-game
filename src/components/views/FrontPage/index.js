/**
 * FrontPage is intended to serve as home for unauthorized users
 */
import React from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Row from 'react-bootstrap/Row';
import About from '../About';
import { LogInButton } from '../../App/AppHeader';

const Login403DisallowedUseragent = () => (
  <Jumbotron className="mt-3" style={{ font: 'consolas' }}>
    <h2>Login not working?</h2>
    <p>
      <strong>Problem:</strong> Did you see{' '}
      <strong>403 disallowed_useragent</strong> when trying to login?
    </p>
    <p>
      <strong>Solution:</strong> Open xbk.io in a browser.
    </p>
    <p>
      <strong>Explanation:</strong> As of April 20, 2017, Google has blocked
      OAuth authorization requests via web views aka embedded browsers. You will
      see <strong>403 disallowed_useragent</strong> and be unable to login if
      you opened xbk.io from Facebook or any other app utilizing embedded
      browsers.
    </p>
  </Jumbotron>
);

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
            <Login403DisallowedUseragent />
          </Card.Body>
        </Card>
      </Col>
      <Col></Col>
    </Row>
  </>
);
export default FrontPage;
