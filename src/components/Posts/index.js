import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import firebase, { auth } from '../../firebase.js';
import { AppContext } from '../AppProvider';
import Mosaic from './mosaic';
import NewPostForm from './NewPostForm';
import Post from './Post';
import postsTreeFromRawPosts from './postsTreeFromRawPosts';
import Stats from './Stats';
import Tag from './Tag';

const NewTopLevelPostCard = ({ photoURL, displayName, createNewPost }) => {
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
      feed: 'unseen',
      users: {},
      postsFilter: {
        requiredTags: [],
        forbiddenTagsByMe: [],
      },
    };
    this.createNewPost = this.createNewPost.bind(this);
    this.deletePost = this.deletePost.bind(this);
  }

  static contextType = AppContext;
  user = () => this.context.user;

  db = () => firebase.database();
  postsRef = () => this.db().ref('posts');

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.postsRef().on('value', (snapshot) => {
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
    const key = this.postsRef().push().key;
    this.postsRef()
      .child(key)
      .update({
        content: newPostContent,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        userId: this.user().uid,
        replyToId: replyToId,
      })
      .then(successCallback());
  }
  deletePost(statePostsKey) {
    const post = this.state.rawPosts[statePostsKey];
    this.postsRef().child(post.id).remove();
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
      case 'postsFilterByTags':
        const { postsFilter } = this.state;
        // TODO tests for this
        filteredPosts = flatPostsArray
          ? flatPostsArray.filter((post) => {
              const hasTags = !!post.tags;
              if (hasTags) {
                const hasTagsRequiredByFilter = postsFilter.requiredTags.every(
                  (requiredTag) => {
                    return Object.values(post.tags).some(
                      (tag) => tag.type === requiredTag
                    );
                  }
                );
                // const hasForbiddenTags = postsFilter.forbiddenTags.some(
                //   (forbiddenTag) => {
                //     return Object.values(post.tags).some(
                //       (tag) => tag.type === forbiddenTag
                //     );
                //   }
                // );
                const hasForbiddenTagsByMe = postsFilter.forbiddenTagsByMe.some(
                  (forbiddenTag) => {
                    return Object.values(post.tags).some(
                      (tag) =>
                        tag.type === forbiddenTag &&
                        tag.userId === this.user().uid
                    );
                  }
                );
                return hasTagsRequiredByFilter && !hasForbiddenTagsByMe;
              }
              return false;
            })
          : null;
        feedSubtext = (
          <>
            <div>Pre-programmed Tag Filter:</div>
            <div>
              Required:{' '}
              {postsFilter.requiredTags.map((requiredTag) => (
                <>
                  <Tag>{requiredTag}</Tag>
                  {' or '}
                  <Tag variant="info">{requiredTag}</Tag>
                </>
              ))}
            </div>
            <div>
              Forbidden:{' '}
              {postsFilter.forbiddenTagsByMe.map((forbiddenTagByMe) => (
                <Tag variant="info">{forbiddenTagByMe}</Tag>
              ))}
            </div>
            'Posts tagged `feature request` that viewer did not tag `done` (for
            dev use):'
          </>
        );
        break;
    }

    const postsTree = postsTreeFromRawPosts({
      flatPostsArray: filteredPosts,
      users: this.state.users,
    });
    let posts = postsTree.posts;
    const countLowPriorityPosts = postsTree.data.countLowPriorityPosts;

    if (this.state.feed === 'unseen') {
      // TODO tests for this
      const topLevelPostIdsToAllow =
        flatPostsArray &&
        flatPostsArray
          .filter((post) => {
            const isTopLevelPost = !post.replyToId;
            if (!isTopLevelPost) {
              return false;
            }

            let mostRecentPostInThread = post;
            let topLevelPostOrMostRecentPostBySomeoneElse = post;
            flatPostsArray.forEach((p) => {
              const isReplyToThisPost = p.replyToId && p.replyToId === post.id;
              if (isReplyToThisPost) {
                if (
                  !mostRecentPostInThread ||
                  p.timestamp > mostRecentPostInThread.timestamp
                ) {
                  mostRecentPostInThread = p;
                  if (p.userId !== this.user().uid) {
                    topLevelPostOrMostRecentPostBySomeoneElse = p;
                  }
                }
              }
            });

            const yourMarkAsSeenTimestamp =
              post.seen && post.seen[this.user().uid];
            const yourMarkAsSeenTimestampIsMoreRecentThanMostRecentPostBySomeoneElseInThread = topLevelPostOrMostRecentPostBySomeoneElse
              ? yourMarkAsSeenTimestamp >
                topLevelPostOrMostRecentPostBySomeoneElse.timestamp
              : true;

            return !yourMarkAsSeenTimestampIsMoreRecentThanMostRecentPostBySomeoneElseInThread;
          })
          .map((post) => post.id);

      posts = posts.filter((post) => topLevelPostIdsToAllow.includes(post.id));
      feedSubtext =
        'Threads in which someone else posted since you last clicked the yellow `mark thread as seen` button.  Click the `mark thread as seen` button to temporarily hide a thread from this feed until someone else posts something new.';
    }

    return (
      <Row>
        <Col>
          <Mosaic />
        </Col>
        <Col sm={8} className="col-posts mt-3">
          <NewTopLevelPostCard
            photoURL={this.user().photoURL}
            displayName={this.user().displayName}
            createNewPost={this.createNewPost}
          />

          <Nav className="justify-content-center">
            <Nav.Item>
              <Nav.Link
                active={this.state.feed === 'unseen'}
                onClick={() =>
                  this.setState({
                    feed: 'unseen',
                    postsFilter: {
                      requiredTags: [],
                      forbiddenTagsByMe: [],
                    },
                  })
                }
              >
                Unseen
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={this.state.feed === 'smart'}
                onClick={() =>
                  this.setState({
                    feed: 'smart',
                    postsFilter: {
                      requiredTags: [],
                      forbiddenTagsByMe: [],
                    },
                  })
                }
              >
                Smart Feed
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={this.state.feed === 'all'}
                onClick={() =>
                  this.setState({
                    feed: 'all',
                    postsFilter: {
                      requiredTags: [],
                      forbiddenTagsByMe: [],
                    },
                  })
                }
              >
                All Posts
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={this.state.feed === 'postsFilterByTags'}
                onClick={() =>
                  this.setState({
                    feed: 'postsFilterByTags',
                    postsFilter: {
                      requiredTags: ['feature request'],
                      forbiddenTagsByMe: ['done'],
                    },
                  })
                }
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
                        myPhotoURL={this.user().photoURL}
                        createNewPost={this.createNewPost}
                        deletePost={this.deletePost}
                        addTag={this.addTag}
                        hackShowSeenButton={this.state.feed === 'unseen'}
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
