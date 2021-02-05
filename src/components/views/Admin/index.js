import React from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import friendlyTimestamp from '../../shared/friendlyTimestamp';
import { AppContext } from '../../AppProvider';
import countWords from '../../shared/countWords';
import { getPosts, getUsersRealtimeDatabase } from '../../../api/index';
import getMillisFromDifferingTypes from '../../shared/getMillisFromDifferingTypes';
import postsTreeFromRawPosts from '../../shared/postsTreeFromRawPosts';
import Spinner from '../../shared/Spinner';
import { isPremium, User } from '../../shared/User';
import Accounting from './Accounting';
import Funnel from './Funnel';
// import MyScatterPlot from './MyScatterPlot';

const pushReplyCountWordCountObjects = (
  post,
  replyCountByWordCountObjectsArray
) => {
  if (post.childNodes?.length > 0) {
    post.childNodes.forEach((post) =>
      pushReplyCountWordCountObjects(post, replyCountByWordCountObjectsArray)
    );
  }
  if (post.content) {
    const replyCount = post.childNodes?.length || 0;
    const wordCount = countWords(post.content);
    // if (replyCount !== 0 && wordCount !== 0) {
    const replyCountByWordCountObject = {
      replyCount,
      wordCount,
    };
    replyCountByWordCountObjectsArray.push(replyCountByWordCountObject);
    // }
  }
};

const Posts = ({ posts }) => {
  Object.keys(posts).map((key) => {
    posts[key].id = key;
  });
  const count = Object.keys(posts).length;
  const postsWithNoRoom = Object.values(posts).filter((post) => !post.room);
  const countNoRoom = postsWithNoRoom.length;

  const replyCountByWordCountObjectsArray = [];
  const postsTree = postsTreeFromRawPosts({
    flatPostsArray: Object.values(posts),
    // users,
  });
  pushReplyCountWordCountObjects(
    { childNodes: postsTree.posts },
    replyCountByWordCountObjectsArray
  );

  const dataForScatterPlot = [
    {
      id: 'reply count per word count',
      data: replyCountByWordCountObjectsArray.map((data) => ({
        x: data.wordCount,
        y: data.replyCount,
      })),
    },
  ];

  return (
    <Card>
      <Card.Body>
        <Card.Title>Posts</Card.Title>
        <div>count: {count}</div>
        <div>orphans (undefined room): {countNoRoom}</div>
        {postsWithNoRoom.map((post) => (
          <div>id: {post.id}</div>
        ))}
        {/* <MyScatterPlot data={dataForScatterPlot} /> */}
      </Card.Body>
    </Card>
  );
};

export default class Admin extends React.Component {
  constructor() {
    super();
    this.state = {
      posts: {},
      users: {},
      sortKey: 'lastOnline',
    };
  }

  static contextType = AppContext;
  user = () => this.context.user;
  users = () => this.context.users;

  componentDidMount() {
    // lastOnline lives in realtime database
    getUsersRealtimeDatabase((users) => {
      this.setState({
        users,
      });
    });
    getPosts((posts) => {
      this.setState({ posts });
    });
  }

  sort(propertyName) {
    this.setState({
      sortKey: propertyName,
    });
  }

  render() {
    if (!this.user() || !this.users()) {
      return <Spinner />;
    }
    if (!this.user().admin) {
      return <>Access Denied</>;
    }

    const users = this.users();

    // merge lastOnline from state
    Object.entries(users).forEach(([key, user]) => {
      if (this.state.users && this.state.users[user.uid]) {
        users[key].lastOnline = this.state.users[user.uid].lastOnline;
      }
    });

    Object.values(users).forEach((user) => {
      if (users[user.uid]) {
        // TODO in db: convert joined to object type
        users[user.uid].joined = getMillisFromDifferingTypes(
          users[user.uid].joined
        );
        // TODO in db: delete number/string lastLogins from db, only keep object versions; or convert
        users[user.uid].lastLogin = getMillisFromDifferingTypes(
          users[user.uid].lastLogin
        );
        users[user.uid].isPremium = isPremium({
          premium: users[user.uid].premium,
        });
      }
    });

    const usersArray = Object.values(users);

    const sortKey = this.state.sortKey;
    if (sortKey) {
      usersArray.sort((a, b) => {
        if (!a[sortKey]) {
          return 1;
        }
        if (!b[sortKey]) {
          return -1;
        }
        if (typeof a[sortKey] === 'string') {
          return a[sortKey].localeCompare(b[sortKey]);
        }
        if (typeof a[sortKey] === 'number') {
          return b[sortKey] - a[sortKey];
        }
      });
    }

    return (
      <>
        <Posts posts={this.state.posts} />
        <Accounting users={this.state.users} />
        <Card className={'mt-3'}>
          <Card.Body>
            <Funnel usersArray={usersArray} />
          </Card.Body>
        </Card>
        <Card className={'mt-3'}>
          <Card.Body>
            <Table bordered hover size="sm">
              <thead>
                <tr>
                  <td onClick={() => this.sort('uid')}>uid</td>
                  <td onClick={() => this.sort('displayName')}>displayName</td>
                  <td onClick={() => this.sort('email')}>email</td>
                  <td onClick={() => this.sort('lastOnline')}>lastOnline</td>
                  <td onClick={() => this.sort('lastLogin')}>lastLogin</td>
                  <td onClick={() => this.sort('joined')}>joined</td>
                </tr>
              </thead>
              <tbody>
                {usersArray.map((user) => {
                  return (
                    <tr key={user.uid}>
                      <td>{user.uid}</td>
                      <td>
                        <User uid={user.uid} displayName={user.displayName} />
                      </td>
                      <td>{user.email}</td>
                      <td>{friendlyTimestamp(user.lastOnline)}</td>
                      <td>{friendlyTimestamp(user.lastLogin)}</td>
                      <td>{friendlyTimestamp(user.joined)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </>
    );
  }
}
