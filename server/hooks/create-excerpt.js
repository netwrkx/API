/* eslint-disable */
// https://github.com/yangsibai/node-html-excerpt
// const excerpt = require('html-excerpt');

const sanitizeHtml = require('sanitize-html');
const trunc = require('trunc-html');
const { getByDot, setByDot } = require('feathers-hooks-common');
const { isEmpty } = require('lodash');

const sanitizeOptions = {
  allowedTags: ['p', 'br', 'a', 'span', 'blockquote'],
  allowedAttributes: {
    a: ['href', 'class', 'target', 'data-*' , 'contenteditable'],
    span: ['contenteditable', 'class', 'data-*']
  }
};

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {

    options = Object.assign({ length: 120, field: 'content' }, options);

    let content = getByDot(hook.data, options.field);

    if(!hook.data || isEmpty(content)) {
      return hook;
    }

    try {
      /* eslint no-use-before-define: 0 */  // --> OFF
      let contentSanitized = sanitizeHtml(content, sanitizeOptions)
      .replace(/\<br\s*\>|\<br\s*\/\>/ig, "\n")
      .replace(/(\ ){2,}/ig, ' ')
      .trim();

      // we do need to compare the strings to decide if we really need to trim
      const contentBefore = trunc(content, 9999999999);
      const contentTruncated = trunc(contentSanitized, options.length);

      // save meta key hasMore to indicate if there is more text then in the excerpt
      const hasMore = contentBefore.text.length > (contentTruncated.text.length + 20);
      setByDot(hook.data, 'hasMore', hasMore);

      // set excerpt
      setByDot(hook.data, `${options.field}Excerpt`, hasMore ? contentTruncated.html : content.replace(/(\ ){2,}/ig, ' '))
    } catch (err) {
      // hook.app.error(err);
      // throw new Error(err);
    }
    // trim content
    setByDot(hook.data, options.field, content.replace(/(\ ){2,}/ig, ' '));

    return hook;
  };
};
