import React, { useContext, useState } from 'react';
import Linkify from 'linkifyjs/react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import FriendlyTimestamp from '../../shared/timestamp';
import MyDropdownToggle from '../../shared/MyDropdownToggle';
import NewPostForm from './NewPostForm';
import { AppContext } from '../../AppProvider';
import PostLink, { postLink } from '../../shared/PostLink';
import Tag from '../../shared/Tag';
import { addTag, createPost, deletePost, editPost } from '../../../api/index';
import { UserPhoto } from '../../shared/User';
import MarkAsSeenButton from './MarkAsSeenButton';
import { Upvote } from './PostVote';
import { ModalityVotingBooth } from '../../shared/Modalities';
import { jankyCopyToClipboard } from '../../shared/copyToClipboard';

import './post.css';

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
            <Tag
              variant="info"
              key={tagUniqueKey}
              allowDelete={true}
              postId={post.id}
            >
              {tag.type}
            </Tag>
          );
        }
        return <Tag key={tagUniqueKey}>{tag.type}</Tag>;
      })}
    </>
  );
};

const ReplyForm = ({ replyToPostId, onSuccess, hackRoom }) => {
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
              onSubmit={createPost}
              onSuccess={onSuccess}
              placeholder="Write a reply..."
              replyToId={replyToPostId}
              multiline={true}
              hackRoom={hackRoom}
            />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

const PostActionsDropdown = ({ deletePost, editPost }) => {
  const { user } = useContext(AppContext);
  return (
    <Dropdown>
      <MyDropdownToggle />
      <Dropdown.Menu>
        {user.isPremium && (
          <>
            <Dropdown.Item as="button" onClick={editPost}>
              Edit
            </Dropdown.Item>
            <Dropdown.Divider />
          </>
        )}
        <Dropdown.Item as="button" onClick={deletePost}>
          Delete
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export const PostCardBodyHeaderRoom = ({ room }) =>
  (room && (
    <span>
      {' '}
      &#8250;{' '}
      <Link to={`/r/${room}`} style={{ color: 'inherit' }}>
        <strong style={{ fontWeight: 600 }}>{`r/${room}`}</strong>
      </Link>
    </span>
  ): null);

export const PostCardBodyHeader = ({
  small,
  post,
  hideActionsAndTimestamp,
  hackRoom,
  setEditMode,
  ToggleCollapseBranchButton,
}) => {
  const { user } = useContext(AppContext);
  const displayName = post.userDisplayName;
  const timestamp = post.timestamp;
  const postId = post.id;
  const isMyPost = user.uid === post.userId;
  const showActions = isMyPost;

  return (
    <>
      <div style={{ fontSize: small ? '85%' : null }}>
        {post.userId ? (
          <div className="float-left mr-2">
            <UserPhoto uid={post.userId} size={small ? 38 : 48} />
          </div>
        ) : null}
        <>
          <div className="float-right">
            {ToggleCollapseBranchButton}
            {!hideActionsAndTimestamp && showActions && (
              <div style={{ display: 'inline-block' }}>
                <PostActionsDropdown
                  deletePost={() => deletePost({ postId: post.id })}
                  editPost={() => setEditMode(true)}
                />
              </div>
            )}
          </div>
          <div>
            <Link
              style={{ color: 'inherit', display: 'inline-block' }}
              to={`/u/${post.userId}`}
            >
              <strong style={{ fontWeight: 600 }}>{displayName}</strong>
            </Link>
            {!small && <PostCardBodyHeaderRoom room={hackRoom} />}
          </div>
          {hideActionsAndTimestamp ? null : (
            <div className="small text-muted">
              <PostLink room={hackRoom} id={postId}>
                {FriendlyTimestamp(timestamp)}
              </PostLink>
            </div>
          )}
        </>
        <div style={{ clear: 'both' }}></div>
      </div>
    </>
  );
};

const PostContent = ({ children, small }) => {
  const startCollapsed = typeof children === 'string' && children.length > 600;
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
        {typeof children === 'string' && children.substring(0, 400)}
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

const Replies = ({ post, hackRoom, hackIsSinglePostPage }) => {
  const { user } = useContext(AppContext);
  return (
    post &&
    post.childNodes &&
    post.childNodes.map((replyPost) => {
      return (
        <ReplyPostCard
          key={replyPost.id}
          post={replyPost}
          hackRoom={hackRoom}
          hackIsSinglePostPage={hackIsSinglePostPage}
        />
      );
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

const PostCardHeader = ({
  parentPostAuthorUid,
  replyToPostId,
  room,
  showHeaderLinkToParent,
}) =>
  showHeaderLinkToParent && replyToPostId ? (
    <Card.Header className={'p-0'}>
      {parentPostAuthorUid && (
        <span className="mr-1">
          <UserPhoto size={24} uid={parentPostAuthorUid} />
        </span>
      )}
      {room && replyToPostId && (
        <Link to={`/r/${room}/posts/${replyToPostId}`}>&#8598;...</Link>
      )}
    </Card.Header>
  ) : null;

const Post = ({
  post,
  small,
  hackRoom,
  hackIsSinglePostPage,
  showHeaderLinkToParent,
  isUnseenFeed,
  hackHideRepliesCount,
  parentPostAuthorUid = null,
}) => {
  const [tagFormCollapsed, setTagFormCollapsed] = useState(true);
  const [repliesCollapsed, setRepliesCollapsed] = useState(
    !hackIsSinglePostPage
  );
  const [replyFormCollapsed, setReplyFormCollapsed] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [branchCollapsed, setBranchCollapsed] = useState(false);
  const [contentCollapsed, setContentCollapsed] = useState(false);
  if (!post) {
    return (
      <Card>
        <Card.Body>Post not found!</Card.Body>
      </Card>
    );
  }
  if (!post.id) {
    return <>Waiting for post.id</>;
  }
  const replyCount = countAncestors(post) - 1;
  return (
    <Card className="mt-3 post" bg={hackRoom === 'dev' && 'light'}>
      <PostCardHeader
        parentPostAuthorUid={parentPostAuthorUid}
        replyToPostId={post.replyToId}
        room={hackRoom}
        showHeaderLinkToParent={showHeaderLinkToParent}
      />
      <Card.Body>
        <PostCardBodyHeader
          post={post}
          small={small}
          hackRoom={hackRoom}
          setEditMode={setEditMode}
          ToggleCollapseBranchButton={
            <Button
              size="sm"
              variant="light"
              onClick={() => setBranchCollapsed(!branchCollapsed)}
            >
              {branchCollapsed ? 'Show Branch' : 'Collapse Branch'}
            </Button>
          }
        />
        {!branchCollapsed && (
          <>
            <div className="content mb-2">
              {editMode ? (
                <NewPostForm
                  onSubmit={false}
                  editPostIdHack={post.id}
                  onSubmitEditHack={editPost}
                  onSuccess={() => setEditMode(false)}
                  multiline={true}
                  content={post.content}
                />
              ) : (
                !contentCollapsed && (
                  <PostContent>
                    {post.deleted ? (
                      <small className="text-muted">[DELETED BY USER]</small>
                    ) : (
                      post.content
                    )}
                  </PostContent>
                )
              )}
            </div>
            {/* <hr style={{ margin: '1rem 0 .5rem' }} /> */}
            <div>
              {!contentCollapsed && (
                <div className="mb-2">
                  <Tags post={post} />
                </div>
              )}
              <div className="mb-2">
                {!tagFormCollapsed && (
                  <NewPostForm
                    onSubmit={({ content, successCallback, uid }) => {
                      addTag({
                        postId: post.id,
                        content,
                        successCallback,
                        uid,
                      });
                    }}
                    placeholder={'add tag'}
                    hideSubmitButton={true}
                    small={true}
                    characterLimit={25}
                    hackRoom={hackRoom}
                  />
                )}
              </div>
              <div>
                <Upvote postId={post.id} />
                {/* // TODO replies icon active if you've replied to the thread */}
                {!hackHideRepliesCount && (
                  <PostMenuBarItem
                    onClick={() => setRepliesCollapsed(!repliesCollapsed)}
                  >
                    &#128488;&#65039; {replyCount}
                  </PostMenuBarItem>
                )}
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
                <PostMenuBarItem
                  onClick={() =>
                    jankyCopyToClipboard(
                      postLink({ id: post.id, room: hackRoom }, true)
                    )
                  }
                >
                  Share
                </PostMenuBarItem>
                <PostMenuBarItem
                  onClick={() => setContentCollapsed(!contentCollapsed)}
                  active={contentCollapsed}
                >
                  {contentCollapsed ? 'Show' : 'Collapse Content'}
                </PostMenuBarItem>
                {/* <PostMenuBarItem
                  onClick={() => setBranchCollapsed(!branchCollapsed)}
                  active={branchCollapsed}
                >
                  Collapse Branch
                </PostMenuBarItem> */}
              </div>
              {post.modalities &&
                Object.values(post.modalities).map((modality) => (
                  <div className="mt-2" key={modality.name}>
                    <ModalityVotingBooth modality={modality} postId={post.id} />
                  </div>
                ))}
              {repliesCollapsed && replyCount > 0 && (
                // TODO abuse of card-footer class
                <div
                  className="mt-2 card-footer"
                  onClick={() => setRepliesCollapsed(!repliesCollapsed)}
                >
                  <PostMenuBarItem>
                    &#128488;&#65039; {replyCount}
                  </PostMenuBarItem>
                </div>
              )}
              {!replyFormCollapsed && (
                <ReplyForm
                  replyToPostId={post.id}
                  onSuccess={() => setReplyFormCollapsed(true)}
                  hackRoom={hackRoom}
                />
              )}
            </div>
            {!repliesCollapsed && post.childNodes.length > 0 && (
              // <div className="mt-2">
              <Replies
                post={post}
                hackRoom={hackRoom}
                hackIsSinglePostPage={hackIsSinglePostPage}
              />
              // </div>
            )}
          </>
        )}
      </Card.Body>
      {isUnseenFeed && (
        <Card.Footer>
          <div className="float-right">
            <MarkAsSeenButton postId={post.id} />
          </div>
          <div style={{ clear: 'both' }}></div>
        </Card.Footer>
      )}
    </Card>
  );
};

export default Post;

const ReplyPostCard = ({ post, hackRoom, hackIsSinglePostPage }) => {
  return (
    <Post
      post={post}
      small={true}
      hackRoom={hackRoom}
      hackIsSinglePostPage={hackIsSinglePostPage}
    />
  );
};
