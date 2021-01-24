import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { AppContext } from '../../AppProvider';
import firebase, { auth } from '../../firebase.js';
import DiggerCard from './DiggerCard';
import StripeElements from './StripeElements';

// TODO block hacking
// TODO add anti-exploits text
// TODO report exploits functionality

// TODO add high scores table
// TODO add offline gains
// TODO db game data in state.data

export default class IncrementalClickerGame extends Component {
  constructor() {
    super();
    this.state = {
      loaded: false,
      deck: {},
      field: {},
      dirt: null,
      holes: null,
      dirtMostRecentlySaved: null,
      holesMostRecentlySaved: null,
    };
    this.digHole = this.digHole.bind(this);
    this.returnToDeck = this.returnToDeck.bind(this);
    this.returnToField = this.returnToField.bind(this);
    this.runFieldStep = this.runFieldStep.bind(this);
    this.save = this.save.bind(this);
    this.autosaveTimer = 0;
    this.fieldTimer = 0;
  }

  static contextType = AppContext;
  user = () => this.context.user;

  db = () => firebase.database();
  userGameRef = () =>
    this.db().ref('games/incremental-clicker/' + this.user().uid);

  digHole() {
    this.setState({
      dirt: this.state.dirt + 1,
      holes: this.state.holes + 1,
    });
  }
  runFieldStep() {
    const diggerHoleDiggingRate = 1;
    const newHolesFromDiggers =
      diggerHoleDiggingRate * this.state.field.diggers;
    this.setState({
      holes: this.state.holes + newHolesFromDiggers,
    });
  }
  save() {
    const { holes, dirt, loaded } = this.state;
    if (!loaded) {
      return;
    }
    if (holes || dirt) {
      this.userGameRef().update({ dirt: dirt, holes: holes });
    }
  }
  returnToDeck() {
    const deckDiggersRef = this.userGameRef().child('deck/diggers');
    const fieldDiggersRef = this.userGameRef().child('field/diggers');

    fieldDiggersRef.once('value', (snapshot) => {
      const fieldDiggers = snapshot.val();
      if (fieldDiggers >= 1) {
        deckDiggersRef.once('value', (snapshot) => {
          const deckDiggers = snapshot.val();

          fieldDiggersRef.set(fieldDiggers - 1);
          deckDiggersRef.set(deckDiggers + 1);
        });
      }
    });
  }
  returnToField() {
    const deckDiggersRef = this.userGameRef().child('deck/diggers');
    const fieldDiggersRef = this.userGameRef().child('field/diggers');

    deckDiggersRef.once('value', (snapshot) => {
      const deckDiggers = snapshot.val();
      if (deckDiggers >= 1) {
        fieldDiggersRef.once('value', (snapshot) => {
          const fieldDiggers = snapshot.val();

          fieldDiggersRef.set(fieldDiggers + 1);
          deckDiggersRef.set(deckDiggers - 1);
        });
      }
    });
  }
  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const userGameRef = this.userGameRef();
        userGameRef.on('value', (snapshot) => {
          let userGame = snapshot.val();

          if (!userGame) {
            const newGameState = {
              deck: { diggers: 2 },
              dirt: 0,
              field: { diggers: 0 },
              holes: 0,
            };
            userGameRef.set(newGameState);

            this.setState(newGameState);
            this.setState({ loaded: true });
          } else {
            const { deck, dirt, field, holes } = userGame;

            let deckIfNoDeck = { diggers: 0 };
            let fieldIfNoField = { diggers: 0 };
            if (!deck && !field) {
              deckIfNoDeck = { diggers: 2 };
            }

            const newGameState = {
              deck: deck || deckIfNoDeck,
              dirt: dirt || 0,
              field: field || fieldIfNoField,
              holes: holes || 0,
            };
            userGameRef.set(newGameState);

            this.setState(newGameState);
            this.setState({ loaded: true });
          }
        });
      }
    });

    this.autosaveTimer = setInterval(this.save, 3000);
    this.fieldTimer = setInterval(this.runFieldStep, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.autosaveTimer);
    clearInterval(this.fieldTimer);
  }

  render() {
    if (!this.state.loaded) {
      return 'Loading...';
    }

    return (
      <>
        <Card>
          <Card.Body>
            <h2 style={{ marginBottom: 0 }}>Incremental Clicker</h2>
          </Card.Body>
        </Card>
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
            <Card.Title>
              Field{' '}
              <small className="text-muted">(working for you currently)</small>
            </Card.Title>
            {this.state.field.diggers
              ? [...Array(this.state.field.diggers)].map(() => {
                  return (
                    <DiggerCard
                      key={Math.random()}
                      returnToDeck={this.returnToDeck}
                    />
                  );
                })
              : null}
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Card.Title>
              Actions <small className="text-muted">(manual labor)</small>
            </Card.Title>
            <Button variant="primary" onClick={this.digHole}>
              Dig
            </Button>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Card.Title>
              Deck <small className="text-muted">(not doing anything)</small>
            </Card.Title>
            {this.state.deck.diggers
              ? [...Array(this.state.deck.diggers)].map(() => {
                  return (
                    <DiggerCard
                      key={Math.random()}
                      returnToField={this.returnToField}
                    />
                  );
                })
              : null}
          </Card.Body>
        </Card>
        {/* <Card>
          <Card.Body>
            <Card.Title>Store</Card.Title>
            <Card.Text>
              Sorry, we are temporarily closed. Come back soon!
            </Card.Text>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Card.Title>Stripe</Card.Title>
            <StripeElements />
          </Card.Body>
        </Card> */}
      </>
    );
  }
}
