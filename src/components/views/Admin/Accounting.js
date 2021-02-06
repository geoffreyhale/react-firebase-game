import React from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import friendlyTimestamp from '../../shared/friendlyTimestamp';
import { AppContext } from '../../AppProvider';
import { getAccounting } from '../../../api/index';
import { User } from '../../shared/User';

export default class Accounting extends React.Component {
  constructor() {
    super();
    this.state = {
      users: {},
      accounting: {},
    };
  }

  static contextType = AppContext;
  users = () => this.context.users;

  componentDidMount() {
    getAccounting((accounting) =>
      this.setState({
        accounting,
        totalUsd: Object.values(accounting).reduce(
          (totalUsd, a) => totalUsd + a.usd,
          0
        ),
      })
    );
  }

  render() {
    const { accounting } = this.state;
    return (
      <Card>
        <Card.Body>
          <Card.Title>Accounting</Card.Title>
          <Table>
            <thead>
              <tr>
                {/* <th>id</th> */}
                {/* <th>uid</th> */}
                <th>user</th>
                <th>usd</th>
                <th>via</th>
                <th>timestamp</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(accounting).map((a) => (
                <tr key={a.id}>
                  {/* <td>{a.id}</td> */}
                  {/* <td>{a.uid}</td> */}
                  <td>
                    <User
                      uid={a.uid}
                      displayName={this.users()[a.uid]?.displayName}
                    />
                  </td>
                  <td>{a.usd}</td>
                  <td>{a.via}</td>
                  <td>{friendlyTimestamp(a.timestamp?.seconds * 1000)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                {/* <td></td> */}
                {/* <td></td> */}
                <td></td>
                <td>{this.state.totalUsd}</td>
                <td></td>
                <td></td>
              </tr>
            </tfoot>
          </Table>
        </Card.Body>
      </Card>
    );
  }
}
