import React from 'react';
import Card from 'react-bootstrap/Card';
import HowToGetPremium from './HowToGetPremium';

export const PremiumSaleCard = () => {
  const premiumSaleCardVariants = [
    'primary',
    'success',
    'danger',
    'warning',
    'info',
  ];
  const randomPremiumSaleCardVariant =
    premiumSaleCardVariants[
      Math.floor(Math.random() * premiumSaleCardVariants.length)
    ];
  return (
    <Card
      className="mb-3"
      bg="light"
      border={randomPremiumSaleCardVariant}
      style={{ display: 'inline-block' }}
    >
      <Card.Body>
        <Card.Title>Premium Sale &#11088;</Card.Title>
        <h5>Features</h5>
        <ul>
          <li>View user profiles</li>
          <li>Access to premium rooms</li>
          <li>Access to Modality Trainer</li>
          <li>Access to Community Page</li>
          <li>Edit your posts</li>
          <li>Select a username</li>
          <li>Remove this ad</li>
        </ul>
        <p>
          <HowToGetPremium />
        </p>
      </Card.Body>
    </Card>
  );
};

export const PremiumFeature = ({ featureName }) => (
  <Card>
    <Card.Body>
      <Card.Title className="mb-3">Premium Feature</Card.Title>
      <p>
        {featureName ? <strong>{featureName}</strong> : 'This'} is a premium
        feature.
      </p>
      <p>
        <HowToGetPremium />
      </p>
    </Card.Body>
  </Card>
);
