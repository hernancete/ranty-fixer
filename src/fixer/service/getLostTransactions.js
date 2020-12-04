const downstreamRequest = require('nbased/service/downstream/request');

const LOST_TRANSACTIONS_URL = 'https://checkout.apinaranja.com/external_transactions/lost_transactions?date_created=:created_date&detailed_status=CAPTURED';
const LOST_TRANSACTIONS_METHOD = 'GET';
const LOST_TRANSACTIONS_TIMEOUT = 3000;

const getLostTransactionsService = async (createdDate) => {
  const requestParams = {
    url: LOST_TRANSACTIONS_URL.replace(':created_date', createdDate),
    method: LOST_TRANSACTIONS_METHOD,
    timeout: LOST_TRANSACTIONS_TIMEOUT,
  };

  const response = await downstreamRequest(requestParams).catch((error) => {
    throw error;
  });

  return response;
};

module.exports = { getLostTransactionsService };
