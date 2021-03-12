import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { addPremium, createAccounting } from '../../../api';
import { AppContext } from '../../AppProvider';

const handleOnApprove = (
  { uid, currencyCode, amount, createdAt, paypalTransactionId, months },
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
      addPremium({ uid, months }, callback);
    }
  );
};

const payPalCssMaxWidth = 750;

const itemOneMonthPremium = {
  title: 'Month',
  description: '+1 Month Premium',
  usd: 5,
  months: 1,
};
const itemOneYearPremium = {
  title: 'Year',
  description: '+1 Year Premium',
  discount: '50%',
  usd: 30,
  months: 12,
};
const itemOneHundredYearsPremium = {
  title: 'Lifetime',
  description: '+100 Years Premium',
  discount: '83%',
  usd: 1000,
  months: 1200,
};

const itemsForSale = [
  itemOneMonthPremium,
  itemOneYearPremium,
  itemOneHundredYearsPremium,
];

const ItemsForSale = ({ addItem }) => (
  <div className="mb-3" style={{ maxWidth: payPalCssMaxWidth }}>
    {itemsForSale.map((item) => (
      <Card
        className="mr-2 mb-2"
        style={{
          width: payPalCssMaxWidth / 3 - 8,
          display: 'inline-block',
          verticalAlign: 'top',
        }}
      >
        <Card.Body>
          <Card.Title>{item.title}</Card.Title>
          <p>{item.description}</p>
          <p>
            <strong>${item.usd}</strong>
            {item.discount && ` (${item.discount} Off)`}
          </p>
          <Button className="mr-3 mb-3" onClick={() => addItem(item)}>
            Add to Cart
          </Button>
        </Card.Body>
      </Card>
    ))}
  </div>
);

const totalAmountUsd = (items) =>
  Object.values(items).reduce((total, item) => total + item.usd, 0);
const totalMonths = (items) =>
  Object.values(items).reduce((total, item) => total + item.months, 0);

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
          months: totalMonths(this.state.items),
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
