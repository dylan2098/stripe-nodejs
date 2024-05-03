const express = require('express');
const app = express();
// This is your test secret API key.
const SECRET_KEY =
  'sk_test_51NcKmrHo2PrPc0FfjXSmhCjYRTsJbTCznRgRwc0hQtlWAhdzd7NvgJ2shojPL1zZUW9vOgQsOKXsrTDVhlOmLgMg00qboExbTI';
const PUBLIC_KEY =
  'pk_test_51NcKmrHo2PrPc0FfRBn6u8rFHNC3yLXvHJRi3p2XTeggqIRnP9pW9cWdr9QrPKwQVrlyt1mVN6d8FrDM5Vkw6G5O00sfBD2n7K';

const stripe = require('stripe')(SECRET_KEY);

app.use(express.static('public'));
app.use(express.json());

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

app.post('/create-payment-intent', async (req, res) => {
  const { items } = req.body;
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: 'gbp',
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.get('/complete', async (req, res) => {
  const sessionId = req.query.session_id;

  const result = Promise.all(
    [
      stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['payment_intent.payment_method']
      }),
      stripe.checkout.sessions.listLineItems(sessionId)
    ]
  );

  console.log(JSON.stringify(await result));
  
  return res.send('Payment was successful');
});

app.get('/cancel', (req, res) => {
  return res.send('Payment was cancelled');
});

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'T-shirt',
        },
        unit_amount: 200 *  100,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `http://localhost:4242/complete?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: 'http://localhost:4242/cancel',
  });

  res.json({ id: session.id });
});

app.listen(4242, () => console.log('Node server listening on port 4242!'));
