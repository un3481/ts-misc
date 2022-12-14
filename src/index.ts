/*
##########################################################################################################################
#                                                       TS-MISC                                                          #
##########################################################################################################################
#                                                                                                                        #
#                                           Typescript Miscellaneous Library                                             #
#                                                   Author: Anthony                                                      #
#                             ---------------- ------ -- NodeJS -- ------ ----------------                               #
#                                                * Under Development *                                                   #
#                                          https://github.com/un3481/ts-misc                                             #
#                                                                                                                        #
##########################################################################################################################
*/

// Imports
import * as _logging from './utils/logging.js'
import * as _numbers from './utils/numbers.js'
import * as _string from './utils/string.js'
import * as _handle from './utils/handle.js'
import * as _guards from './utils/guards.js'
import * as _types from './utils/types.js'
import * as _sync from './utils/sync.js'
import * as _sets from './utils/sets.js'

// ##########################################################################################################################

// Exports
export const logging = _logging
export const numbers = _numbers
export const string = _string
export const handle = _handle
export const guards = _guards
export const types = _types
export const sync = _sync
export const sets = _sets

// Super-Guard
export const is = guards.is

// Miscellaneous Class
export default {
  logging: logging,
  numbers: numbers,
  string: string,
  handle: handle,
  guards: guards,
  types: types,
  sync: sync,
  sets: sets,
  is: is
}

// ##########################################################################################################################

