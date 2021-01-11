import React from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import friendlyTimestamp from '../shared/friendlyTimestamp';
import MyDropdownToggle from '../shared/MyDropdownToggle';
import NewPostForm from './NewPostForm';
import PostTags from './PostTags';
import MarkAsSeenButton from './MarkAsSeenButton';

const ReplyForm = ({ userPhotoURL, createNewPost, replyToPostId }) => {
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
  hackDoNotAddPostToMessageLinks,
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
        <Link to={hackDoNotAddPostToMessageLinks ? postId : 'post/' + postId}>
          {friendlyTimestamp(timestamp)}
        </Link>
      </div>
    </>
    <div style={{ clear: 'both' }}></div>
  </div>
);

const PostContent = ({ children, small }) => (
  <div
    className="mt-1"
    style={{ whiteSpace: 'break-spaces', fontSize: small ? '85%' : null }}
  >
    {children}
  </div>
);

const ReplyPostCard = ({
  userDisplayName,
  showActions,
  postActionsDropdown,
  timestamp,
  userPhotoURL,
  content,
  postTags,
  myUserId,
  thisPostId,
  addTag,
}) => {
  return (
    <Card className="mt-1">
      <Card.Body style={{ padding: '0.75rem' }}>
        <PostHeader
          displayName={userDisplayName}
          showActions={showActions}
          postActionsDropdown={postActionsDropdown}
          timestamp={timestamp}
          photoURL={userPhotoURL}
          small={true}
          postId={thisPostId}
        />
        <PostContent>{content}</PostContent>
        {addTag && (
          <div className="mt-2">
            <PostTags
              tags={postTags}
              myUserId={myUserId}
              addTag={(content, successCallback) =>
                addTag(thisPostId, content, successCallback, myUserId)
              }
              postId={thisPostId}
            />
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

const Post = ({
  post,
  myUserId,
  myPhotoURL,
  createNewPost,
  deletePost,
  addTag,
  hackDoNotAddPostToMessageLinks,
  hackShowSeenButton,
}) => {
  const isMyPost = myUserId === post.userId;
  return (
    <Card>
      <Card.Body>
        <PostHeader
          displayName={post.userDisplayName}
          showActions={isMyPost}
          postActionsDropdown={
            deletePost && (
              <PostActionsDropdown deletePost={() => deletePost(post.id)} />
            )
          }
          timestamp={post.timestamp}
          photoURL={post.userPhotoURL}
          postId={post.id}
          hackDoNotAddPostToMessageLinks={hackDoNotAddPostToMessageLinks}
        />
        <PostContent>{post.content}</PostContent>
        {addTag && (
          <div className="mt-2">
            <PostTags
              tags={post.tags}
              myUserId={myUserId}
              addTag={(content, successCallback) =>
                addTag(post.id, content, successCallback, myUserId)
              }
              postId={post.id}
            />
          </div>
        )}
        <div className="mt-3">
          {post &&
            post.childNodes &&
            post.childNodes.map((replyPost) => {
              const isMyPost = myUserId === replyPost.userId;
              const postActionsDropdown = deletePost && (
                <PostActionsDropdown
                  deletePost={() => deletePost(replyPost.id)}
                />
              );
              return (
                <ReplyPostCard
                  key={replyPost.id}
                  userDisplayName={replyPost.userDisplayName}
                  showActions={isMyPost}
                  postActionsDropdown={postActionsDropdown}
                  timestamp={replyPost.timestamp}
                  userPhotoURL={replyPost.userPhotoURL}
                  content={replyPost.content}
                  postTags={replyPost.tags}
                  myUserId={myUserId}
                  thisPostId={replyPost.id}
                  addTag={addTag}
                />
              );
            }, this)}
        </div>
        {
          // this is a dirty temp hack to avoid reply posts to reply posts, which are not currently handled
          post.replyToId
            ? null
            : createNewPost && (
                <ReplyForm
                  userPhotoURL={myPhotoURL}
                  createNewPost={createNewPost}
                  replyToPostId={post.id}
                />
              )
        }
      </Card.Body>
      {hackShowSeenButton ? (
        <Card.Footer>
          <div className="mt-2 float-right">
            <MarkAsSeenButton postId={post.id} userId={myUserId} />
          </div>
          <div style={{ clear: 'both' }}></div>
        </Card.Footer>
      ) : null}
    </Card>
  );
};

export default Post;
