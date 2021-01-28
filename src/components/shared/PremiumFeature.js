import React from 'react';
import Card from 'react-bootstrap/Card';

const PremiumFeature = ({ featureName }) => (
  <Card>
    <Card.Body>
      <Card.Title>Premium Feature</Card.Title>
      <p>
        {featureName ? <strong>{featureName}</strong> : 'This'} is a premium
        feature available to paying users.
      </p>
      <p>Please subscribe now to enjoy premium features.</p>
    </Card.Body>
  </Card>
);

export default PremiumFeature;
