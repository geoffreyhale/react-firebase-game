import React from 'react';
import Button from 'react-bootstrap/button';
import Card from 'react-bootstrap/card';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';

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
  }
  addScore(who, howMuch) {
    const newScore = this.state.score;
    newScore[who] = newScore[who] + howMuch;
    const newLog = this.state.log;
    newLog.unshift(`${who} + ${howMuch}`);
    this.setState({
      score: newScore,
      log: newLog,
    });
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
        <Col xs={8}>
          <Card>
            <Card.Body>
              <Card.Title>Build Your Scorekeeper</Card.Title>
              <h5>Presets</h5>
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
              <h5>Add Buttons</h5>
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
              <Card.Title>Score</Card.Title>
              <Table style={{ fontSize: '300%' }}>
                <tbody>
                  <tr>
                    <td>Player 1</td>
                    <td>Player 2</td>
                  </tr>
                  <tr>
                    {Object.entries(this.state.score).map(([key, scores]) => {
                      return <td key={`player-${key}-score`}>{scores}</td>;
                    })}
                  </tr>
                  <tr>
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
              <h5>Log:</h5>
              {Object.entries(this.state.log).map(([key, entry]) => {
                return (
                  <>
                    {entry}
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
