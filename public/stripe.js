const stripe = Stripe("pk_test_51NcKmrHo2PrPc0FfRBn6u8rFHNC3yLXvHJRi3p2XTeggqIRnP9pW9cWdr9QrPKwQVrlyt1mVN6d8FrDM5Vkw6G5O00sfBD2n7K");

$('#submitCard').on('click', function() {
  // const cardNumber = $('#cardNumber').val();
  // const expMonth = $('#expMonth').val();
  // const expYear = $('#expYear').val();
  // const cvc = $('#cvc').val();

  const card = {
    number: '4242424242424242',
    exp_month: 2,
    exp_year: 2029,
    cvc: '768'
  };

  $.ajax({
    url: 'http://localhost:4242/create-checkout-session',
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: {}
  })
  .done(function(session) {
    return stripe.redirectToCheckout({ sessionId: session.id });
  })
  .fail(function(error) {
    console.log(error);
  });
})