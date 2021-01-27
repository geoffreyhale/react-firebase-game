import React from 'react';
import { ResponsiveFunnel } from '@nivo/funnel';

import './Funnel.css';

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const MyResponsiveFunnel = ({ data /* see data tab */ }) => (
  <ResponsiveFunnel
    data={data}
    direction="horizontal"
    labelColor="black"
    // labelColor={{ from: 'color', modifiers: [['darker', 3]] }}
    // margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
    shapeBlending={1}
    colors={{ scheme: 'spectral' }}
    fillOpacity={0.2}
    // borderWidth={20}
    // currentPartSizeExtension={10}
    // currentBorderWidth={40}
    // motionConfig="wobbly"
  />
);

const HorizontalLabels = ({ data }) => (
  <ul className="horizontal-justify">
    {data.map((datum) => (
      <li style={{ width: 100 / data.length + '%' }}>{datum.label}</li>
    ))}
  </ul>
);

const Funnel = ({ usersArray }) => {
  const countTotal = usersArray.length;
  const hasLastLogin = usersArray.filter((user) => user.lastLogin).length;
  const hasLastOnline = usersArray.filter((user) => user.lastOnline).length;
  const countPremium = usersArray.filter((user) => user.isPremium).length;
  const active1h = usersArray.filter((user) => {
    return user.lastOnline && Date.now() - user.lastOnline < 3600000;
  }).length;
  const active1d = usersArray.filter((user) => {
    return user.lastOnline && Date.now() - user.lastOnline < 86400000;
  }).length;
  const active1w = usersArray.filter((user) => {
    return user.lastOnline && Date.now() - user.lastOnline < 604800000;
  }).length;

  const conversionData = [
    {
      id: 'countTotal',
      value: countTotal,
      label: 'Total',
    },
    {
      id: 'countPremium',
      value: countPremium,
      label: `Premium ${Math.round((countPremium / countTotal) * 100)}%`,
    },
  ];

  const activityData = [
    {
      id: 'countTotal',
      value: countTotal,
      label: 'Total',
    },
    {
      id: 'hasLastLogin',
      value: hasLastLogin,
      label: 'hasLastLogin',
    },
    {
      id: 'hasLastOnline',
      value: hasLastOnline,
      label: 'hasLastOnline',
    },
    {
      id: 'active1w',
      value: active1w,
      label: 'Active (1 week)',
    },
    {
      id: 'active1d',
      value: active1d,
      label: 'Active (1 day)',
    },
    {
      id: 'active1h',
      value: active1h,
      label: 'Active (1 hour)',
    },
  ];

  return (
    <>
      <div style={{ height: 200 }}>
        <MyResponsiveFunnel data={conversionData} />
      </div>
      <HorizontalLabels data={conversionData} />
      <div style={{ height: 300 }}>
        <MyResponsiveFunnel data={activityData} />
      </div>
      <HorizontalLabels data={activityData} />
    </>
  );
};

export default Funnel;
