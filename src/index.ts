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
import * as numbers from './modules/numbers'
import * as strings from './modules/strings'
import * as handles from './modules/handles'
import * as guards  from './modules/guards'
import * as types   from './modules/types'
import * as sets    from './modules/sets'

const is = guards.is

// ##########################################################################################################################

// Default Export
export default {
  numbers: numbers,
  strings: strings,
  handles: handles,
  guards:  guards,
  types:   types,
  sets:    sets,
  is:      is
}

// Exports
export {
  numbers,
  strings,
  handles,
  guards,
  types,
  sets,
  is
}

// ##########################################################################################################################
