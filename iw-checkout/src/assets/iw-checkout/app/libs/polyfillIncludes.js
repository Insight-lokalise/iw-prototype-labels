/**
 * Rather than using the very large babel-polyfill or some other comprehensive
 * polyfill library, we're explicitly importing features we need. If you find we're
 * missing a polyfill, take a look over at core-js's github and add the specific
 * import here.
 *
 * https://github.com/zloirock/core-js
 */

import 'core-js/fn/array/fill'
import 'core-js/fn/array/find'
import 'core-js/fn/array/from'
import 'core-js/fn/array/includes'
import 'core-js/fn/array/some'
import 'core-js/fn/array/find-index'
import 'core-js/fn/object/assign'
import 'core-js/fn/promise'
import 'core-js/fn/set'
import 'core-js/fn/string/starts-with'
import 'core-js/fn/string/ends-with'
import 'core-js/fn/string/includes'
import 'core-js/fn/object/entries'
import 'core-js/fn/object/values'