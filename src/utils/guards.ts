/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

import type {
  As,
  Is,
  And,
  Types,
  PrimaryTypes,
  UnusualTypes,
  TypeGuardShape,
  TypeGuard,
  Callable,
  Constructor,
  Guards,
  Extra,
  Has,
  KeyOf,
  ArgOf,
  TypeOf,
  Type,
  IsType
} from './types.js'

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

// General Make Type-Guard
export function extend<T, O = unknown>(
  obj: unknown
): obj is As<T extends Extra ? (O extends Extra ? And<O & T> : O & T) : O & T> {
  return true
}

// General Set Type-Guard
export function guard<T>(tg: TypeGuardShape): TypeGuard<T> {
  if (extend<TypeGuard<T>>(tg)) return tg
}

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

// Get Type-Of Object using 'ToString' Method
export function typeOf(obj: unknown): string {
  return Object.toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase()
}

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

// Check Primary Types
const makeIs = <N extends Types>(
  typeName: N,
  constructor: Callable = null
): TypeGuard<Type<N>, []> => {
  // Set Guard
  const tg = obj =>
    // eslint-disable-next-line valid-typeof
    typeof obj === typeName ||
    (constructor ? obj instanceof constructor : obj === undefined)
  // Return As
  return tg as TypeGuard<Type<N>, []>
}

// Primary Type-Guard Proxy
export const primaryGuards: Guards<PrimaryTypes> = {
  undefined: makeIs('undefined'),
  string: makeIs('string', String),
  number: makeIs('number', Number),
  bigint: makeIs('bigint', BigInt),
  symbol: makeIs('symbol', Symbol),
  object: makeIs('object', Object),
  boolean: makeIs('boolean', Boolean),
  function: makeIs('function', Function)
}

// Unusual Type-Guard Record
export const unusualGuards: Guards<UnusualTypes> = {
  never: (obj => false && obj) as TypeGuard<never>,
  any: (obj => true || obj) as TypeGuard<unknown>,
  true: (obj => obj === true) as TypeGuard<true>,
  false: (obj => obj === false) as TypeGuard<false>,
  unknown: (obj => true || obj) as TypeGuard<unknown>,
  date: (obj => obj instanceof Date) as TypeGuard<Date>,
  array: (obj => Array.isArray(obj)) as TypeGuard<unknown[]>,
  regexp: (obj => obj instanceof RegExp) as TypeGuard<RegExp>,
  null: (obj => obj === null || obj === undefined) as TypeGuard<null>,
  promise: (obj => obj instanceof Promise) as TypeGuard<Promise<unknown>>,
  typeof: (obj =>
    primaryGuards.string(obj) &&
    (obj in primaryGuards || obj in unusualGuards)) as TypeGuard<Types>,
  keyof: (obj =>
    ['string', 'number', 'symbol'].includes(typeOf(obj))) as TypeGuard<KeyOf>,
  class: (obj => {
    if (!primaryGuards.function(obj)) return false
    try {
      Reflect.construct(String, [], obj)
    } catch (e) {
      return false
    }
    return true
  }) as TypeGuard<Constructor>
}

// General Type-Guard Proxy
const guards: Guards = {
  ...primaryGuards,
  ...unusualGuards
}

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

// Define General Guard
const isType = ((obj, typeName) => {
  // Set Check Function
  const checkType = t => guards[t](obj)
  // Return Check
  if (!guards.array(typeName)) return checkType(typeName)
  else return typeName.some(checkType)
}) as IsType

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

// Property Type-Guard
export function has<
  O = unknown,
  K extends KeyOf = KeyOf,
  T extends Types = Types
>(obj: unknown, key: K | K[], typeName?: T | T[]): obj is Has<K, Type<T>, O> {
  // Set Check Function
  const checkType = <K extends KeyOf>(
    o: unknown,
    k: K
  ): o is Has<K, TypeOf<T>, O> => {
    return typeName ? isType(o[k], typeName) : true
  }

  // Perform Key Check
  const checkKey = (o: unknown, k: KeyOf): o is Has<K, TypeOf<T>, O> => {
    if (!guards.object(o)) return false
    if (k in o) return checkType(o, k)
    if (Object.prototype.hasOwnProperty.call(o, k)) return checkType(o, k)
    if (guards.string(k) && Object.keys(o).includes(k)) {
      return checkType(o, k)
    } else return false
  }

  // Return Check
  if (!guards.array(key)) return checkKey(obj, key)
  else return key.every(k => checkKey(obj, k))
}

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

// General Sets Type-Guard
export function are<K extends KeyOf, T extends Types>(
  obj: Extra<K>,
  typeName: T | T[]
): obj is Extra<K, TypeOf<T>> {
  // Check All
  return Object.values(obj).every(v => isType(v, typeName))
}

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

// Assign Methods to General Guard
Object.defineProperties(
  isType,
  Object.getOwnPropertyDescriptors({
    ...guards,
    in: has,
    every: are
  })
)

// General Type-Guard
export const is = isType as Is

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

// Function Return Type-Guard
export function isReturn<R extends Types>(
  typeName: R
): <A extends ArgOf>(
  obj: Callable<A>,
  ...args: A
) => obj is Callable<A, TypeOf<R>> {
  // Set Type-Guard
  const typeGuard = <A extends ArgOf>(
    obj: Callable<A>,
    ...args: A
  ): obj is Callable<A, TypeOf<R>> => is(obj(...args), typeName)

  // Return Type-Guard
  return typeGuard
}

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/
