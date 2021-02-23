import React, { useContext, useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { withRouter } from 'react-router';
import { getEvent } from '../../../api';
import { AppContext } from '../../AppProvider';
import { PremiumFeature } from '../../shared/Premium';

const Events = (props) => {
  const { user } = useContext(AppContext);
  const [event, setEvent] = useState({});

  const { eventId } = props.match.params;

  useEffect(() => {
    if (user.isPremium) {
      getEvent({ eventId }, (event) => {
        setEvent(event);
      });
    }
  }, [eventId]);

  if (!user.isPremium) {
    return <PremiumFeature featureName={'Events'} />;
  }

  if (!event.id) {
    return null;
  }

  return (
    <Card>
      <Card.Body>
        <div>
          <small className="text-muted">You're invited to...</small>
        </div>
        <div className="mt-3">
          <Card.Title className="mb-0">{event.title}</Card.Title>
          <div>
            <small className="text-muted">{event.location}</small>
          </div>
        </div>
        <div
          className="mt-3"
          style={{
            whiteSpace: 'break-spaces',
          }}
        >
          <p>{event.description}</p>
        </div>
      </Card.Body>
    </Card>
  );
};
export default withRouter(Events);
