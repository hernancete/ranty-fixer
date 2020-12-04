const { updateItem } = require('nbased/service/storage/dynamo');

const LOST_TRANSACTIONS_TABLE = process.env.LOST_TRANSACTIONS_TABLE;

async function updateLostTransaction(lostTransaction) {
  const Key = { uuid: lostTransaction.uuid };
  delete lostTransaction.uuid;
  const updateExpressions = [];
  const ExpressionAttributeNames= {};
  const ExpressionAttributeValues= {};

  Object.keys(lostTransaction).forEach(k => {
    updateExpressions.push(`#${k}=:${k}`);
    ExpressionAttributeNames[`#${k}`] = k;
    ExpressionAttributeValues[`:${k}`] = lostTransaction[k];
  });
  if (!updateExpressions.length) {
    throw new Error('Nothing to update');
  }
  const UpdateExpression = 'SET ' + updateExpressions.join(', ');

  const params = {
    TableName: LOST_TRANSACTIONS_TABLE,
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
  updateLostTransaction,
};
