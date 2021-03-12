import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { addOneYearPremium, createAccounting } from '../../../api';
import { AppContext } from '../../AppProvider';

const handleOnApprove = (
  { uid, currencyCode, amount, createdAt, paypalTransactionId },
  callback
) => {
  //TODO amount does not include paypal fees
  createAccounting(
    {
      notes: '12 months premium (usd does not include paypal fees)',
      type: 'premium',
      uid,
      amount,
      currencyCode,
      via: 'paypal (onsite)',
      createdAt,
      paypalTransactionId,
    },
    () => {
      addOneYearPremium({ uid }, callback);
    }
  );
};

const payPalCssMaxWidth = 750;

const itemOneYearPremium = {
  description: '+1 Year Premium',
  usd: 30,
  monthsPremium: 12,
};

const ItemsForSale = ({ addItem }) => (
  <div className="mb-3" style={{ maxWidth: payPalCssMaxWidth }}>
    {/* <Button className="mr-3" onClick={() => addItem(itemOneYearPremium)}>
      +1 Month Premium $5
    </Button> */}
    <Button className="mr-3" onClick={() => addItem(itemOneYearPremium)}>
      +1 Year Premium $30 (50% Off)
    </Button>
  </div>
);

const totalAmountUsd = (items) =>
  Object.values(items).reduce((total, item) => total + item.usd, 0);

const ShoppingCartItem = ({ description, amountUsd }) => (
  <div>
    <FontAwesomeIcon icon={faShoppingCart} className="mr-3" />
    {description}
    <span className="float-right">${amountUsd}</span>
  </div>
);

const ShoppingCart = ({ items }) => {
  return (
    <div className="mb-3" style={{ maxWidth: payPalCssMaxWidth }}>
      <Card border="primary">
        <Card.Body>
          {Object.values(items).map((item) => (
            <ShoppingCartItem
              description={item.description}
              amountUsd={item.usd}
            />
          ))}
        </Card.Body>
      </Card>
      <Card border="light">
        <Card.Body>
          <strong className="float-right">
            Total: ${totalAmountUsd(items)}
          </strong>
        </Card.Body>
      </Card>
    </div>
  );
};

const PayPalButton = window.paypal_sdk.Buttons.driver('react', {
  React,
  ReactDOM,
});

class PayPal extends React.Component {
  constructor() {
    super();
    this.state = {
      items: [],
      totalUsd: null,
    };
  }

  static contextType = AppContext;
  user = () => this.context.user;

  createOrder(data, actions) {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: totalAmountUsd(this.state.items),
          },
        },
      ],
    });
  }

  onApprove(data, actions) {
    const { orderID, payerID } = data;
    actions.order.capture().then((details) => {
      const {
        id,
        create_time,
        amount,
      } = details.purchase_units[0].payments.captures[0];
      handleOnApprove(
        {
          amount: amount.value,
          currencyCode: amount.currency_code.toLowerCase(),
          uid: this.user().uid,
          createdAt: new Date(create_time),
          paypalTransactionId: id,
        },
        () => {
          this.props.history.go(0);
        }
      );
      // return actions.order.capture();
    });
  }

  // TODO clarify that purchase will add 1 year to existing expiry if exists
  render() {
    return (
      <>
        <h6>Add to Cart</h6>
        <ItemsForSale
          addItem={(item) => {
            const newItemsState = this.state.items;
            newItemsState.push(item);
            this.setState({ items: newItemsState });
          }}
        />
        <h6>Cart</h6>
        <ShoppingCart items={this.state.items} />
        <PayPalButton
          createOrder={(data, actions) => this.createOrder(data, actions)}
          onApprove={(data, actions) => this.onApprove(data, actions)}
        />
      </>
    );
  }
}

export default withRouter(PayPal);
