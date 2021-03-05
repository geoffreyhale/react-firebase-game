import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHatWizard } from '@fortawesome/free-solid-svg-icons';
import React, { useContext } from 'react';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { Link } from 'react-router-dom';
import { AppContext } from './AppProvider';
import { getMostRecentModalityPostTimestampForUser } from '../api';
import friendlyTimestamp from './shared/friendlyTimestamp';
import { HowToGetPremium } from './shared/Premium';
import Spinner from './shared/Spinner';

const HOURS_DELAY_FOR_TRAINING_AGAIN = 3;

//TODO tests for all this

const ITEMS = {
  getPremium: {
    linkTo: '/r/general',
    title: 'Get Premium',
    description: () => <HowToGetPremium />,
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

export const WizardIcon = ({ items, loading }) => (
  <div style={{ position: 'relative' }}>
    <FontAwesomeIcon
      icon={faHatWizard}
      className="fa-fw"
      style={{ verticalAlign: 'middle', fontSize: '35px' }}
    />
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        textAlign: 'center',
      }}
    >
      {loading ? (
        <Spinner size={'sm'} />
      ) : (
        <Badge
          variant="secondary"
          style={{
            backgroundColor: 'rgba(32, 156, 238, 0.95)',
            backgroundOpacity: '50%',
          }}
        >
          {items && typeof items === 'object' && Object.keys(items).length}
        </Badge>
      )}
    </div>
  </div>
);

const WizardItems = ({ items }) => {
  return items && typeof items === 'object' ? (
    Object.keys(items).length > 0 ? (
      <ListGroup>
        {Object.entries(items).map(([key, value], i) => {
          const description = ITEMS[key].description(value);
          const title = ITEMS[key].title;
          const linkTo = ITEMS[key].linkTo;
          return (
            <ListGroup.Item
              key={key + i}
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
  );
};

class Wizard extends React.Component {
  constructor() {
    super();
    this.state = { items: {}, loading: true };
  }

  static contextType = AppContext;
  user = () => this.context.user;

  componentDidMount() {
    if (!this.user()) return;

    getMostRecentModalityPostTimestampForUser(
      { uid: this.user().uid },
      (modalityPostTimestamp) => {
        const millisecondsPerHour = 3.6e6;
        if (
          Date.now() - modalityPostTimestamp >
          HOURS_DELAY_FOR_TRAINING_AGAIN * millisecondsPerHour
        ) {
          const items = this.state.items;
          items.mostRecentModalityPostTimestamp = modalityPostTimestamp;
          this.setState({ items });
        }
        this.setState({ loading: false });
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

    const { items, loading } = this.state;

    if (this.props.icon) {
      return (
        <OverlayTrigger
          trigger="click"
          placement="bottom"
          overlay={
            <Popover>
              <Popover.Title as="h3">Wizard</Popover.Title>
              <Popover.Content>
                <WizardItems items={items} />
              </Popover.Content>
            </Popover>
          }
        >
          <div>
            <WizardIcon items={items} loading={loading} />
          </div>
        </OverlayTrigger>
      );
    }

    if (!this.context.showWizard) return null;

    return <WizardItems items={items} />;
  }
}

export default Wizard;
