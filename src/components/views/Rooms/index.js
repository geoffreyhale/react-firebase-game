import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import { AppContext } from '../../AppProvider';

const Rooms = () => {
  const { rooms } = useContext(AppContext);
  return (
    <Card>
      <Card.Body>
        <Card.Title>Rooms</Card.Title>
        {rooms && (
          <Table>
            <thead>
              <tr>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(rooms)
                .sort((a, b) =>
                  a.title.localeCompare(b.title, undefined, {
                    ignorePunctuation: true,
                  })
                )
                .map((room) => (
                  <tr>
                    <td>
                      <Link to={room.url}>{room.title}</Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
};
export default Rooms;
