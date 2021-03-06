import React from 'react';
import Card from 'react-bootstrap/Card';
import { PremiumSaleCard } from '../../shared/Premium';

const PremiumPage = () => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>Premium</Card.Title>
        <PremiumSaleCard />
      </Card.Body>
    </Card>
  );
};
export default PremiumPage;
