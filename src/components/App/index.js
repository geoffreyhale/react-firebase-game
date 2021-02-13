import React, { Component } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { BrowserRouter } from 'react-router-dom';
import firebase, { auth, provider } from '../firebase.js';
import Routes from '../Routes';
import AppProvider from '../AppProvider';
import { getUser, getUsers, updateUser } from '../../api/index';
import Spinner from '../shared/Spinner';
import FrontPage from '../views/FrontPage';
import AppHeader from './AppHeader';
import SmartGuide from '../SmartGuide';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      user: null, //TODO store this in context only
      users: null, //TODO store this in context only
    };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }
  componentDidMount() {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        const uid = authUser.uid;

        getUser(uid, (user) => {
          this.setState({ loading: false, user });
        });

        getUsers((users) => {
          this.setState({ users });
        });

        // TODO combine these w an update instead of a set

        // onDisconnect is a feature of firebase realtime database
        // this is the only valid use of the realtime database users collection atm
        // all other user data should be handled in firebase cloud firestore
        firebase
          .database()
          .ref('users/' + uid + '/lastOnline')
          .onDisconnect()
          .set(firebase.database.ServerValue.TIMESTAMP)
          .then(() => {
            // The promise returned from .onDisconnect().set() will
            // resolve as soon as the server acknowledges the onDisconnect()
            // request, NOT once we've actually disconnected:
            // https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect
            firebase
              .database()
              .ref('users/' + uid + '/lastOnline')
              .set(firebase.database.ServerValue.TIMESTAMP);
          });
        firebase
          .database()
          .ref('users/' + uid + '/presence')
          .onDisconnect()
          .set('offline')
          .then(() => {
            // The promise returned from .onDisconnect().set() will
            // resolve as soon as the server acknowledges the onDisconnect()
            // request, NOT once we've actually disconnected:
            // https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect

            // We can now safely set ourselves as 'online' knowing that the
            // server will mark us as offline once we lose connection.
            firebase
              .database()
              .ref('users/' + uid + '/presence')
              .set('online');
          });
      } else {
        this.setState({ loading: false });
      }
    });
  }
  //TODO move to UserAuth
  login() {
    auth.signInWithPopup(provider).then((result) => {
      const authUser = result.user;
      updateUser(
        {
          uid: authUser.uid,
          user: {
            displayName: authUser.displayName,
            email: authUser.email,
            photoURL: authUser.photoURL,
            joined: new Date(parseInt(authUser.metadata.a)),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
          },
        },
        () =>
          getUser(authUser.uid, (user) => {
            this.setState({ loading: false, user });
          })
      );
    });
  }
  //TODO move to UserAuth
  logout() {
    auth.signOut().then(() => {
      this.setState({
        user: null,
      });
    });
  }
  render() {
    return (
      <AppProvider user={this.state.user} users={this.state.users}>
        <BrowserRouter>
          <div className="app">
            <Container fluid>
              <Row>
                <Col style={{ paddingRight: 0, paddingLeft: 0 }}>
                  <AppHeader login={this.login} logout={this.logout} />
                  {/* <SmartGuide /> */}
                  {this.state.loading ? (
                    <Spinner />
                  ) : (
                    <div className="mt-3">
                      {!this.state.user && <FrontPage login={this.login} />}
                      <Routes />
                    </div>
                  )}
                </Col>
              </Row>
            </Container>
          </div>
        </BrowserRouter>
      </AppProvider>
    );
  }
}

export default App;
