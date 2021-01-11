import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import firebase, { auth } from '../../firebase.js';
import Mosaic from './mosaic';
import NewPostForm from './NewPostForm';
import Post from './Post';
import postsTreeFromRawPosts from './postsTreeFromRawPosts';
import Stats from './Stats';

const NewPostCard = ({ photoURL, displayName, createNewPost }) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>
          {photoURL ? (
            <img src={photoURL} alt="user" style={{ height: 48 }} />
          ) : null}
          {displayName}
          <small className="text-muted ml-2">&#127757; Public</small>
        </Card.Title>
        <NewPostForm onSubmit={createNewPost} multiline={true} />
      </Card.Body>
    </Card>
  );
};

export default class Posts extends Component {
  constructor() {
    super();
    this.state = {
      rawPosts: {},
      countLowPriorityPosts: 0,
      feed: 'notifications',
      users: {},
    };
    this.createNewPost = this.createNewPost.bind(this);
    this.deletePost = this.deletePost.bind(this);
  }
  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const postsRef = firebase.database().ref('posts');
        postsRef.on('value', (snapshot) => {
          this.setState({ rawPosts: snapshot.val() });
          const usersRef = firebase.database().ref('users');
          usersRef.once('value', (usersSnapshot) => {
            this.setState({ users: usersSnapshot.val() });
          });
        });
      }
    });
  }
  createNewPost(newPostContent, replyToId, successCallback) {
    const uid = this.props.user && this.props.user.uid;
    const postsRef = firebase.database().ref('posts');
    const key = postsRef.push().key;
    postsRef
      .child(key)
      .update({
        content: newPostContent,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        userId: uid,
        replyToId: replyToId,
      })
      .then(successCallback());
  }
  deletePost(statePostsKey) {
    const post = this.state.rawPosts[statePostsKey];
    const postsRef = firebase.database().ref('posts');
    postsRef.child(post.id).remove();
  }
  addTag(postId, tagContent, successCallback, myUserId) {
    const uid = myUserId; // TODO is this safe to do?
    const postRef = firebase.database().ref('posts/' + postId);
    const key = postRef.child('tags').push().key;
    postRef
      .child('tags')
      .child(key)
      .update({
        type: tagContent,
        userId: uid,
      })
      .then(successCallback());
  }
  render() {
    let feedSubtext = null;
    const flatPostsArray = Object.entries(this.state.rawPosts).map(
      ([id, post]) => {
        post.id = id;
        return post;
      }
    );

    let filteredPosts = flatPostsArray;
    switch (this.state.feed) {
      case 'feature request':
        // TODO tests for this
        filteredPosts = flatPostsArray
          ? flatPostsArray.filter((post) => {
              return (
                post.tags &&
                Object.values(post.tags).some(
                  (tag) => tag.type === 'feature request'
                ) &&
                Object.values(post.tags).every(
                  (tag) =>
                    tag.type !== 'done' || tag.userId !== this.props.user.uid
                )
              );
            })
          : null;
        feedSubtext =
          'Posts tagged `feature request` that viewer did not tag `done` (for dev use):';
        break;
    }

    const postsTree = postsTreeFromRawPosts({
      flatPostsArray: filteredPosts,
      users: this.state.users,
    });
    let posts = postsTree.posts;
    const countLowPriorityPosts = postsTree.data.countLowPriorityPosts;

    if (this.state.feed === 'notifications') {
      // TODO tests for this
      const topLevelPostIdsToAllow =
        flatPostsArray &&
        flatPostsArray
          .filter((post) => {
            const isTopLevelPost = !post.replyToId;
            if (!isTopLevelPost) {
              return false;
            }
            const myUserId = this.props.user.uid;

            // const notYours = post.userId !== myUserId;
            // const youNeverReplied = flatPostsArray.every((p) => {
            //   return (
            //     p.userId !== myUserId || p.replyToId !== post.id
            //   );
            // });
            // const youNeverTagged =
            //   !post.tags ||
            //   Object.values(post.tags).every(
            //     (tag) => tag.userId !== myUserId
            //   );
            let mostRecentReply = null;
            flatPostsArray.forEach((p) => {
              if (
                p.replyToId &&
                p.replyToId === post.id &&
                (!mostRecentReply || p.timestamp > mostRecentReply.timestamp)
              )
                mostRecentReply = p;
            });

            // mostRecentPost in thread (topLevel or reply)
            const mostRecentPostInThread = mostRecentReply || post;
            // is not yours
            const mostRecentPostInThreadIsNotYours =
              mostRecentPostInThread.userId !== myUserId;
            // and is more recent than your mark as seen
            const yourMarkAsSeenTimestamp = post.seen && post.seen[myUserId];
            const seenMostRecent =
              yourMarkAsSeenTimestamp > mostRecentPostInThread.timestamp;

            return mostRecentPostInThreadIsNotYours && !seenMostRecent;
          })
          .map((post) => post.id);
      posts = posts.filter((post) => topLevelPostIdsToAllow.includes(post.id));
      feedSubtext =
        'Threads in which the most recent post is not yours and is more recent than your most recent mark as seen.  To clear a thread from this notifications feed, please write a reply or click mark as seen button.';
    }

    return (
      <Row>
        <Col>
          <Mosaic />
        </Col>
        <Col sm={8} className="col-posts mt-3">
          <NewPostCard
            photoURL={this.props.user && this.props.user.photoURL}
            displayName={this.props.user && this.props.user.displayName}
            createNewPost={this.createNewPost}
          />

          <Nav className="justify-content-center">
            <Nav.Item>
              <Nav.Link
                active={this.state.feed === 'notifications'}
                onClick={() => this.setState({ feed: 'notifications' })}
              >
                Notifications
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={this.state.feed === 'smart'}
                onClick={() => this.setState({ feed: 'smart' })}
              >
                Smart Feed
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={this.state.feed === 'all'}
                onClick={() => this.setState({ feed: 'all' })}
              >
                All Posts
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={this.state.feed === 'feature request'}
                onClick={() => this.setState({ feed: 'feature request' })}
              >
                Feature Requests
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {feedSubtext ? (
            <small className="text-muted">{feedSubtext}</small>
          ) : null}

          <table>
            <tbody>
              {Object.entries(posts).map(([key, post]) => {
                if (this.state.feed === 'smart' && post.lowPriority) {
                  return null;
                }

                return (
                  <tr key={post.id}>
                    <td>
                      <Post
                        post={post}
                        myUserId={this.props.user && this.props.user.uid}
                        myPhotoURL={this.props.user && this.props.user.photoURL}
                        createNewPost={this.createNewPost}
                        deletePost={this.deletePost}
                        addTag={this.addTag}
                        hackShowSeenButton={this.state.feed === 'notifications'}
                      />
                    </td>
                  </tr>
                );
              })}
              {this.state.feed === 'smart' ? (
                <tr key={'countLowPriorityPosts'}>
                  <td>
                    <Card className="mt-2">
                      <Card.Body>
                        {countLowPriorityPosts} posts were hidden because they
                        were determined to be old.
                      </Card.Body>
                    </Card>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </Col>
        <Col>
          <Stats posts={this.state.rawPosts} users={this.state.users} />
        </Col>
      </Row>
    );
  }
}
