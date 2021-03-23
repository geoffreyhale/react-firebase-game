import React, { useContext } from 'react';
import Card from 'react-bootstrap/Card';
import { AppContext } from '../../AppProvider';
import FriendlyTimestamp from '../../shared/timestamp';
import PayPal from './PayPal';

const UserPremiumStatusCard = () => {
  const { user } = useContext(AppContext);
  return (
    <Card
      style={{ display: 'inline-block' }}
      bg={user.isPremium ? 'success' : 'warning'}
    >
      <Card.Body>
        {user.isPremium ? (
          <>
            You have premium until{' '}
            {FriendlyTimestamp(user.premium.seconds * 1000)}.
          </>
        ) : (
          'You do not currently have premium.'
        )}
      </Card.Body>
    </Card>
  );
};

const PremiumPage = () => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>Premium</Card.Title>
        <Card.Body>
          <h6>Status</h6>
          <UserPremiumStatusCard />
        </Card.Body>
        <Card.Body>
          <h6>Purchase</h6>
          <div className="mt-3">
            <PayPal />
          </div>
        </Card.Body>
      </Card.Body>
    </Card>
  );
};
export default PremiumPage;
