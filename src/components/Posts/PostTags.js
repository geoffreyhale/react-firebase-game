import React from 'react';
import NewPostForm from './NewPostForm';
import Tag from './Tag';

const PostTags = ({ tags, myUserId, addTag, postId }) => {
  const placeholder =
    tags && Object.keys(tags).length > 0
      ? 'add tag'
      : 'this post needs tags help add tags';

  return (
    <div>
      {tags &&
        Object.values(tags).map((tag) => {
          const tagUniqueKey = postId + tag.userId + tag.type + Math.random();
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
          onSubmit={(content, replyToId, successCallback) => {
            addTag(content, successCallback);
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

export default PostTags;
