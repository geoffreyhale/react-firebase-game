import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import firebase, { auth, provider } from './firebase.js';

function DiggerCard() {
  return (
    <Card style={{ width: '8rem' }}>
      <Card.Body>
        <Card.Title>Digger</Card.Title>
        <Card.Text>+1 hole per second</Card.Text>
        <Card.Text>
          <em>Yum, dirt!</em>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      // diggers, null, //TODO
      dirt: null,
      holes: null,
      dirtMostRecentlySaved: null,
      holesMostRecentlySaved: null,
    };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.digHole = this.digHole.bind(this);
    this.runFieldStep = this.runFieldStep.bind(this);
    this.save = this.save.bind(this);
    this.autosaveTimer = 0;
    this.fieldTimer = 0;
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
      dirt: this.state.dirt + 1,
      holes: this.state.holes + 1,
    });
  }
  runFieldStep() {
    this.setState({
      holes: this.state.holes + 1,
    });
  }
  save() {
    const holes = this.state.holes;
    const dirt = this.state.dirt;
    if (
      holes === this.state.holesMostRecentlySaved &&
      dirt === this.state.dirtMostRecentlySaved
    ) {
      return;
    }
    const uid = this.state.user && this.state.user.uid;
    const userRef = firebase.database().ref('users/' + uid);
    userRef.update({ dirt: dirt, holes: holes });
  }
  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user }, () => {
          const uid = this.state.user && this.state.user.uid;
          const userRef = firebase.database().ref('users/' + uid);
          userRef.on('value', (snapshot) => {
            let user = snapshot.val();
            this.setState({
              dirt: (user && user.dirt) || 0,
              holes: (user && user.holes) || 0,
            });
          });
          this.autosaveTimer = setInterval(this.save, 3000);
          this.fieldTimer = setInterval(this.runFieldStep, 1000);
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
                  <table>
                    <tbody>
                      {this.state.dirt === null || (
                        <tr>
                          <td>
                            <strong>Dirt:</strong>
                          </td>
                          <td>{this.state.dirt}</td>
                        </tr>
                      )}
                      {this.state.holes === null || (
                        <tr>
                          <td>
                            <strong>Holes:</strong>
                          </td>
                          <td>{this.state.holes}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body>
                  <Card.Title>Field</Card.Title>
                  <DiggerCard />
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
              <Card>
                <Card.Body>
                  <Card.Title>Deck</Card.Title>
                  <Card.Text>You have no cards in your deck.</Card.Text>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body>
                  <Card.Title>Store</Card.Title>
                  <Card.Text>
                    Sorry, we are temporarily closed. Come back soon!
                  </Card.Text>
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
