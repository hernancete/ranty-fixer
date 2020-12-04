const { getItem, putItem } = require('nbased/service/storage/dynamo');

const PAYMENTS_TABLE = process.env.PAYMENTS_TABLE || 'todosTable';

async function getPayment(paymentId) {
  const { Item } = await getItem({
    TableName: PAYMENTS_TABLE,
    Key: { payment_id: paymentId },
  });
  if (!Item) throw new ErrorHandled('Payment not found', { status: 404, code: 'NOT_FOUND' });
  return Item;
}

async function storePayment(payment) {
  const params = {
    TableName: PAYMENTS_TABLE,
    Item: payment,
    ReturnValues: 'NONE',
  };
  const { Attributes } = await putItem(params);
  return Attributes;
}

module.exports = {
  getPayment,
  storePayment,
};
