const { putItem } = require('nbased/service/storage/dynamo');

const TRANSACTIONS_TABLE = process.env.TRANSACTIONS_TABLE;

async function storeTransaction(transaction) {
  const params = {
    TableName: TRANSACTIONS_TABLE,
    Item: transaction,
    ReturnValues: 'NONE',
  };
  const { Attributes } = await putItem(params);
  return Attributes;
}

module.exports = {
  storeTransaction,
};
