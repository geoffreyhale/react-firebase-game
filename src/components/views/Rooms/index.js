import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import { AppContext } from '../../AppProvider';
import { getPosts } from '../../../api';

const Rooms = () => {
  const { rooms } = useContext(AppContext);
  const [posts, setPosts] = useState({});
  useEffect(() => {
    getPosts((posts) => setPosts(posts));
  }, []);
  return (
    <Card>
      <Card.Body>
        <Card.Title>Rooms</Card.Title>
        {rooms && (
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Posts</th>
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
                      {
                        // TODO more efficient to do this once for each room instead of every render
                        Object.values(posts).filter(
                          (post) => post.room === room.id
                        ).length
                      }
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
