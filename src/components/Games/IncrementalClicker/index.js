import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import firebase, { auth } from '../../../firebase.js';
import DiggerCard from './DiggerCard';
import StripeElements from './StripeElements';

export default class IncrementalClickerGame extends Component {
  constructor() {
    super();
    this.state = {
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
    const holes = this.state.holes;
    const dirt = this.state.dirt;
    if (
      holes === this.state.holesMostRecentlySaved &&
      dirt === this.state.dirtMostRecentlySaved
    ) {
      return;
    }
    const uid = this.props.user && this.props.user.uid;
    const userRef = firebase.database().ref('users/' + uid);
    userRef.update({ dirt: dirt, holes: holes });
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
        const userRef = firebase.database().ref('users/' + user.uid);
        userRef.on('value', (snapshot) => {
          let user = snapshot.val();
          this.setState({
            dirt: (user && user.dirt) || 0,
            holes: (user && user.holes) || 0,
          });
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
