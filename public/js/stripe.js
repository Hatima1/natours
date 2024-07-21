/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  try {
    console.log('test');
    // 1) Get checkout session from API
    const stripe = Stripe(
      'pk_test_51PIJJVLqCtbBZnyuDED5aF6pMSfe5MyFpgyQOEDC2u4A1WMeyf4TEZs4XGVNKy942NTEzFuYmnmbWXn7NyDx9CCP00pHBG98rE'
    );
    const session = await axios(`/api/v2/bookings/checkout-session/${tourId}`);
    // console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
