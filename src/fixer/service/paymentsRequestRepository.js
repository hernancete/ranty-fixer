const { getItem, updateItem } = require('nbased/service/storage/dynamo');
const { ErrorHandled } = require('nbased/util/error');

const PAYMENT_REQUESTS_TABLE = process.env.PAYMENT_REQUESTS_TABLE;

async function getPaymentRequest(paymentRequestId) {
  const { Item } = await getItem({
    TableName: PAYMENT_REQUESTS_TABLE,
    Key: { id: paymentRequestId },
  });
  if (!Item) throw new ErrorHandled('PaymentRequest not found', { status: 404, code: 'NOT_FOUND' });
  return Item;
}

async function updatePaymentRequest(paymentRequest) {
  const Key = { id: paymentRequest.id };
  delete paymentRequest.id;
  const updateExpressions = [];
  const ExpressionAttributeNames= {};
  const ExpressionAttributeValues= {};

  Object.keys(paymentRequest).forEach(k => {
    updateExpressions.push(`#${k}=:${k}`);
    ExpressionAttributeNames[`#${k}`] = k;
    ExpressionAttributeValues[`:${k}`] = paymentRequest[k];
  });
  if (!updateExpressions.length) {
    throw new Error('Nothing to update');
  }
  const UpdateExpression = 'SET ' + updateExpressions.join(', ');

  const params = {
    TableName: PAYMENT_REQUESTS_TABLE,
    Key,
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ReturnValues: 'UPDATED_NEW',
  };
  const { Attributes } = await updateItem(params);
  return Attributes;
}

module.exports = {
  getPaymentRequest,
  updatePaymentRequest,
};
