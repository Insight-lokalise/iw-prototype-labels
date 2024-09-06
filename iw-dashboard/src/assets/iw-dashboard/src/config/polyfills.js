/*
 * https://github.com/zloirock/core-js
 */
// find isn't used in our codebase but it is used in recharts. For this reason we need this polyfill for ie11
import 'core-js/fn/array/find'
import 'core-js/fn/array/includes'
import 'core-js/fn/object/entries'
import 'core-js/fn/object/values'
