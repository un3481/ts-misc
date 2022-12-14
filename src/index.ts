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
import * as Numbers from './utils/numbers.js'
import * as Strings from './utils/string.js'
import * as Handles from './utils/handle.js'
import * as Guards from './utils/guards.js'
import * as Types from './utils/types.js'
import * as Sync from './utils/sync.js'
import * as Sets from './utils/sets.js'
import * as Logs from './utils/logging.js'

// ##########################################################################################################################

// Exports

export const numbers = Numbers
export const strings = Strings
export const handles = Handles
export const guards = Guards
export const types = Types
export const sync = Sync
export const sets = Sets
export const logs = Logs

// Super-Guard
export const is = Guards.is

// Miscellaneous Class
export default {
  numbers: Numbers,
  strings: Strings,
  handles: Handles,
  guards: Guards,
  types: Types,
  sync: Sync,
  sets: Sets,
  logs: Logs,
  is: Guards.is
}

// ##########################################################################################################################

