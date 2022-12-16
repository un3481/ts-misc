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

// ##########################################################################################################################

// Exports
export const numbers = Numbers
export const strings = Strings
export const handles = Handles
export const guards  = Guards
export const types   = Types
export const sets    = Sets
export const is      = Guards.is

// Default Exports
export default {
  numbers: Numbers,
  strings: Strings,
  handles: Handles,
  guards:  Guards,
  types:   Types,
  sets:    Sets,
  is:      Guards.is
}

// ##########################################################################################################################

