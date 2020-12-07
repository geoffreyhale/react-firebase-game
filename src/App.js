import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './stripe-demo.css';
import firebase, { auth, provider } from './firebase.js';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { ElementsConsumer, CardElement } from '@stripe/react-stripe-js';

const STRIPE_PUBLISHABLE_KEY = 'pk_test_MG5haRtUx8gvSQDL5msBa7Eg00uiWArCRO';

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const CARD_ELEMENT_OPTIONS = {
  iconStyle: 'solid',
  hidePostalCode: true,
  style: {
    base: {
      iconColor: 'rgb(240, 57, 122)',
      color: 'rgb(240, 57, 122)',
      fontSize: '16px',
      fontFamily: '"Open Sans", sans-serif',
      fontSmoothing: 'antialiased',
      '::placeholder': {
        color: '#CFD7DF',
      },
    },
    invalid: {
      color: '#e5424d',
      ':focus': {
        color: '#303238',
      },
    },
  },
};

function CardSection() {
  return <CardElement options={CARD_ELEMENT_OPTIONS} />;
}

class CheckoutForm extends React.Component {
  handleSubmit = async (event) => {
    event.preventDefault();

    const { stripe, elements } = this.props;
    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    const result = await stripe.createToken(card);
    if (result.error) {
      console.log(result.error.message);
    } else {
      console.log(result.token);
      // TODO save the card info for future
      // pass the token to your backend API
      // TODO Backend for Stripe https://www.pluralsight.com/guides/how-to-integrate-stripe-with-react
    }
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <CardSection />
        <button className="btn-pay">Buy Now</button>
      </form>
    );
  }
}

function InjectedCheckoutForm() {
  return (
    <ElementsConsumer>
      {({ stripe, elements }) => (
        <CheckoutForm stripe={stripe} elements={elements} />
      )}
    </ElementsConsumer>
  );
}

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
              <Elements stripe={stripePromise}>
                <InjectedCheckoutForm />
              </Elements>
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
