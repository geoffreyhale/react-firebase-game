import React from 'react';
import './StripeElements.css';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { ElementsConsumer, CardElement } from '@stripe/react-stripe-js';

const STRIPE_PUBLISHABLE_KEY = 'pk_test_MG5haRtUx8gvSQDL5msBa7Eg00uiWArCRO';

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const CARD_ELEMENT_OPTIONS = {
  iconStyle: 'solid',
  hidePostalCode: true,
  style: {
    base: {
      iconColor: 'rgb(240, 57, 122)',
      color: 'rgb(240, 57, 122)',
      fontSize: '16px',
      fontFamily: '"Open Sans", sans-serif',
      fontSmoothing: 'antialiased',
      '::placeholder': {
        color: '#CFD7DF',
      },
    },
    invalid: {
      color: '#e5424d',
      ':focus': {
        color: '#303238',
      },
    },
  },
};

function CardSection() {
  return <CardElement options={CARD_ELEMENT_OPTIONS} />;
}

class CheckoutForm extends React.Component {
  handleSubmit = async (event) => {
    event.preventDefault();

    const { stripe, elements } = this.props;
    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    const result = await stripe.createToken(card);
    if (result.error) {
      console.log(result.error.message);
    } else {
      console.log(result.token);
      // TODO save the card info for future
      // pass the token to your backend API
      // TODO Backend for Stripe https://www.pluralsight.com/guides/how-to-integrate-stripe-with-react
    }
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <CardSection />
        <button className="btn-pay">Buy Now</button>
      </form>
    );
  }
}

function InjectedCheckoutForm() {
  return (
    <ElementsConsumer>
      {({ stripe, elements }) => (
        <CheckoutForm stripe={stripe} elements={elements} />
      )}
    </ElementsConsumer>
  );
}

function StripeElements() {
  return (
    <Elements stripe={stripePromise}>
      <InjectedCheckoutForm />
    </Elements>
  );
}

export default StripeElements;
