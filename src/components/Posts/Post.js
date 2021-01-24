import React, { useContext, useState } from 'react';
import Linkify from 'linkifyjs/react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import friendlyTimestamp from '../shared/friendlyTimestamp';
import MyDropdownToggle from '../shared/MyDropdownToggle';
import NewPostForm from './NewPostForm';
import { AppContext } from '../AppProvider';
import firebase from '../firebase.js';
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
      className={'mr-2 ' + (active ? null : 'text-muted')}
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

const ReplyForm = ({ replyToPostId, onSuccess }) => {
  const { user } = useContext(AppContext);
  return (
    <Card className="mt-2">
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

export const PostHeader = ({ small, post, hideActionsAndTimestamp }) => {
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
            <Link to={'/posts/' + postId}>{friendlyTimestamp(timestamp)}</Link>
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
      <Linkify
        options={{
          defaultProtocol: 'https',
          target: {
            url: (url) =>
              url.startsWith('https://xbk.io') ? '_self' : '_blank',
          },
        }}
      >
        {children.substring(0, 500)}
      </Linkify>
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
      {collapsed ? (
        collapsedContent
      ) : (
        <Linkify
          options={{
            defaultProtocol: 'https',
            target: {
              url: (url) =>
                url.startsWith('https://xbk.io') ? '_self' : '_blank',
            },
          }}
        >
          {children}
        </Linkify>
      )}
    </div>
  );
};

const Replies = ({ post }) => {
  const { user } = useContext(AppContext);
  return (
    post &&
    post.childNodes &&
    post.childNodes.map((replyPost) => {
      return <ReplyPostCard key={replyPost.id} post={replyPost} />;
    }, this)
  );
};

// TODO write tests for this
// Note: this counts the first node (self)
const countAncestors = (node) => {
  const thisCount =
    node.childNodes &&
    node.childNodes.length > 0 &&
    node.childNodes.reduce((count, node) => {
      return count + countAncestors(node);
    }, 0);
  return thisCount + 1;
};

const Post = ({ post, small }) => {
  const [tagFormCollapsed, setTagFormCollapsed] = useState(true);
  const [repliesCollapsed, setRepliesCollapsed] = useState(true);
  const [replyFormCollapsed, setReplyFormCollapsed] = useState(true);
  if (!post.id) {
    return <>Waiting for post.id</>;
  }
  const replyCount = countAncestors(post) - 1;
  return (
    <>
      <PostHeader post={post} small={small} />
      <PostContent>{post.content}</PostContent>
      <hr style={{ margin: '1rem 0 .5rem' }} />
      <div>
        <div className="mb-2">
          <Tags post={post} />
        </div>
        <div className="mb-2">
          {!tagFormCollapsed && (
            <NewPostForm
              onSubmit={(content, replyToId, successCallback, userId) => {
                addTag(post.id, content, successCallback, userId);
              }}
              placeholder={'add tag'}
              hideSubmitButton={true}
              small={true}
              characterLimit={25}
            />
          )}
        </div>
        <div>
          <Upvote postId={post.id} />
          {/* // TODO replies icon active if you've replied to the thread */}
          <PostMenuBarItem
            onClick={() => setRepliesCollapsed(!repliesCollapsed)}
          >
            &#128488;&#65039; {replyCount}
          </PostMenuBarItem>
          <PostMenuBarItem
            onClick={() => setTagFormCollapsed(!tagFormCollapsed)}
            active={!tagFormCollapsed}
          >
            Tag
          </PostMenuBarItem>
          <PostMenuBarItem
            onClick={() => setReplyFormCollapsed(!replyFormCollapsed)}
            active={!replyFormCollapsed}
          >
            Reply
          </PostMenuBarItem>
        </div>
        {repliesCollapsed && replyCount > 0 && (
          // TODO abuse of card-footer class
          <div
            className="mt-2 card-footer"
            onClick={() => setRepliesCollapsed(!repliesCollapsed)}
          >
            <PostMenuBarItem>&#128488;&#65039; {replyCount}</PostMenuBarItem>
          </div>
        )}
        {!replyFormCollapsed && (
          <ReplyForm
            replyToPostId={post.id}
            onSuccess={() => setReplyFormCollapsed(true)}
          />
        )}
      </div>
      {!repliesCollapsed && post.childNodes.length > 0 && (
        <div className="mt-2">
          <Replies post={post} />
        </div>
      )}
    </>
  );
};

export default Post;

const ReplyPostCard = ({ post }) => {
  return (
    <Card className="mt-1">
      <Card.Body>
        <Post post={post} small={true} />
      </Card.Body>
    </Card>
  );
};
