/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

// Export Type No-Op
export type As<T> = T

// Intersection Type
export type And<U> = (
  U extends unknown ? (...args: U[]) => void : never
) extends (...args: As<infer A>[]) => void
  ? As<A>
  : never

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

// Last Item Of Array
type LastOf<T> = As<
  And<T extends unknown ? () => T : never> extends As<() => infer R> ? R : never
>

// Push To Last Element of Type
type Push<T extends unknown[], V> = [...T, V]

// Tuple Of Types
type TupleOf<
  T = never,
  L = LastOf<T>,
  N = [T] extends [never] ? true : false
> = true extends N ? [] : Push<TupleOf<Exclude<T, L>>, L>

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

// Get Base Types
const typeOf = typeof null
export type PrimaryTypes = typeof typeOf

// Primary Type Symbols
export type UnusualTypes =
  | 'never'
  | 'unknown'
  | 'null'
  | 'true'
  | 'false'
  | 'array'
  | 'promise'
  | 'date'

// Primary Type Symbols
export type Types = PrimaryTypes | UnusualTypes

// Infer Primary Type
type InferType<V extends Types, L extends Types, T> = V extends L ? T : never

// Primary Type Generator
export type TypeOfPrimary<V extends PrimaryTypes = PrimaryTypes> =
  | InferType<V, 'string', string>
  | InferType<V, 'number', number>
  | InferType<V, 'bigint', bigint>
  | InferType<V, 'boolean', boolean>
  | InferType<V, 'symbol', symbol>
  | InferType<V, 'undefined', undefined>
  | InferType<V, 'object', StringSet>
  | InferType<V, 'function', Callable>

// Primary Type Generator
export type TypeOf<V extends Types = Types> =
  | (V extends PrimaryTypes ? TypeOfPrimary<V> : never)
  | InferType<V, 'never', never>
  | InferType<V, 'unknown', unknown>
  | InferType<V, 'null', null>
  | InferType<V, 'true', true>
  | InferType<V, 'false', false>
  | InferType<V, 'array', unknown[]>
  | InferType<V, 'promise', Promise<unknown>>
  | InferType<V, 'date', Date>

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

// Type-Guard Interface
export type TypeGuardShape<A extends ArgOf = ArgOf> = As<
  (obj: unknown, ...args: A) => boolean
>

// Generic Type-Guard Type
export type TypeGuard<T, A extends ArgOf = ArgOf> = As<
  (obj: unknown, ...args: A) => obj is T
>

// Type Of Guarded Type
export type GuardOf<G extends TypeGuard<unknown>> = As<
  G extends TypeGuard<infer T> ? T : never
>

// Guards Object Type
export type Guards<K extends Types = Types> = As<
  And<K extends Types ? Has<K, TypeGuard<TypeOf<K>, []>> : never>
>

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

// Type-Of Primary Key
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type KeyOfPrimary = keyof any

// Type-Of Record Key
export type KeyOf<T extends Extra = Extra> = As<
  T extends {
    [P in infer K]: unknown
  }
    ? K & keyof T
    : never
>

// Type-Of Record Value
export type ValueOf<T extends Extra = Extra> = As<
  T extends {
    [P in KeyOf]: infer V
  }
    ? V
    : never
>

// Type-Of Record Entries
export type Entries<
  T extends { [P in KeyOf]: ValueOf } = { [P in KeyOf]: ValueOf }
> = As<
  TupleOf<
    {
      [K in KeyOf<T>]: [K, T[K]]
    }[KeyOf<T>]
  >
>

// Type-Of Entrie Record
export type EntrieOf<T extends [KeyOf, ValueOf][] = [KeyOf, ValueOf][]> = As<
  And<
    T extends (infer V)[]
      ? V extends [KeyOf, ValueOf]
        ? Has<V[0], V[1]>
        : never
      : never
  >
>

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

// Type-Of Indexable Record
export type Index<K extends KeyOfPrimary = KeyOfPrimary, T = unknown> = As<
  K extends symbol
    ? { [P in symbol]: T }
    : K extends string
    ? { [x: string]: T }
    : K extends number
    ? { [x: number]: T }
    : never
>

// Type-Of Extendable Record
export type Extra<K extends KeyOfPrimary = KeyOfPrimary, T = unknown> = As<
  { [P in K]: T } & Index<K, T>
>

// Type-Of Indexed Set
export type StringSet<T = ValueOf> = As<{ [x: string]: T }>
export type NumberSet<T = ValueOf> = As<{ [x: number]: T }>

// Type-Of Has
export type Has<K extends KeyOf = KeyOf, T = ValueOf> = As<{ [P in K]: T }>

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

// Type Of Function
export type Callable<A extends unknown[] = unknown[], R = unknown> = As<
  (...args: A) => R
>

// Type Of Args Of Function
export type ArgOf<F extends Callable = Callable> = As<
  F extends Callable<infer A> ? A : never
>

// Type Of Return Of Function
export type ReturnOf<F extends Callable = Callable> = ReturnType<F>

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

// Return Type of Promise
export type PromiseThen<T extends Promise<unknown>> = T extends PromiseLike<
  infer R
>
  ? R
  : never

// Return Type of Async
export type AsyncThen<
  T extends Callable<unknown[], Promise<unknown>>
> = PromiseThen<ReturnOf<T>>

// Return Type of Promise or Async
export type Then<T> = T extends Promise<unknown>
  ? PromiseThen<T>
  : T extends Callable<unknown[], Promise<unknown>>
  ? AsyncThen<T>
  : never

// Return Type of Promise
export type PromiseAwait<T> = T extends Promise<unknown>
  ? PromiseAwait<PromiseThen<T>>
  : T

// Return Type of Await Promise or Async
export type Await<T> =
  | PromiseAwait<T>
  | (T extends Promise<unknown>
      ? PromiseAwait<T>
      : T extends Callable<unknown[], Promise<unknown>>
      ? PromiseAwait<ReturnOf<T>>
      : T)

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

// General Make Type-Guard
export function extend<T>(obj: unknown): obj is As<T> {
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

// Primary Type-Guard Proxy
export const primaryGuards = new Proxy(
  {},
  {
    get(target, name: Types) {
      if (Object.hasOwnProperty.call(target, name)) return target[name]
      else {
        return (obj: unknown): obj is TypeOf<typeof name> => {
          return typeof obj === name
        }
      }
    }
  }
) as Guards<PrimaryTypes>

// Unusual Type-Guard Record
export const unusualGuards: Guards<UnusualTypes> = {
  never: (obj => false && obj) as TypeGuard<never>,
  unknown: (obj => true || obj) as TypeGuard<unknown>,
  null: (obj => obj === null || obj === undefined) as TypeGuard<null>,
  true: (obj => obj === true) as TypeGuard<true>,
  false: (obj => obj === false) as TypeGuard<false>,
  array: (obj => Array.isArray(obj)) as TypeGuard<unknown[]>,
  promise: (obj => obj instanceof Promise) as TypeGuard<Promise<unknown>>,
  date: (obj => obj instanceof Date) as TypeGuard<Date>
}

// General Type-Guard Proxy
export const guards = new Proxy(unusualGuards, {
  get(target, name: Types) {
    if (Object.hasOwnProperty.call(target, name)) return target[name]
    else return primaryGuards[name]
  }
}) as Guards

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

// General Type-Guard
export function is<T extends Types>(
  obj: unknown,
  typeName: T | T[]
): obj is TypeOf<T> {
  // Set Check Function
  const checkType = (t: T) => guards[t](obj)
  // Return Check
  if (!guards.array(typeName)) return checkType(typeName)
  else return typeName.some(checkType)
}

// Property Type-Guard
export function has<K extends KeyOf, T extends Types>(
  obj: Extra,
  key: K | K[],
  typeName?: T | T[]
): obj is Has<K, TypeOf<T>> {
  // Set Check Function
  const checkType = <K extends KeyOf>(
    o: Extra<KeyOf>,
    k: K
  ): o is Has<K, TypeOf<T>> => (typeName ? is(o[k], typeName) : true)

  // Perform Key Check
  const checkKey = (o: Extra, k: KeyOf): o is Has<K, unknown> => {
    if (k in o) return checkType(o, k)
    if (Object.prototype.hasOwnProperty.call(o, k)) return checkType(o, k)
    if (is(k, 'string') && Object.keys(o).includes(k)) return checkType(o, k)
    else return false
  }

  // Return Check
  if (!is(key, 'array')) return checkKey(obj, key)
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

export type ValidatorTypes =
  | 'string'
  | 'boolean'
  | 'number'
  | 'array'
  | 'string?'
  | 'boolean?'
  | 'number?'

export type ValidatorDefinition<T> = {
  [key in keyof T]: T[key] extends string
    ? 'string' | 'string?'
    : T[key] extends number
    ? 'number' | 'number?'
    : T[key] extends boolean
    ? 'boolean' | 'boolean?'
    : T[key] extends Array<infer TArrayItem>
    ? Array<ValidatorDefinition<TArrayItem>>
    : ValidatorTypes
}

export function typeGuardFactory<T>(
  reference: ValidatorDefinition<T>
): (value: unknown) => value is T {
  const validators: ((propertyValue: unknown) => boolean)[] = Object.keys(
    reference
  ).map(key => {
    const referenceValue = (<unknown>reference)[key]
    switch (referenceValue) {
      case 'string':
        return v => typeof v[key] === 'string'
      case 'boolean':
        return v => typeof v[key] === 'boolean'
      case 'number':
        return v => typeof v[key] === 'number'
      case 'string?':
        return v => v[key] == null || typeof v[key] === 'string'
      case 'boolean?':
        return v => v[key] == null || typeof v[key] === 'boolean'
      case 'number?':
        return v => v[key] == null || typeof v[key] === 'number'
      default:
        // we are not accepting null/undefined for empty array... Should decide how to
        // handle/configure the specific case
        if (Array.isArray(referenceValue)) {
          const arrayItemValidator = typeGuardFactory<unknown>(
            referenceValue[0]
          )
          return v => Array.isArray(v[key]) && v[key].every(arrayItemValidator)
        }
        // TODO: handle default case
        return _v => false && _v
    }
  })
  return (value: T): value is T =>
    (value && validators.every(validator => validator(value))) || false
}

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/
