// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const logger = require('winston');
const ElasticsearchWrapper = require('../services/search/elasticsearch.wrapper');


module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {

    let es = new ElasticsearchWrapper();
    es.setApp(hook.app);
    if (es.isEnabled()) {
      logger.debug('on contribution added:');

      try {
        let data = hook.result;

        logger.debug('hook.data:' + JSON.stringify(data));

        es.add(data);

      } catch (error) {
        logger.error('Error:' + error);
      }
    }

    return Promise.resolve(hook);
  };
};