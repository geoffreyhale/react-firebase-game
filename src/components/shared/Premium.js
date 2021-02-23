import React from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';

export const GetPremium = () => (
  <>
    Ask in <Link to="/r/general">r/general</Link> how to get premium.
  </>
);

export const PremiumSaleCard = () => {
  const premiumSaleCardVariants = [
    'success',
    'danger',
    'warning',
    'info',
    'dark',
  ];
  const randomPremiumSaleCardVariant =
    premiumSaleCardVariants[
      Math.floor(Math.random() * premiumSaleCardVariants.length)
    ];
  return (
    <Card className="mb-3" bg={randomPremiumSaleCardVariant} text="white">
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
          <GetPremium />
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
        <GetPremium />
      </p>
    </Card.Body>
  </Card>
);
