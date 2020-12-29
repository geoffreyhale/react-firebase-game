import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { Link, NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import firebase, { auth, provider } from './firebase.js';
import UserAuth from './components/UserAuth';
import Routes from './Routes';

const AppHeaderTitle = () => {
  return (
    <h1 style={{ display: 'inline-block' }}>
      xbk.io{' '}
      <span className="text-muted ml-1">
        <small style={{ fontSize: '50%' }}>
          <em>better together</em>
        </small>
      </span>
    </h1>
  );
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
    };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }
  login() {
    auth.signInWithPopup(provider).then((result) => {
      const user = result.user;
      this.setState(
        {
          user,
        },
        () => {
          const uid = user.uid;
          const userRef = firebase.database().ref('users/' + uid);
          userRef.update({
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          });
        }
      );
    });
  }
  logout() {
    auth.signOut().then(() => {
      this.setState({
        user: null,
      });
    });
  }
  render() {
    return (
      <div className="app">
        <Container>
          <header>
            <Card>
              <Card.Body>
                <div>
                  <AppHeaderTitle />
                  <div style={{ float: 'right' }}>
                    <UserAuth
                      user={this.state.user}
                      login={this.login}
                      logout={this.logout}
                    />
                  </div>
                </div>
                <div>
                  <small className="text-muted">
                    <em>
                      New online community that will never sell your data!!
                    </em>
                  </small>
                </div>
              </Card.Body>
            </Card>
            <Nav>
              <Nav.Item>
                <Nav.Link>
                  <Link to="/">Home</Link>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link>
                  <NavLink to="/game">Game</NavLink>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link>
                  <NavLink to="/groups">Groups</NavLink>
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </header>
          {this.state.user ? (
            <Routes />
          ) : (
            <Card>
              <Card.Body>
                <p>You must be logged in to play this game.</p>
              </Card.Body>
            </Card>
          )}
        </Container>
      </div>
    );
  }
}

export default App;
