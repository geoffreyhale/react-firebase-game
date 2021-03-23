import React from 'react';
import Button from 'react-bootstrap/button';
import Card from 'react-bootstrap/card';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import FriendlyTimestamp from '../../shared/timestamp';

export default class Scorekeeper extends React.Component {
  constructor() {
    super();
    this.state = {
      score: {
        1: 0,
        2: 0,
      },
      log: [],
      addButtonAmounts: [],
    };
    this.addButtonAmount = this.addButtonAmount.bind(this);
    this.addScore = this.addScore.bind(this);
    this.setButtonAmounts = this.setButtonAmounts.bind(this);
    this.addLog = this.addLog.bind(this);
  }
  addLog(m) {
    const log = this.state.log;
    log.unshift(m);
    this.setState({
      log: log,
    });
  }
  addScore(who, howMuch) {
    const score = this.state.score;
    score[who] = score[who] + howMuch;
    this.setState({
      score: score,
    });
    this.addLog([
      Date.now(),
      `Player ${who}: ${howMuch < 0 ? howMuch : `+${howMuch}`}`,
    ]);
  }
  addButtonAmount(amount) {
    const newAddButtonAmounts = this.state.addButtonAmounts;
    newAddButtonAmounts.push(amount);
    this.setState({
      addButtonAmounts: newAddButtonAmounts,
    });
  }
  setButtonAmounts(amounts) {
    this.setState({
      addButtonAmounts: amounts,
    });
  }
  render() {
    return (
      <Row>
        <Col></Col>
        <Col md={8}>
          <Card>
            <Card.Body>
              <h2 style={{ marginBottom: 0 }}>
                Scorekeeper{' '}
                <small className="text-muted">(Calculator for Games IRL)</small>
              </h2>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <Card.Title>How To Use</Card.Title>
              <ol>
                <li>Add buttons or choose a preset in Build Scorekeeper.</li>
                <li>Play game irl and use Score Card to keep score.</li>
              </ol>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <Card.Title>Build Scorekeeper</Card.Title>
              <h6>Presets</h6>
              <Button
                key="dominoes"
                variant="link"
                type="button"
                onClick={() => {
                  this.setButtonAmounts([5, -1]);
                }}
              >
                Dominoes
              </Button>
              <br />
              <Button
                key="spades"
                variant="link"
                type="button"
                onClick={() => {
                  this.setButtonAmounts([10, 1]);
                }}
              >
                Spades
              </Button>
              <br />
              <h6>Add Buttons</h6>
              {[10, 5, 1, -1].map((amount) => (
                <Button
                  key={amount}
                  variant={amount < 0 ? 'danger' : 'primary'}
                  type="button"
                  onClick={() => this.addButtonAmount(amount)}
                >
                  {amount < 0 ? null : '+'}
                  {amount}
                </Button>
              ))}
              <br />
              <Button
                key="clear"
                variant="outline-danger"
                type="button"
                onClick={() => {
                  this.setButtonAmounts([]);
                }}
              >
                (Reset / Clear)
              </Button>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <Card.Title>Score Card</Card.Title>
              <Table style={{ fontSize: '300%' }}>
                <tbody>
                  <tr>
                    <td>Player</td>
                    <td>1</td>
                    <td>2</td>
                  </tr>
                  <tr>
                    <td>Score</td>
                    {Object.entries(this.state.score).map(([key, scores]) => {
                      return <td key={`player-${key}-score`}>{scores}</td>;
                    })}
                  </tr>
                  <tr>
                    <td>Add</td>
                    {Object.entries(this.state.score).map(
                      ([scoreKey, scores]) => (
                        <td key={`player-${scoreKey}-buttons`}>
                          {Object.entries(this.state.addButtonAmounts).map(
                            ([key, amount]) => (
                              <>
                                <Button
                                  variant={amount < 0 ? 'danger' : 'primary'}
                                  type="button"
                                  onClick={() =>
                                    this.addScore(scoreKey, amount)
                                  }
                                  className="mr-1"
                                  style={{ fontSize: 'inherit' }}
                                >
                                  {amount < 0 ? null : '+'}
                                  {amount}
                                </Button>
                              </>
                            )
                          )}
                        </td>
                      )
                    )}
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <h5>Log:</h5>
              {Object.entries(this.state.log).map(([key, entry]) => {
                const timestamp = entry[0];
                const text = entry[1];
                return (
                  <>
                    <span>{FriendlyTimestamp(timestamp)}</span>
                    <span className="ml-3">{text}</span>
                    <br />
                  </>
                );
              })}
            </Card.Body>
          </Card>
        </Col>
        <Col></Col>
      </Row>
    );
  }
}
