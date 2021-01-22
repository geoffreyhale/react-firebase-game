import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import friendlyTimestamp from '../shared/friendlyTimestamp';
import MyDropdownToggle from '../shared/MyDropdownToggle';
import NewPostForm from './NewPostForm';
import { AppContext } from '../AppProvider';
import firebase from '../../firebase.js';
import Tag from '../shared/Tag';
import { createNewPost, deletePost } from '../shared/db';
import UserPhoto from '../shared/UserPhoto';
import { Upvote } from './PostVote';

const redditRed = '#fd5828';

export const PostMenuBarItem = ({ active = false, children, onClick }) => {
  return (
    <small
      onClick={onClick}
      style={{
        fontWeight: 600,
        cursor: 'pointer',
        color: active ? redditRed : null,
      }}
      className={active ? null : 'text-muted'}
    >
      {children}
    </small>
  );
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

const AddTags = ({ post }) => {
  const [formCollapsed, setFormCollapsed] = useState(true);
  const { user } = useContext(AppContext);

  if (formCollapsed) {
    return (
      <PostMenuBarItem onClick={() => setFormCollapsed(false)}>
        Tag
      </PostMenuBarItem>
    );
  }

  const { tags } = post;
  // const placeholder =
  //   tags && Object.keys(tags).length > 0
  //     ? 'add tag'
  //     : 'this post needs tags help add tags';

  return (
    <NewPostForm
      onSubmit={(content, replyToId, successCallback, userId) => {
        addTag(post.id, content, successCallback, userId);
      }}
      placeholder={'submit tags one at a time'}
      hideSubmitButton={true}
      small={true}
      characterLimit={25}
      autoFocus={true}
    />
  );
};

const Tags = ({ post }) => {
  const { user } = useContext(AppContext);
  const { tags } = post;

  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <>
      {Object.values(tags).map((tag) => {
        const tagUniqueKey = post.id + tag.userId + tag.type + Math.random();
        if (tag.userId === user.uid) {
          return (
            <Tag variant="info" key={tagUniqueKey}>
              {tag.type}
            </Tag>
          );
        }
        return <Tag key={tagUniqueKey}>{tag.type}</Tag>;
      })}
    </>
  );
};

const ReplyForm = ({ replyToPostId, autoFocus, onSuccess }) => {
  const { user } = useContext(AppContext);
  return (
    <Card className="mt-1">
      <Card.Body>
        <div
          className="mt-3"
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <div className={'mr-2'} style={{ alignSelf: 'flex-start' }}>
            {user.uid ? <UserPhoto uid={user.uid} size={38} /> : null}
          </div>
          <div style={{ flexGrow: 1 }}>
            <NewPostForm
              onSubmit={createNewPost}
              onSuccess={onSuccess}
              placeholder="Write a reply..."
              replyToId={replyToPostId}
              multiline={true}
              autoFocus={autoFocus}
            />
          </div>
        </div>
      </Card.Body>
    </Card>
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
  small,
  hackDoNotAddPostToMessageLinkURL,
  post,
  hideActionsAndTimestamp,
}) => {
  const { user } = useContext(AppContext);
  const displayName = post.userDisplayName;
  const timestamp = post.timestamp;
  const photoURL = post.userPhotoURL;
  const postId = post.id;
  const isMyPost = user.uid === post.userId;
  const showActions = isMyPost;

  return (
    <div style={{ fontSize: small ? '85%' : null }}>
      {post.userId ? (
        <div className="float-left mr-2">
          <UserPhoto uid={post.userId} size={small ? 38 : 48} />
        </div>
      ) : null}
      <>
        <div>
          <strong>{displayName}</strong>
          {hideActionsAndTimestamp ? null : (
            <div className="float-right">
              {showActions ? (
                <PostActionsDropdown
                  deletePost={() => deletePost({ postId: post.id })}
                />
              ) : null}
            </div>
          )}
        </div>
        {hideActionsAndTimestamp ? null : (
          <div className="small text-muted">
            <Link
              to={hackDoNotAddPostToMessageLinkURL ? postId : 'posts/' + postId}
            >
              {friendlyTimestamp(timestamp)}
            </Link>
          </div>
        )}
      </>
      <div style={{ clear: 'both' }}></div>
    </div>
  );
};

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
      style={{
        whiteSpace: 'break-spaces',
        wordBreak: 'break-word',
        fontSize: small ? '85%' : null,
      }}
    >
      {collapsed ? collapsedContent : children}
    </div>
  );
};

const Replies = ({ post, hackDoNotAddPostToMessageLinkURL }) => {
  const { user } = useContext(AppContext);
  return (
    post &&
    post.childNodes &&
    post.childNodes.map((replyPost) => {
      return (
        <ReplyPostCard
          key={replyPost.id}
          hackDoNotAddPostToMessageLinkURL={hackDoNotAddPostToMessageLinkURL}
          post={replyPost}
        />
      );
    }, this)
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

const Post = ({ post, hackDoNotAddPostToMessageLinkURL, small }) => {
  const [replyFormCollapsed, setReplyFormCollapsed] = useState(true);
  if (!post.id) {
    return <>Waiting for post.id</>;
  }
  return (
    <>
      <PostHeader
        hackDoNotAddPostToMessageLinkURL={hackDoNotAddPostToMessageLinkURL}
        post={post}
        small={small}
      />
      <PostContent>{post.content}</PostContent>
      <div className="mt-2">
        <div className="mb-1">
          <Tags post={post} />
        </div>
        {/* <hr style={{ margin: '0.25rem 0' }} /> */}
        <div>
          <Upvote postId={post.id} />
          <span className="ml-2">
            <AddTags post={post} />
          </span>
          {replyFormCollapsed && (
            <span className="ml-2">
              <PostMenuBarItem onClick={() => setReplyFormCollapsed(false)}>
                Reply
              </PostMenuBarItem>
            </span>
          )}
        </div>
        {!replyFormCollapsed && (
          <ReplyForm
            replyToPostId={post.id}
            autoFocus={small}
            onSuccess={() => setReplyFormCollapsed(true)}
          />
        )}
      </div>
      {post.childNodes.length > 0 && (
        <div className="mt-3">
          <Replies
            post={post}
            hackDoNotAddPostToMessageLinkURL={hackDoNotAddPostToMessageLinkURL}
          />
        </div>
      )}
    </>
  );
};

export default Post;

const ReplyPostCard = ({ hackDoNotAddPostToMessageLinkURL, post }) => {
  return (
    <Card className="mt-1">
      <Card.Body>
        <Post
          post={post}
          hackDoNotAddPostToMessageLinkURL={hackDoNotAddPostToMessageLinkURL}
          small={true}
        />
      </Card.Body>
    </Card>
  );
};
