import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import { AppContext } from '../../AppProvider';
import { getPosts } from '../../../api';
import Spinner from '../../shared/Spinner';

const sortByTitle = (a, b) =>
  a.title.localeCompare(b.title, undefined, {
    ignorePunctuation: true,
  });
const sortByPostCount = (a, b) => b.posts?.length - a.posts?.length;
const sortByRequires = (a, b) =>
  a.requires?.join().localeCompare(b.requires?.join(), undefined, {
    ignorePunctuation: true,
  });

const Rooms = () => {
  const { rooms } = useContext(AppContext);
  const [sortFunction, setSortFunction] = useState(() => sortByTitle);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPosts((posts) => {
      Object.entries(rooms).forEach(([key, room]) => {
        if (room.id === 'home') {
          rooms[key].posts = { length: Object.values(posts).length };
        } else {
          rooms[key].posts = Object.values(posts).filter(
            (post) => post.room === room.id
          );
        }
      });
      setLoading(false);
    });
  }, []);

  if (loading) <Spinner />;

  return (
    <Card>
      <Card.Body>
        <Card.Title>Rooms</Card.Title>
        {rooms && (
          <Table>
            <thead>
              <tr>
                <th onClick={() => setSortFunction(() => sortByTitle)}>Name</th>
                <th onClick={() => setSortFunction(() => sortByPostCount)}>
                  Posts
                </th>
                <th onClick={() => setSortFunction(() => sortByRequires)}>
                  Requires
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.values(rooms)
                .sort(sortFunction)
                .map((room) => (
                  <tr>
                    <td>
                      <Link to={room.url}>{room.title}</Link>
                    </td>
                    <td>{room.posts?.length}</td>
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
