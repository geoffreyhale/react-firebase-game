import React, { useContext, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { AppContext } from './AppProvider';
import { getMostRecentModalityPostTimestampForUser } from '../api';
import friendlyTimestamp from './shared/friendlyTimestamp';

//TODO tests for all this

const ITEMS = {
  getPremium: () => (
    <span>
      Ask in <Link to="r/general">r/general</Link> how to{' '}
      <strong>sign up for premium</strong> to gain access to r/healthyrelating
      and other important xBook features.
    </span>
  ),
  mostRecentModalityPostTimestamp: (timestamp) =>
    // TODO if certain time duration has passed (an hour?)
    timestamp ? (
      <span>
        Your last modality post was{' '}
        <strong>{friendlyTimestamp(timestamp, ' ago')}</strong>. Why don't you
        head over to <Link to="r/healthyrelating">r/healthyrelating</Link> and
        write another?
      </span>
    ) : (
      <span>
        You've never written modality post!? You should head over to{' '}
        <Link to="r/healthyrelating">r/healthyrelating</Link> and give it a try!
      </span>
    ),
};

const SmartGuidePanel = ({ items }) => {
  const [activeKey, setActiveKey] = useState('0');
  const toggleActiveKey = (key) =>
    activeKey === key ? setActiveKey(null) : setActiveKey(key);

  return (
    <Accordion /*defaultActiveKey="0"*/ activeKey={activeKey} className="mt-3">
      <Card bg="light">
        <Accordion.Toggle
          as={Card.Header}
          /*eventKey="0"*/ onClick={() => toggleActiveKey('0')}
        >
          <strong>What's Next?</strong>{' '}
          <span className={'pull-right'}>
            {activeKey === '0' ? 'Click to collapse' : 'Click to expand'}
          </span>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <Card.Title>Next step:</Card.Title>
            {items && typeof items === 'object' ? (
              Object.keys(items).length > 0 ? (
                <ul>
                  {Object.entries(items).map(([key, value]) => (
                    <li>
                      {ITEMS[key] &&
                        typeof ITEMS[key] === 'function' &&
                        ITEMS[key](value)}
                    </li>
                  ))}
                </ul>
              ) : (
                //TODO should never need this
                "You're all caught up!  Do anything you like..."
              )
            ) : (
              'Loading...'
            )}
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
};

class SmartGuide extends React.Component {
  constructor() {
    super();
    this.state = { items: {} };
  }

  static contextType = AppContext;
  user = () => this.context.user;

  componentDidMount() {
    getMostRecentModalityPostTimestampForUser(
      { uid: this.user().uid },
      (modalityPostTimestamp) => {
        const items = this.state.items;
        items.mostRecentModalityPostTimestamp = modalityPostTimestamp;
        this.setState({ items });
      }
    );

    if (this.user() && !this.user().isPremium) {
      const items = this.state.items;
      items.getPremium = true;
      this.setState({ items });
    }
  }

  render() {
    if (!this.user()) return null;
    const { items } = this.state;
    return <SmartGuidePanel items={items} />;
  }
}

const SmartGuideWrapper = () => {
  const { user } = useContext(AppContext);
  return user ? <SmartGuide /> : null;
};

export default SmartGuideWrapper;
