/*
##########################################################################################################################
#                                                       ACESSORIES                                                       #
##########################################################################################################################
*/

// Imports
import * as numbers from './numbers.js'
import * as handle from './handle.js'
import * as guards from './guards.js'
import * as types from './types.js'
import * as sync from './sync.js'
import * as sets from './sets.js'

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

// Miscellaneous Class
export default class Miscellaneous {
  // Miscellaneous Set
  numbers = numbers
  handle = handle
  guards = guards
  types = types
  sync = sync
  sets = sets

  // Allow Info Inside Misc
  get misc(): Miscellaneous {
    return this
  }
}

/*
##########################################################################################################################
#                                                         END                                                            #
##########################################################################################################################
*/
