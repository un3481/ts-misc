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
import * as Numbers from './modules/numbers'
import * as Strings from './modules/strings'
import * as Handles from './modules/handles'
import * as Guards  from './modules/guards'
import * as Types   from './modules/types'
import * as Sets    from './modules/sets'
import * as Sync    from './modules/sync'

// ##########################################################################################################################

// Exports
export const numbers = Numbers
export const strings = Strings
export const handles = Handles
export const guards  = Guards
export const types   = Types
export const sets    = Sets
export const sync    = Sync
export const is      = Guards.is

// Default Exports
export default {
  numbers: Numbers,
  strings: Strings,
  handles: Handles,
  guards:  Guards,
  types:   Types,
  sets:    Sets,
  sync:    Sync,
  is:      Guards.is
}

// ##########################################################################################################################

