const downstreamRequest = require('nbased/service/downstream/request');

const EXTERNAL_TRANSACTIONS_URL = 'http://external-payments-bff-mservicios.backendnaranja.com/payzen/shops/80786080/transactions/:transaction_id/payment';
const EXTERNAL_TRANSACTIONS_METHOD = 'GET';
const EXTERNAL_TRANSACTIONS_TIMEOUT = 3000;

const getExternalTransactionService = async (transactionId, authorizationToken) => {
  const requestParams = {
    url: EXTERNAL_TRANSACTIONS_URL.replace(':transaction_id', transactionId),
    method: EXTERNAL_TRANSACTIONS_METHOD,
    timeout: EXTERNAL_TRANSACTIONS_TIMEOUT,
    headers: {
      Authorization: `Bearer ${authorizationToken}`,
    },
  };

  const { payment_request_id: paymentRequestId, external_transaction: externalTransaction } =
    await downstreamRequest(requestParams).catch((error) => {
      throw error;
  });

  return { paymentRequestId, externalTransaction };
};

module.exports = { getExternalTransactionService };
