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
                <th>Requires</th>
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
                    <td>
                      {room.requires?.map((requirement, i, arr) => {
                        const R =
                          requirement === 'premium' ? (
                            <Link to={'/premium'}>{requirement}</Link>
                          ) : (
                            requirement
                          );
                        return i < arr.length - 1 ? [R, ', '] : R;
                      })}
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
