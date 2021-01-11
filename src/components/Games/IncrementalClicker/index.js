import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import firebase, { auth } from '../../../firebase.js';
import DiggerCard from './DiggerCard';
import StripeElements from './StripeElements';

// TODO block hacking
// TODO add anti-exploits text
// TODO report exploits functionality

// TODO add high scores table
// TODO save field to database
// TODO add offline gains

export default class IncrementalClickerGame extends Component {
  constructor() {
    super();
    this.state = {
      loaded: false,
      deck: {
        diggers: 1,
      },
      field: {
        diggers: 1,
      },
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
  db = () => firebase.database();
  userGameRef = () =>
    this.db().ref('games/incremental-clicker/' + this.props.user.uid);

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
    const { holes, dirt } = this.state;
    this.userGameRef().update({ dirt: dirt, holes: holes });
  }
  returnToDeck() {
    if (this.state.field.diggers >= 1) {
      const newField = this.state.field;
      newField.diggers--;
      const newDeck = this.state.deck;
      newDeck.diggers++;
      this.setState({
        field: newField,
        deck: newDeck,
      });
    }
  }
  returnToField() {
    if (this.state.deck.diggers >= 1) {
      const newDeck = this.state.deck;
      newDeck.diggers--;
      const newField = this.state.field;
      newField.diggers++;
      this.setState({
        field: newField,
        deck: newDeck,
      });
    }
  }
  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const userGameRef = this.userGameRef();
        userGameRef.on('value', (snapshot) => {
          let userGame = snapshot.val();
          if (userGame) {
            const { dirt, holes } = userGame;
            this.setState({
              loaded: true,
              dirt: dirt || null,
              holes: holes || null,
            });
          } else {
            userGameRef.set({ dirt: 0, holes: 0 });
          }
        });

        this.autosaveTimer = setInterval(this.save, 3000);
        this.fieldTimer = setInterval(this.runFieldStep, 1000);
      }
    });
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
            {[...Array(this.state.field.diggers)].map(() => {
              return (
                <DiggerCard
                  key={Math.random()}
                  returnToDeck={this.returnToDeck}
                />
              );
            })}
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Card.Title>
              Actions <small className="text-muted">(manual labor)</small>
            </Card.Title>
            {this.state.holes === null || (
              <Button variant="primary" onClick={this.digHole}>
                Dig
              </Button>
            )}
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Card.Title>
              Deck <small className="text-muted">(not doing anything)</small>
            </Card.Title>
            {[...Array(this.state.deck.diggers)].map(() => {
              return (
                <DiggerCard
                  key={Math.random()}
                  returnToField={this.returnToField}
                />
              );
            })}
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
