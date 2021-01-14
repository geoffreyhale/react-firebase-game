import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import friendlyTimestamp from '../shared/friendlyTimestamp';
import MyDropdownToggle from '../shared/MyDropdownToggle';
import NewPostForm from './NewPostForm';
import { AppContext } from '../AppProvider';
import firebase from '../../firebase.js';
import Tag from './Tag';

const postsRef = () => firebase.database().ref('posts');

const deletePost = ({ postId }) => {
  postsRef().child(postId).remove();
};

export const createNewPost = (
  newPostContent,
  replyToId,
  successCallback,
  myUserId
) => {
  const key = postsRef().push().key;
  postsRef()
    .child(key)
    .update({
      content: newPostContent,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      userId: myUserId,
      replyToId: replyToId,
    })
    .then(successCallback());
};

const addTag = (postId, tagContent, successCallback, myUserId) => {
  const postRef = firebase.database().ref('posts/' + postId);
  const key = postRef.child('tags').push().key;
  postRef
    .child('tags')
    .child(key)
    .update({
      type: tagContent,
      userId: myUserId,
    })
    .then(successCallback());
};

const PostTags = ({ post }) => {
  const { user } = useContext(AppContext);
  const myUserId = user.uid;
  const { tags } = post;

  const placeholder =
    tags && Object.keys(tags).length > 0
      ? 'add tag'
      : 'this post needs tags help add tags';

  return (
    <div>
      {tags &&
        Object.values(tags).map((tag) => {
          const tagUniqueKey = post.id + tag.userId + tag.type + Math.random();
          if (tag.userId === myUserId) {
            return (
              <Tag variant="info" key={tagUniqueKey}>
                {tag.type}
              </Tag>
            );
          }
          return <Tag key={tagUniqueKey}>{tag.type}</Tag>;
        })}
      <div className={'mt-1'}>
        <NewPostForm
          onSubmit={(content, replyToId, successCallback, userId) => {
            addTag(post.id, content, successCallback, userId);
          }}
          placeholder={placeholder}
          hideSubmitButton={true}
          small={true}
          characterLimit={25}
        />
      </div>
    </div>
  );
};

const ReplyForm = ({ userPhotoURL, replyToPostId }) => {
  return (
    <div
      className="mt-3"
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <div className={'mr-2'} style={{ alignSelf: 'flex-start' }}>
        {userPhotoURL ? (
          <img src={userPhotoURL} alt="user" style={{ height: 38 }} />
        ) : null}
      </div>
      <div style={{ flexGrow: 1 }}>
        <NewPostForm
          onSubmit={createNewPost}
          placeholder="Write a reply..."
          replyToId={replyToPostId}
          multiline={true}
        />
      </div>
    </div>
  );
};

const PostActionsDropdown = ({ deletePost }) => (
  <Dropdown>
    <MyDropdownToggle />
    <Dropdown.Menu>
      <Dropdown.Item as="button" onClick={deletePost}>
        Delete
      </Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
);

export const PostHeader = ({
  displayName,
  showActions,
  postActionsDropdown,
  timestamp,
  photoURL,
  small,
  postId,
  hackDoNotAddPostToMessageLinkURL,
}) => (
  <div style={{ fontSize: small ? '85%' : null }}>
    <div className="float-left mr-2">
      {photoURL ? (
        <img src={photoURL} alt="user" style={{ height: small ? 38 : 48 }} />
      ) : null}
    </div>
    <>
      <div>
        <strong>{displayName}</strong>
        <div className="float-right">
          {showActions ? postActionsDropdown : null}
        </div>
      </div>
      <div className="small text-muted">
        <Link to={hackDoNotAddPostToMessageLinkURL ? postId : 'post/' + postId}>
          {friendlyTimestamp(timestamp)}
        </Link>
      </div>
    </>
    <div style={{ clear: 'both' }}></div>
  </div>
);

const PostContent = ({ children, small }) => {
  const startCollapsed = typeof children === 'string' && children.length > 1000;
  const [collapsed, setCollapsed] = useState(startCollapsed);

  const collapsedContent = (
    <>
      {children.substring(0, 500)}
      {'... '}
      <span
        onClick={() => setCollapsed(false)}
        style={{ fontWeight: 600, cursor: 'pointer' }}
      >
        See More
      </span>
    </>
  );

  return (
    <div
      className="mt-1"
      style={{ whiteSpace: 'break-spaces', fontSize: small ? '85%' : null }}
    >
      {collapsed ? collapsedContent : children}
    </div>
  );
};

const Replies = ({ post, hackDoNotAddPostToMessageLinkURL }) => {
  const { user } = useContext(AppContext);
  const myUserId = user.uid;
  return (
    post &&
    post.childNodes &&
    post.childNodes.map((replyPost) => {
      const isMyPost = myUserId === replyPost.userId;
      return (
        <ReplyPostCard
          key={replyPost.id}
          showActions={isMyPost}
          postActionsDropdown={
            <PostActionsDropdown
              deletePost={() => deletePost({ postId: replyPost.id })}
            />
          }
          hackDoNotAddPostToMessageLinkURL={hackDoNotAddPostToMessageLinkURL}
          post={replyPost}
        />
      );
    }, this)
  );
};

const ReplyPostCard = ({
  showActions,
  postActionsDropdown,
  hackDoNotAddPostToMessageLinkURL,
  post,
}) => {
  const { user } = useContext(AppContext);
  const myUserId = user.uid;
  return (
    <Card className="mt-1">
      <Card.Body style={{ padding: '0.75rem' }}>
        <PostHeader
          displayName={post.userDisplayName}
          showActions={showActions}
          postActionsDropdown={postActionsDropdown}
          timestamp={post.timestamp}
          photoURL={post.userPhotoURL}
          small={true}
          postId={post.id}
          hackDoNotAddPostToMessageLinkURL={hackDoNotAddPostToMessageLinkURL}
        />
        <PostContent>{post.content}</PostContent>
        <div className="mt-2">
          <PostTags post={post} />
        </div>
        <div className="mt-3">
          <Replies
            post={post}
            hackDoNotAddPostToMessageLinkURL={hackDoNotAddPostToMessageLinkURL}
          />
        </div>
        <ReplyForm userPhotoURL={user.photoURL} replyToPostId={post.id} />
      </Card.Body>
    </Card>
  );
};

export class SmartPost extends React.Component {
  constructor() {
    super();
    this.state = {
      post: null,
    };
  }

  db = () => firebase.database();
  postRef = (postId) => this.db().ref('posts/' + postId);
  userRef = (userId) => this.db().ref('users/' + userId);

  componentDidMount() {
    const { postId } = this.props;
    this.postRef(postId).on('value', (postSnapshot) => {
      const post = postSnapshot.val();
      if (post) {
        post.id = postId;
        this.userRef(post.userId).once('value', (userSnapshot) => {
          const postUser = userSnapshot.val();
          post.userDisplayName = postUser.displayName;
          post.userPhotoURL = postUser.photoURL;
          post.childNodes = this.props.hackForPostChildNodes;
          this.setState({ post: post });
          // TODO BROKEN -- NEW REPLIES DO NOT APPEAR WITHOUT REFRESH
          // TODO BROKEN -- IF A POST IS DELETED, IT DOES NOT DISAPPEAR WITHOUT REFRESH (is this a problem?)
          // TODO BROKEN -- new tags aren't added either!?!
          // TODO get rid of hackForPostChildNodes / do the following:
          // TODO if this is a reply, include to which it was a reply and display as such
          // TODO if there are replies to this, display them
          // TODO actually need to have had pre-processing... will take childNodes here...
        });
      } else {
        this.setState({ post: null });
      }
    });
  }

  render() {
    if (!this.state.post) {
      return <>Loading SmartPost...</>;
    }

    return (
      <Post
        post={this.state.post}
        hackDoNotAddPostToMessageLinkURL={
          this.props.hackDoNotAddPostToMessageLinkURL
        }
      />
    );
  }
}

const Post = ({ post, hackDoNotAddPostToMessageLinkURL }) => {
  const { user } = useContext(AppContext);
  const myUserId = user.uid;
  const isMyPost = myUserId === post.userId;
  if (!post.id) {
    return <>Waiting for post.id</>;
  }

  return (
    <>
      <PostHeader
        displayName={post.userDisplayName}
        showActions={isMyPost}
        postActionsDropdown={
          <PostActionsDropdown
            deletePost={() => deletePost({ postId: post.id })}
          />
        }
        timestamp={post.timestamp}
        photoURL={post.userPhotoURL}
        postId={post.id}
        hackDoNotAddPostToMessageLinkURL={hackDoNotAddPostToMessageLinkURL}
      />
      <PostContent>{post.content}</PostContent>
      <div className="mt-2">
        <PostTags post={post} />
      </div>
      <div className="mt-3">
        <Replies
          post={post}
          hackDoNotAddPostToMessageLinkURL={hackDoNotAddPostToMessageLinkURL}
        />
      </div>
      <ReplyForm userPhotoURL={user.photoURL} replyToPostId={post.id} />
    </>
  );
};

export default Post;
