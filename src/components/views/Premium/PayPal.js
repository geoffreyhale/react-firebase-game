import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import { addOneYearPremium, createAccounting } from '../../../api';
import { AppContext } from '../../AppProvider';

const payPalCssMaxWidth = 750;

const defaultAmountUsd = 30;

const ShoppingCart = () => (
  <div className="mb-3" style={{ maxWidth: payPalCssMaxWidth }}>
    <Card border="primary">
      <Card.Body>
        <FontAwesomeIcon icon={faShoppingCart} className="mr-3" />+ 1 Year
        Premium
        <span className="float-right">${defaultAmountUsd}</span>
      </Card.Body>
    </Card>
    <Card border="light">
      <Card.Body>
        <strong className="float-right">Total: ${defaultAmountUsd}</strong>
      </Card.Body>
    </Card>
  </div>
);

const handleOnApprove = ({ data, uid, amountUsd }, callback) => {
  const { orderID, payerID } = data;

  //TODO usd does not include paypal fees
  createAccounting({
    notes: '12 months premium (usd does not include paypal fees)',
    type: 'premium',
    uid,
    usd: parseInt(amountUsd),
    via: 'paypal (onsite)',
    orderID,
    payerID,
  });

  addOneYearPremium({ uid }, callback);
};

const PayPalButton = window.paypal_sdk.Buttons.driver('react', {
  React,
  ReactDOM,
});

class PayPal extends React.Component {
  constructor() {
    super();
  }

  static contextType = AppContext;
  user = () => this.context.user;

  createOrder(data, actions) {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: defaultAmountUsd,
          },
        },
      ],
    });
  }

  onApprove(data, actions) {
    handleOnApprove(
      { amountUsd: defaultAmountUsd, data, uid: this.user().uid },
      () => {
        this.props.history.go(0);
      }
    );
    return actions.order.capture();
  }

  // TODO clarify that purchase will add 1 year to existing expiry if exists
  render() {
    return (
      <>
        <ShoppingCart />
        <PayPalButton
          createOrder={(data, actions) => this.createOrder(data, actions)}
          onApprove={(data, actions) => this.onApprove(data, actions)}
        />
      </>
    );
  }
}

export default withRouter(PayPal);
