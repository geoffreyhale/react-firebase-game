import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';
import { addOneYearPremium, createAccounting } from '../../../api';
import { AppContext } from '../../AppProvider';

const amountValue = '30.00';

const handleOnApprove = ({ data, uid }, callback) => {
  const { orderID, payerID } = data;

  createAccounting({
    notes: 'onsite paypal',
    type: 'premium',
    uid,
    usd: parseInt(amountValue),
    via: 'paypal',
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
            value: amountValue,
          },
        },
      ],
    });
  }

  onApprove(data, actions) {
    handleOnApprove({ data, uid: this.user().uid }, () => {
      this.props.history.go(0);
    });
    return actions.order.capture();
  }

  render() {
    return (
      <PayPalButton
        createOrder={(data, actions) => this.createOrder(data, actions)}
        onApprove={(data, actions) => this.onApprove(data, actions)}
      />
    );
  }
}

export default withRouter(PayPal);
