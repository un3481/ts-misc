/*
##########################################################################################################################
#                                                       ACESSORIES                                                       #
##########################################################################################################################
*/
// Imports
import * as numbers from './utils/numbers.js';
import * as string from './utils/string.js';
import * as handle from './utils/handle.js';
import * as guards from './utils/guards.js';
import * as types from './utils/types.js';
import * as sync from './utils/sync.js';
import * as sets from './utils/sets.js';
/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/
// Miscellaneous Class
export default class Miscellaneous {
  constructor() {
    // Miscellaneous Set
    this.numbers = numbers;
    this.string = string;
    this.handle = handle;
    this.guards = guards;
    this.types = types;
    this.sync = sync;
    this.sets = sets;
  }
  // Allow Info Inside Misc
  get misc() {
    return this;
  }
}
/*
##########################################################################################################################
#                                                         END                                                            #
##########################################################################################################################
*/
