import format from 'date-fns/format';
import { ResponsiveBar } from '@nivo/bar';
import React, { useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Table from 'react-bootstrap/Table';
import ToggleButton from 'react-bootstrap/ToggleButton';
import countWords from '../../shared/countWords';
import PostLink from '../../shared/PostLink';
import { AppContext } from '../../AppProvider';

//TODO write tests for this; the hours are surely busted and posts/day misrepresented

//TODO this is probably not quite right
const millisecondAdjustmentHack = new Date().getTimezoneOffset() * 60 * 1000;

const daysFromMilliseconds = (milliseconds) => milliseconds / 1000 / 86400;
const millisecondsFromDays = (days) => days * 1000 * 86400;

const dateFromDaysSinceEpoch = (days) => {
  return new Date(millisecondsFromDays(days) + millisecondAdjustmentHack);
};

const daysSinceEpoch = (timestamp) => {
  return Math.floor(
    daysFromMilliseconds(timestamp - millisecondAdjustmentHack)
  );
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
        data={barData}
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

const PeriodRadioSelect = ({ daysPerBar, setDaysPerBar }) => (
  <ButtonGroup toggle>
    <Button disabled>Days</Button>
    {[
      { name: '1', value: 1 },
      { name: '3', value: 3 },
      { name: '7', value: 7 },
      { name: '30', value: 30 },
    ].map((radio, idx) => (
      <ToggleButton
        key={idx}
        type="radio"
        // variant="secondary"
        name="radio"
        value={radio.value}
        checked={daysPerBar === radio.value}
        onChange={(e) => {
          setDaysPerBar(parseInt(e.currentTarget.value));
        }}
      >
        {radio.name}
      </ToggleButton>
    ))}
  </ButtonGroup>
);

export const PostsPerDay = ({ posts }) => {
  const [daysPerBar, setDaysPerBar] = useState(1);

  const postsByDay = {};
  //TODO find earliest post date, then load keys for every day until now
  Object.values(posts).forEach((post) => {
    const day = daysSinceEpoch(post.timestamp);
    postsByDay[day] = postsByDay[day] || {};
    postsByDay[day][post.id] = post;
  });

  const postsByDays = {};
  const earliestDay = Math.min(...Object.keys(postsByDay));
  const mostRecentDay = Math.max(...Object.keys(postsByDay));
  let startDayOfPeriod = earliestDay;
  while (startDayOfPeriod < mostRecentDay + 1) {
    postsByDays[startDayOfPeriod] = postsByDay[startDayOfPeriod];
    for (let i = 1; i < daysPerBar; i++) {
      postsByDays[startDayOfPeriod] = Object.assign(
        postsByDays[startDayOfPeriod],
        postsByDay[startDayOfPeriod + i]
      );
    }
    startDayOfPeriod += daysPerBar;
  }

  return (
    <>
      <PeriodRadioSelect
        daysPerBar={daysPerBar}
        setDaysPerBar={setDaysPerBar}
      />
      <PostsPerDayBarChart postsByDay={postsByDays} />
      <Table>
        <tbody>
          {Object.entries(postsByDays)
            .reverse()
            .map(([daysSinceEpoch, posts]) => (
              <tr>
                <td>
                  {format(
                    dateFromDaysSinceEpoch(daysSinceEpoch),
                    'MMMM d, yyyy'
                  )}
                </td>
                <td>{Object.keys(posts).length}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </>
  );
};
