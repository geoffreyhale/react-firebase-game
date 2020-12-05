import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import firebase, { auth, provider } from './firebase.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      holes: null,
    };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.digHole = this.digHole.bind(this);
    this.save = this.save.bind(this);
    this.autosaveTimer = 0;
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
  digHole() {
    this.setState({
      holes: this.state.holes + 1,
    });
  }
  save() {
    console.log('saving' + this.state.holes);
    const uid = this.state.user && this.state.user.uid;
    const userRef = firebase.database().ref('users/' + uid);
    userRef.update({ holes: this.state.holes });
  }
  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user }, () => {
          const uid = this.state.user && this.state.user.uid;
          const userRef = firebase.database().ref('users/' + uid);
          userRef.on('value', (snapshot) => {
            let user = snapshot.val();
            this.setState(
              {
                holes: (user && user.holes) || 0,
              },
              () => {
                this.autosaveTimer = setInterval(this.save, 10000);
              }
            );
          });
        });
      }
    });
  }
  render() {
    return (
      <div className="app">
        <Container>
          <header>
            <Card>
              <Card.Body>
                <h1 style={{ display: 'inline-block' }}>Game</h1>
                <div style={{ float: 'right' }}>
                  {this.state.user ? (
                    <>
                      <img
                        src={this.state.user.photoURL}
                        alt="user photo"
                        style={{ height: 48 }}
                      />
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={this.logout}
                      >
                        Log Out
                      </Button>
                    </>
                  ) : (
                    <Button variant="primary" onClick={this.login}>
                      Log In
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </header>
          {this.state.user ? (
            <div>
              <Card>
                <Card.Body>
                  <Card.Title>Inventory</Card.Title>
                  {this.state.holes === null || (
                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <strong>Holes:</strong>
                          </td>
                          <td>{this.state.holes}</td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </Card.Body>
              </Card>
              <Card>
                <Card.Body>
                  <Card.Title>Actions</Card.Title>
                  {this.state.holes === null || (
                    <Button variant="primary" onClick={this.digHole}>
                      Dig
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </div>
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
