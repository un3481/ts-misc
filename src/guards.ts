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
  AnySet,
  Extra,
  Has,
  KeyOf,
  ArgOf,
  TypeOf,
  Type
} from './types'

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

// Check Primary Types
const istype = (obj: unknown, to: string, io: Callable = null) => {
  return (
    typeof obj === to ||
    typeOf(obj) === to ||
    (io ? obj instanceof io : obj === undefined)
  )
}

// Primary Type-Guard Proxy
export const primaryGuards: Guards<PrimaryTypes> = {
  string: (obj => istype(obj, 'string', String)) as TypeGuard<string>,
  number: (obj => istype(obj, 'number', Number)) as TypeGuard<number>,
  bigint: (obj => istype(obj, 'bigint', BigInt)) as TypeGuard<bigint>,
  boolean: (obj => istype(obj, 'boolean', Boolean)) as TypeGuard<boolean>,
  symbol: (obj => istype(obj, 'symbol', Symbol)) as TypeGuard<symbol>,
  undefined: (obj => istype(obj, 'undefined')) as TypeGuard<undefined>,
  object: (obj => istype(obj, 'object', Object)) as TypeGuard<AnySet>,
  function: (obj => istype(obj, 'function', Function)) as TypeGuard<Callable>
}

// Unusual Type-Guard Record
export const unusualGuards: Guards<UnusualTypes> = {
  never: (obj => false && obj) as TypeGuard<never>,
  unknown: (obj => true || obj) as TypeGuard<unknown>,
  null: (obj => obj === null || obj === undefined) as TypeGuard<null>,
  true: (obj => obj === true) as TypeGuard<true>,
  false: (obj => obj === false) as TypeGuard<false>,
  array: (obj => Array.isArray(obj)) as TypeGuard<unknown[]>,
  promise: (obj => obj instanceof Promise) as TypeGuard<Promise<unknown>>,
  date: (obj => obj instanceof Date) as TypeGuard<Date>,
  regexp: (obj => false && obj) as TypeGuard<RegExp>,
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
  }) as TypeGuard<Constructor>,
  any: (obj => true || obj) as TypeGuard<unknown>
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
const isGuard = (obj, typeName) => {
  // Set Check Function
  const checkType = t => guards[t](obj)
  // Return Check
  if (!guards.array(typeName)) return checkType(typeName)
  else return typeName.some(checkType)
}

// Assign Methods to General Guard
Object.defineProperties(
  isGuard,
  Object.getOwnPropertyDescriptors({
    ...primaryGuards,
    ...unusualGuards
  })
)

// General Type-Guard
export const is = isGuard as Is

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
  ): o is Has<K, TypeOf<T>, O> => (typeName ? is(o[k], typeName) : true)

  // Perform Key Check
  const checkKey = (o: unknown, k: KeyOf): o is Has<K, TypeOf<T>, O> => {
    if (!is(o, 'object')) return false
    if (k in o) return checkType(o, k)
    if (Object.prototype.hasOwnProperty.call(o, k)) return checkType(o, k)
    if (is(k, 'string') && Object.keys(o).includes(k)) return checkType(o, k)
    else return false
  }

  // Return Check
  if (!is.array(key)) return checkKey(obj, key)
  else return key.every(k => checkKey(obj, k))
}

// General Sets Type-Guard
export function are<K extends KeyOf, T extends Types>(
  obj: Extra<K>,
  typeName: T | T[]
): obj is Extra<K, TypeOf<T>> {
  // Check All
  return Object.values(obj).every(v => is(v, typeName))
}

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
