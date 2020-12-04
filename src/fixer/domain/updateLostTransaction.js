const { getPayment } = require('../service/paymentsRepository');
const { updateLostTransaction } = require('../service/lostTransactionsRepository');

async function updateLostTransactionDomain(commandPayload, commandMeta) {

  const eTransUuid = '7436e9da0b29430a9e1a5abe03e4b7e6';
  const paymentId = 'ff22db6b-c741-4963-8be4-67ab70ace566';

  // get payment
  const payment = await getPayment(paymentId);

  // update lostTransactions (detailed_status=FIXEDBYCT)
  let updatedLostTransaction;
  try {
    updatedLostTransaction = await updateLostTransaction({
      uuid: eTransUuid,
      detailed_status: 'CAPTURED',
      ranty_payment: {
        id: payment.payment_id,
        status: 'PROCCESSED',
        creation_date: payment.date_created,
      },
    });
  } catch (err) {
    console.log(err);
    throw new Error('LostTransaction update failed');
  }

  return {
    body: {
      eTransUuid,
      updatedLostTransaction,
    },
  };
}

module.exports = { updateLostTransactionDomain };
