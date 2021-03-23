import React from 'react';
import { useLocation } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Row from 'react-bootstrap/Row';
import { LogInButton } from '../../App/AppHeader';
import altFamilyImg from './alt-family-bed-child-laptop 640.jpg';
import friendsPhoneImg from './three-diverse-friends-phone-happy 640.jpg';
import glassesGirlImg from './green-girl-glasses-phone 640.jpg';
import olderCoupleImg from './older-mixed-couple-phone-happy 640.jpg';
import { getInviteCodeFromLocationSearchString } from '../../shared/inviteCode';

import './LandingPage.css';

const Login403DisallowedUseragent = () => (
  <Jumbotron className="mt-3" style={{ font: 'consolas' }}>
    <h2>Login not working?</h2>
    <p>
      <strong>Problem:</strong> Did you see{' '}
      <strong>403 disallowed_useragent</strong> when trying to login?
    </p>
    <p style={{ fontSize: '2rem' }}>
      <strong>Solution:</strong> Open xbk.io in a browser.
    </p>
    <p>
      <strong>Explanation:</strong> As of April 20, 2017, Google has blocked
      OAuth authorization requests via web views aka embedded browsers. If you
      opened xbk.io from Facebook or any other app utilizing embedded browsers
      then you will see '403 disallowed_useragent' and be unable to login.
    </p>
  </Jumbotron>
);

const LandingCol = ({ children }) => (
  <Col
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <div className="m-4 m-sm-5">{children}</div>
  </Col>
);

const BigLandingText = ({ children }) => (
  <div style={{ fontSize: '3rem', fontWeight: 'bold', lineHeight: '3rem' }}>
    {children}
  </div>
);

const SmallLandingText = ({ children }) => (
  <div className="mt-3 text-muted">{children}</div>
);

const Vignette = ({ children }) => <div className="vignette">{children}</div>;

const ShowSmOnly = ({ children }) => (
  <div className="d-block d-sm-none">{children}</div>
);
const ShowNotSm = ({ children }) => (
  <div className="d-none d-sm-block">{children}</div>
);

const BetterLandingPageContent = ({ login }) => (
  <>
    <Row>
      <LandingCol>
        <BigLandingText>Healthy Relating.</BigLandingText>
        <SmallLandingText>
          #1 online social network for meaningful connection and personal
          growth.
        </SmallLandingText>
        <div className="mt-3">
          <LogInButton login={login}>Start Now</LogInButton>
        </div>
      </LandingCol>
      <LandingCol>
        <Vignette>
          <img src={friendsPhoneImg} alt="healthy relating" />
        </Vignette>
      </LandingCol>
    </Row>
    <ShowNotSm>
      <Row>
        <LandingCol>
          <Vignette>
            <img src={olderCoupleImg} alt="meaningful connection" />
          </Vignette>
        </LandingCol>
        <LandingCol>
          <BigLandingText>Meaningful Connections.</BigLandingText>
          <SmallLandingText>
            Guided writing exercises develop our capacity for emotional intimacy
            and deep connection.
          </SmallLandingText>
        </LandingCol>
      </Row>
    </ShowNotSm>
    <ShowSmOnly>
      <Row>
        <LandingCol>
          <BigLandingText>Meaningful Connections.</BigLandingText>
          <SmallLandingText>
            Guided writing exercises develop our capacity for emotional intimacy
            and deep connection.
          </SmallLandingText>
        </LandingCol>
        <LandingCol>
          <Vignette>
            <img src={olderCoupleImg} alt="meaningful connection" />
          </Vignette>
        </LandingCol>
      </Row>
    </ShowSmOnly>
    <Row>
      <LandingCol>
        <BigLandingText>Safe Space.</BigLandingText>
        <SmallLandingText>
          Progressive access system ensures a safe container for wholesome
          interactions.
        </SmallLandingText>
      </LandingCol>
      <LandingCol>
        <Vignette>
          <img src={altFamilyImg} alt="safe space" />
        </Vignette>
      </LandingCol>
    </Row>
    <ShowNotSm>
      <Row>
        <LandingCol>
          <Vignette>
            <img src={glassesGirlImg} alt="track progress" />
          </Vignette>
        </LandingCol>
        <LandingCol>
          <BigLandingText>Track Progress.</BigLandingText>
          <SmallLandingText>
            Appreciate how your relational skills develop over time.
          </SmallLandingText>
        </LandingCol>
      </Row>
    </ShowNotSm>
    <ShowSmOnly>
      <Row>
        <LandingCol>
          <BigLandingText>Track Progress.</BigLandingText>
          <SmallLandingText>
            Appreciate how your relational skills develop over time.
          </SmallLandingText>
        </LandingCol>
        <LandingCol>
          <Vignette>
            <img src={glassesGirlImg} alt="track progress" />
          </Vignette>
        </LandingCol>
      </Row>
    </ShowSmOnly>
    <Row>
      <LandingCol>
        <LogInButton login={login} style={{ fontSize: '2rem' }}>
          Try Now Free
        </LogInButton>
      </LandingCol>
    </Row>
    {/* <Row>
      <LandingCol>
        <Button variant="secondary" as={Link} to="/about">
          About
        </Button>
      </LandingCol>
    </Row> */}
  </>
);

const LandingPage = ({ login }) => {
  const location = useLocation();
  const inviteCode = getInviteCodeFromLocationSearchString(location.search);
  if (inviteCode) {
    window.localStorage.setItem('inviteCode', inviteCode);
  }

  return (
    <div style={{ backgroundColor: 'white' }}>
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
      {/* <div className="mt-3">
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
    </Row> */}
    </div>
  );
};
export default LandingPage;
