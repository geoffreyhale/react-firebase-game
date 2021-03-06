import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';
import { addOneYearPremium, createAccounting } from '../../../api';
import { AppContext } from '../../AppProvider';

const defaultAmountUsd = 30;

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
        <div>Purchasing: ${defaultAmountUsd} for 1 Year Premium</div>
        <PayPalButton
          createOrder={(data, actions) => this.createOrder(data, actions)}
          onApprove={(data, actions) => this.onApprove(data, actions)}
        />
      </>
    );
  }
}

export default withRouter(PayPal);
