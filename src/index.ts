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
import * as Numbers from './modules/numbers.js'
import * as Strings from './modules/strings.js'
import * as Handles from './modules/handles.js'
import * as Guards from './modules/guards.js'
import * as Types from './modules/types.js'
import * as Sets from './modules/sets.js'
import * as Sync from './modules/sync.js'

// ##########################################################################################################################

// Exports
export const numbers = Numbers
export const strings = Strings
export const handles = Handles
export const guards = Guards
export const types = Types
export const sets = Sets
export const sync = Sync

// Super-Guard
export const is = Guards.is

// Miscellaneous Class
export default {
  numbers: Numbers,
  strings: Strings,
  handles: Handles,
  guards: Guards,
  types: Types,
  sets: Sets,
  sync: Sync,
  is: Guards.is
}

// ##########################################################################################################################

