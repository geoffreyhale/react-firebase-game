import format from 'date-fns/format';
import { ResponsiveBar } from '@nivo/bar';
import React, { useContext } from 'react';
import Table from 'react-bootstrap/Table';
import countWords from '../../shared/countWords';
import PostLink from '../../shared/PostLink';
import { AppContext } from '../../AppProvider';

const dateFromDaysSinceEpoch = (days) => {
  return new Date(days * 1000 * 86400);
};

const daysSinceEpoch = (timestamp) => {
  return Math.floor(timestamp / 1000 / 86400);
};

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

export const PostsMiniCard = ({ posts }) => {
  Object.keys(posts).map((key) => {
    posts[key].id = key;
  });

  const count = Object.keys(posts).length;
  const postsWithNoRoom = Object.values(posts).filter((post) => !post.room);
  const postsDeleted = Object.values(posts).filter(
    (post) => post.deleted === true
  );
  const postsDeletedWithNoReplies = postsDeleted.filter((post) => {
    return !Object.values(posts).some((p) => p.replyToId === post.id);
  });

  return (
    <>
      <div>
        <strong>Total:</strong> {count}
      </div>
      <div title="posts w undefined room">
        <strong>Room Orphans:</strong> {postsWithNoRoom.length}
      </div>
      {postsWithNoRoom.map((post) => (
        <div>id: {post.id}</div>
      ))}
      <div>
        <strong>Deleted:</strong> {postsDeleted.length}
      </div>
      <div>
        <strong title="deleted w no replies">Removable:</strong>{' '}
        {postsDeletedWithNoReplies.length}
      </div>
      {postsDeletedWithNoReplies.map((post) => (
        <div>
          id:{' '}
          <PostLink id={post.id} room={post.room}>
            {post.id}
          </PostLink>
        </div>
      ))}
    </>
  );
};

const PostsPerDayBarChart = ({ postsByDay }) => {
  const { user } = useContext(AppContext);

  const barData = [];
  Object.entries(postsByDay).forEach(([day, posts]) => {
    barData.push({
      day: format(dateFromDaysSinceEpoch(day), 'MMMM d, yyyy'),
      postsCount: Object.keys(posts).length,
      myPostsCount: Object.values(posts).filter(
        (post) => post.userId === user.uid
      ).length,
      notMyPostsCount: Object.values(posts).filter(
        (post) => post.userId !== user.uid
      ).length,
    });
  });

  return (
    <div style={{ height: 400 }}>
      <ResponsiveBar
        data={Object.values(barData)}
        keys={['notMyPostsCount', 'myPostsCount']}
        indexBy="day"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={{ scheme: 'accent' }}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'days',
          legendPosition: 'middle',
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'posts',
          legendPosition: 'middle',
          legendOffset: -40,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        legends={[
          {
            dataFrom: 'keys',
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: 'left-to-right',
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: 'hover',
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
      />
    </div>
  );
};

export const PostsPerDay = ({ posts }) => {
  const postsByDay = {};
  Object.values(posts).forEach((post) => {
    const day = daysSinceEpoch(post.timestamp);
    postsByDay[day] = postsByDay[day] || {};
    postsByDay[day][post.id] = post;
  });

  return (
    <>
      <PostsPerDayBarChart postsByDay={postsByDay} />
      <Table>
        <tbody>
          {Object.entries(postsByDay).map(([daysSinceEpoch, posts]) => (
            <tr>
              <td>
                {format(dateFromDaysSinceEpoch(daysSinceEpoch), 'MMMM d, yyyy')}{' '}
              </td>
              <td>{Object.keys(posts).length}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};
