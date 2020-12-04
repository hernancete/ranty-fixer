const { commandMapper } = require('nbased/handler');
const inputMode = require('nbased/handler/input/commandInvoke');
const outputMode = require('nbased/handler/output/commandInvoke');

const { updateLostTransactionDomain } = require('../domain/updateLostTransaction');

module.exports.handler = async (command, context) => {
  return commandMapper({ command, context }, inputMode, updateLostTransactionDomain, outputMode);
};

