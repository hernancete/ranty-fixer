const { getLostTransactionsService } = require('../service/getLostTransactions');
const { getExternalTransactionService } = require('../service/getExternalTransactions');
const { getPaymentRequest, updatePaymentRequest } = require('../service/paymentsRequestRepository');
const { storePayment } = require('../service/paymentsRepository');
const { storeTransaction } = require('../service/transactionsRepository');
const { updateLostTransaction } = require('../service/lostTransactionsRepository');

const { buildPayment } = require('../helper/buildPayment');
const { buildTransactions } = require('../helper/buildTransactions');

const PROCESS_DATE = process.env.PROCESS_DATE;
const TOKEN = process.env.B2B_TOKEN;

async function fixerDomain(commandPayload, commandMeta) {

  // get lost transactions
  // const lostTransactions = await getLostTransactionsService(PROCESS_DATE);
  // const lostTransaction = lostTransactions.transactions.find(lt => {
  //   return (
  //     !(lt.ranty_payment && lt.ranty_payment.status)
  //     && lt.uuid != 'bef4d5676bfc46f9a07d394963bc5ffd'
  //   );
  // });
  // if (!lostTransaction) {
  //   console.log(`No more CAPTURED External Transactions for date: ${PROCESS_DATE}`);
  //   throw new Error(`No more CAPTURED External Transactions for date: ${PROCESS_DATE}`);
  // }
  // const eTransUuid = lostTransaction.uuid;
  // // return {body:{ lostTransactions, eTransUuid }};
  const eTransUuid = '83ebeb77ec13468d9426874b2f52096f';

  // get paymentRequestId and externalTransaction from SONQO
  const { paymentRequestId, externalTransaction } = await getExternalTransactionService(eTransUuid, TOKEN);
  if (externalTransaction.detailed_status !== 'CAPTURED') {
    console.log(`External Transactions isn't in CAPTURED status: ${externalTransaction.detailed_status}`);
    throw new Error(`External Transactions isn't in CAPTURED status`);
  }

  // get paymentRequest
  const paymentRequest = await getPaymentRequest(paymentRequestId);

  // build new payment and transactions
  const newPayment = buildPayment(paymentRequest, externalTransaction);
  const newTransactions = buildTransactions(paymentRequest, externalTransaction, newPayment.payment_id);

  try {
    // create new payment
    await storePayment(newPayment);
  } catch (err) {
    console.log(err);
    throw new Error('Payment creation failed');
  }

  try {
    // create new transactions
    await Promise.all(newTransactions.map(async transaction => storeTransaction(transaction)));
  } catch (err) {
    console.log(err);
    throw new Error('Transactions creation failed');
  }

  // update paymentRequest (status=SUCCESS_PROCESSED and stage=?)
  let updatedPaymentRequest;
  try {
    updatedPaymentRequest = await updatePaymentRequest({
      id: paymentRequest.id,
      status: 'SUCCESS_PROCESSED',
    });
  } catch (err) {
    console.log(err);
    throw new Error('PaymentRequest update failed');
  }

  // update lostTransactions (detailed_status=FIXEDBYCT)
  let updatedLostTransaction;
  try {
    updatedLostTransaction = await updateLostTransaction({
      uuid: eTransUuid,
      // detailed_status: 'FIXEDBYCT',
      ranty_payment: {
        id: newPayment.payment_id,
        status: 'PROCCESSED',
        creation_date: newPayment.date_created,
      },
    });
  } catch (err) {
    console.log(err);
    throw new Error('LostTransaction update failed');
  }

  return {
    body: {
      externalTransaction,
      paymentRequest,
      newPayment,
      newTransactions,
      updatedPaymentRequest,
      updatedLostTransaction,
      paymentRequestId: paymentRequest.id,
      newPaymentId: newPayment.payment_id,
      pan: externalTransaction.customer_details.pan,
      externalPaymentId: paymentRequest.external_payment_id,
      eTransUuid,
      toSheet: `=SPLIT("${paymentRequest.id},${newPayment.payment_id},${externalTransaction.customer_details.pan},${paymentRequest.external_payment_id}"; ",")`,
    },
  };
}

module.exports = { fixerDomain };
