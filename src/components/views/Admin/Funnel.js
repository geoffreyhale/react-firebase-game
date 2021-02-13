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
  const hasJoined = usersArray.filter((user) => user.joined).length;
  const hasLastLogin = usersArray.filter((user) => user.lastLogin).length;
  const hasLastOnline = usersArray.filter((user) => user.lastOnline).length;
  const countPremium = usersArray.filter((user) => user.isPremium).length;
  const premiumPercentage = Math.round((countPremium / countTotal) * 100);
  const active1h = usersArray.filter((user) => {
    return user.lastOnline && Date.now() - user.lastOnline < 3600000;
  }).length;
  const active1d = usersArray.filter((user) => {
    return user.lastOnline && Date.now() - user.lastOnline < 86400000;
  }).length;
  const active1w = usersArray.filter((user) => {
    return user.lastOnline && Date.now() - user.lastOnline < 604800000;
  }).length;
  const active1m = usersArray.filter((user) => {
    return user.lastOnline && Date.now() - user.lastOnline < 2.628e9;
  }).length;
  const active1y = usersArray.filter((user) => {
    return user.lastOnline && Date.now() - user.lastOnline < 3.154e10;
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
      label: `Premium (${premiumPercentage}%)`,
    },
  ];

  const activityData = [
    {
      id: 'countTotal',
      value: countTotal,
      label: 'Total',
    },
    {
      id: 'active1y',
      value: active1y,
      label: `Active 1y (${Math.round((active1y / countTotal) * 100)}%)`,
    },
    {
      id: 'active1m',
      value: active1m,
      label: `Active 1m (${Math.round((active1m / countTotal) * 100)}%)`,
    },
    {
      id: 'active1w',
      value: active1w,
      label: `Active 1w (${Math.round((active1w / countTotal) * 100)}%)`,
    },
    {
      id: 'active1d',
      value: active1d,
      label: `Active 1d (${Math.round((active1d / countTotal) * 100)}%)`,
    },
    {
      id: 'active1h',
      value: active1h,
      label: `Active 1h (${Math.round((active1h / countTotal) * 100)}%)`,
    },
  ];

  const dataData = [
    {
      id: 'countTotal',
      value: countTotal,
      label: 'Total',
    },
    {
      id: 'hasJoined',
      value: hasJoined,
      label: 'hasJoined',
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
  ];

  return (
    <>
      <div style={{ height: 100 }}>
        <MyResponsiveFunnel data={conversionData} />
      </div>
      <HorizontalLabels data={conversionData} />
      <div style={{ height: 200 }}>
        <MyResponsiveFunnel data={activityData} />
      </div>
      <HorizontalLabels data={activityData} />
      <div style={{ height: 100 }}>
        <MyResponsiveFunnel data={dataData} />
      </div>
      <HorizontalLabels data={dataData} />
    </>
  );
};

export default Funnel;
