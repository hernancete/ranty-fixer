const uuid = require('uuid');

module.exports.buildTransactions = (paymentRequest, externalTransaction, paymentId) => {
  return paymentRequest.transactions.map(transaction => ({
    ...transaction,
    auth_data: {
      auth_id: externalTransaction.uuid,
      code: externalTransaction.authorization.code,
      reason: 'The amount of the transaction has been captured.',
      status: 'APPROVED',
    },
    ranty_id: uuid.v4(),
    payment_id: paymentId,
    stage: 'PROCESSED',
  }));
}
