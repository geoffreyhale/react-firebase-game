import React, { useContext, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { AppContext } from './AppProvider';
import { getMostRecentModalityPostTimestampForUser } from '../api';
import friendlyTimestamp from './shared/friendlyTimestamp';

//TODO tests for all this

const ITEMS = {
  getPremium: {
    linkTo: '/r/general',
    title: 'Get Premium',
    description: () => (
      <span>
        Ask how to sign up for premium for just $1/mo in{' '}
        <Link to="/r/general">r/general</Link>.
      </span>
    ),
  },
  mostRecentModalityPostTimestamp: {
    linkTo: '/training',
    title: 'Train Modalities',
    description: (timestamp) =>
      timestamp ? (
        <span>
          Checkout the <Link to="/training">training page</Link> and submit
          another modality post. Your last modality post was{' '}
          <strong>{friendlyTimestamp(timestamp, ' ago')}</strong>.
        </span>
      ) : (
        <span>
          Checkout the <Link to="/training">training page</Link> and submit a
          modality post.
        </span>
      ),
  },
};

const SmartGuidePanel = ({ items }) => {
  const [activeKey, setActiveKey] = useState('0');
  const toggleActiveKey = (key) =>
    activeKey === key ? setActiveKey(null) : setActiveKey(key);

  return (
    <Accordion /*defaultActiveKey="0"*/ activeKey={activeKey} className="mt-3">
      <Card>
        <Accordion.Toggle
          as={Card.Header}
          /*eventKey="0"*/ onClick={() => toggleActiveKey('0')}
        >
          <strong>
            Wizard{' '}
            <Badge variant="secondary">{Object.keys(items).length}</Badge>
          </strong>
          <small className={'ml-3'}>
            {activeKey === '0'
              ? 'Click to collapse'
              : 'Click to expand recommended actions'}
          </small>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            {items && typeof items === 'object' ? (
              Object.keys(items).length > 0 ? (
                <ListGroup>
                  {Object.entries(items).map(([key, value], i) => {
                    const description = ITEMS[key].description(value);
                    const title = ITEMS[key].title;
                    const linkTo = ITEMS[key].linkTo;
                    return (
                      <ListGroup.Item
                        as={Link}
                        to={linkTo}
                        action
                        style={{ paddingBottom: 0 }}
                      >
                        <div className="float-left mr-4 mb-3">{i + 1}</div>
                        <div
                          className="float-left mr-4 mb-3"
                          style={{ whiteSpace: 'nowrap' }}
                        >
                          <strong>{title}</strong>
                        </div>
                        <div className="float-left mb-3">{description}</div>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
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
        // TODO if certain time duration has passed (6 hours?)
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
