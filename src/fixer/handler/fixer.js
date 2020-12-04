const { commandMapper } = require('nbased/handler');
const inputMode = require('nbased/handler/input/commandInvoke');
const outputMode = require('nbased/handler/output/commandInvoke');

const { fixerDomain } = require('../domain/fixer');

module.exports.handler = async (command, context) => {
  return commandMapper({ command, context }, inputMode, fixerDomain, outputMode);
};

