import React from 'react';
import Card from 'react-bootstrap/Card';
import firebase from '../../firebase.js';
import { AppContext } from '../AppProvider';
import createPostTreeFromPostsObject from './createPostTreeFromPostsObject';
import Post from './Post';

export default class NotificationsFeed extends React.Component {
  constructor() {
    super();
    this.state = { posts: [] };
  }

  static contextType = AppContext;
  user = () => this.context.user;

  db = () => firebase.database();
  postsRef = () => this.db().ref('posts');
  // usersRef = () => this.db().ref('users'); // TODO this is outdated; use db.js getUsers

  componentDidMount() {
    this.usersRef().once('value', (usersSnapshot) => {
      const users = usersSnapshot.val();
      // this.setState({ users: users });
      this.postsRef()
        .orderByChild('userId')
        .equalTo(this.user().uid)
        .on('value', (userPostsSnapshot) => {
          const userPosts = userPostsSnapshot.val();
          const postIdsOfUserPosts = Object.keys(userPosts);
          this.postsRef()
            // .orderByChild('replyToId')
            // .equalTo() // in postIdsOfUserPosts
            // ...so now were just getting all the posts lol...
            .on('value', (postsSnapshot) => {
              const posts = postsSnapshot.val();
              const postsArray = Object.entries(posts).map(([id, post]) => {
                post.id = id;
                post.userDisplayName = users[post.userId].displayName;
                post.userPhotoURL = users[post.userId].photoURL;
                return post;
              });
              const directRepliesToUserPosts = postsArray.filter((post) =>
                postIdsOfUserPosts.some(
                  (userPostId) => userPostId === post.replyToId
                )
              );
              const postIdsOfDirectRepliesToUserPosts = directRepliesToUserPosts.map(
                (post) => post.id
              );

              const dedupPostIds = postIdsOfDirectRepliesToUserPosts.concat(
                postIdsOfUserPosts.filter((postId) =>
                  postIdsOfDirectRepliesToUserPosts.indexOf(postId)
                )
              );
              const sortedPosts = postsArray
                .filter((post) =>
                  dedupPostIds.some((userPostId) => userPostId === post.id)
                )
                .sort((a, b) => b.timestamp - a.timestamp);

              this.setState({
                posts: sortedPosts,
              });
            });
        });
    });
  }

  render() {
    if (!this.state.posts) {
      return;
    }
    const postsTree = createPostTreeFromPostsObject(this.state.posts);

    return postsTree.map((post) => {
      return (
        <Card className="mt-4">
          <Card.Body>
            <Post post={post} />
          </Card.Body>
        </Card>
      );
    });
  }
}
