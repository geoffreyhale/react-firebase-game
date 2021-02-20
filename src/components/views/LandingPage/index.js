/**
 * LandingPage is intended to serve as home for unauthorized users
 */
import React from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Row from 'react-bootstrap/Row';
import About from '../About';
import { LogInButton } from '../../App/AppHeader';
import friendsPhoneImg from './three-diverse-friends-her-phone-looking-happy 640.jpg';

import './LandingPage.css';

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

const BetterLandingPageContent = ({ login }) => (
  <Row style={{ background: 'white' }}>
    <Col
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="m-5">
        <div
          style={{ fontSize: '3rem', fontWeight: 'bold', lineHeight: '3rem' }}
        >
          Healthy Relating.
        </div>
        <div className="mt-3 text-muted">
          #1 online social network for meaningful connection and personal
          growth.
        </div>
        <div className="mt-3">
          <LogInButton login={login}>Start Now</LogInButton>
        </div>
      </div>
    </Col>
    <Col
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      className="d-none d-sm-block"
    >
      <div className="m-5">
        <div className="vignette">
          <img src={friendsPhoneImg} alt="healthy relating" />
        </div>
      </div>
    </Col>
  </Row>
);

const LandingPage = ({ login }) => (
  <>
    <BetterLandingPageContent login={login} />
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
export default LandingPage;
