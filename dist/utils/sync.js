/*
##########################################################################################################################
#                                                       ACESSORIES                                                       #
##########################################################################################################################
*/
// Imports
import {
  pass
} from './utils.js';
import {
  is
} from './guards.js';
/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/
// Get Date
export function timestamp() {
  return new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Fortaleza'
  });
}
// Wait Seconds
export function wait(mili) {
  return new Promise(resolve => setTimeout(v => {
    resolve(v);
  }, mili));
}
// Wait for Promise
const sync = promise => {
  // Set Variables
  let resolution;
  let done;
  // Execute Async Function
  promise
    .then(val => {
      resolution = val;
      done = true;
    })
    .catch(err => {
      done = true;
      pass(err);
    });
  // While not Done: Pass
  while (is(done, 'null'))
    pass(null);
  // Return Value and Error
  return resolution;
};
// Wait Seconds Sync
export function waitSync(mili) {
  // Wait Each Option
  if (is(mili, 'number'))
    return sync(wait(mili));
  if (is(mili, 'promise'))
    return sync(mili);
  if (is(mili, 'function'))
    return sync(mili());
}
/*
##########################################################################################################################
#                                                         END                                                            #
##########################################################################################################################
*/
