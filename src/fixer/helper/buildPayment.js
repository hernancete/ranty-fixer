const uuid = require('uuid');

module.exports.buildPayment = (paymentRequest, externalTransaction) => {
  paymentRequest.status = 'SUCCESS_PROCESSED';
  return {
    "authorization_mode": "sale",
    "date_created": paymentRequest.creation_date,
    "external_payment_id": paymentRequest.external_payment_id,
    "external_transaction": externalTransaction,
    "payment_gateway": "payzen",
    "payment_id": uuid.v4(),
    "payment_method": {
      "card_holder_name": externalTransaction.customer_details.card_holder_name || "null",
      "card_type": externalTransaction.operation,
      "expiration_month": externalTransaction.customer_details.expiration_month,
      "expiration_year": externalTransaction.customer_details.expiration_year,
      "name": externalTransaction.customer_details.name,
      "pan": "************" + externalTransaction.customer_details.pan.slice(-4),
      "product_id": externalTransaction.customer_details.product_id,
      "type": "card_payment"
    },
    "payment_request": paymentRequest,
    "shop_id": paymentRequest.shop_id,
    "stage": "PROCESSED",
    "status": "APPROVED"
  };
}
