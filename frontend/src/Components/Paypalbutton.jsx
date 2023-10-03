// PayPalButton.js
import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const PayPalButton = () => {
  return (
    <PayPalScriptProvider options={{ 'client-id': 'AdSGmxZfDJvJ3i_0j9U4IYB4vd3p_ood5i3ZNXBi5qMOAFYj4GzTeebNxFxxBRba6c4MXBRB9Ry2M8PU' }}>
      <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  currency_code: 'USD',
                  value: '10.00', // Change this to the desired payment amount
                },
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then(function (details) {
            alert('Transaction completed by ' + details.payer.name.given_name);
            // Add any further actions here, e.g., updating your backend
          });
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
