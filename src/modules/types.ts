// ##########################################################################################################################

// Imports
import { is } from './guards'

// ##########################################################################################################################

// Export Type No-Op
export type As<T> = T

// Export Class No-Op
export class AsIs<T> {
  constructor(obj: T) { return obj }
}

// ##########################################################################################################################

// Check if Type A extends Type B
export type Extends<A, B> = A extends B ? true : false

// Generates a Type Error For some Expression Evaluating to False
export type CheckBool<B extends true> = B

// Check if Type A is equal to Type B
export type Equal<A, B> = (
  (<T>() => T extends A ? 1 : 2) extends
    (<T>() => T extends B ? 1 : 2)
      ? true
      : false
)

// ##########################################################################################################################

// Intersect Type
export type Intersect<U extends unknown> = (
  (U extends unknown ? (...args: U[]) => void : never) extends (
    ...args: (infer A)[]
  ) => void
    ? A
    : never
)

// Join Type
export type Join<T extends unknown> = (
  [Intersect<T>] extends [infer I]
    ? I extends never
      ? never
      : I extends {}
      ? {
          [K in keyof I]: I[K]
        }
      : never
    : never
)

// And Type
export type And<T extends unknown> = (
  [Intersect<T>] extends [infer I]
    ? I extends never
      ? never
      : I extends Set
      ? Join<I>
      : I
    : never
)

// Readonly Included Type
export type ReadonlyInclude<T> = T | Readonly<T>

// ##########################################################################################################################

// String-Like Type
export type StringLike = string | number | boolean | bigint

// To-String Type
export type ToString<T extends StringLike> = `${T}`

// String-Concat Type
export type StringConcat<S extends StringLike, C extends StringLike> = `${S}${C}`

// String-Join Helper Type
export type StringJoinHelper<
  T extends unknown[],
  D extends StringLike
> = AsIs<StringJoin<T, D>>

// String-Join Type
export type StringJoin<
  T extends ReadonlyInclude<unknown[]>,
  D extends StringLike
> = (
  T extends readonly []
    ? ''
    : T extends readonly [StringLike]
      ? `${T[0]}`
      : T extends readonly [StringLike, ...infer U]
        ? `${T[0]}${D}${StringJoin<U, D>}`
        : string
)

// String-Split Type
export type StringSplit<S extends string, D extends StringLike> = (
  string extends S
    ? string[]
    : S extends ''
      ? []
      : S extends `${infer T}${D}${infer U}`
        ? [T, ...StringSplit<U, D>]
        : [S]
)

// ##########################################################################################################################

// First Item Of Array
export type ArrayFirst<T extends unknown[]> = (
  T extends [infer F, ...unknown[]] ? F : never
)

// Last Item Of Array
export type ArrayLast<T extends unknown[]> = (
  T extends [...unknown[], infer L] ? L : never
)

// Push Last Item of Array
export type ArrayPush<T extends unknown[], V> = [...T, V]

// Push First Item of Array
export type ArrayPushFirst<T extends unknown[], V> = [V, ...T]

// Pop Last Item of Array
export type ArrayPop<T extends unknown[]> = (
  T extends ArrayPush<infer A, unknown>
    ? A
    : never
)

// Pop First Item of Array
export type ArrayPopFirst<T extends unknown[]> = (
  T extends ArrayPushFirst<infer A, unknown>
    ? A
    : never
)

// ##########################################################################################################################

// Last Item Of Type Union
export type LastOf<T> = (
  And<
    T extends unknown ? () => T : never
  > extends (() => infer R)
    ? R
    : never
)

// Type-Of Tuple
export type TupleOf<
  T = never,
  L = LastOf<T>,
> = (
  [T] extends [never]
    ? []
    : ArrayPush<
        TupleOf<
          Exclude<T, L>
        >,
        L
      >
)

// Array-Index Type
export type ArrayIndex<K extends KeyOf> = (
  number extends K
    ? never
    : K extends KeyOf<[]>
      ? never
      : K
)

// Object From Array Key-Values
export type ObjectFromArray<A extends unknown[] | {}> = {
  [K in keyof A as ArrayIndex<K>]: A[K]
}

// ##########################################################################################################################

// Type-Of Entries
export type Entries = [KeyOf, unknown][]

// Type-Of Record Entries
export type EntriesOf<
  T extends {} = Set
> = (
  TupleOf<
    {
      [K in keyof T]: [K, T[K]]
    }[keyof T]
  >
)

// Type-Of Record Entries
export type EntriesOfArray<
  S extends unknown[] | {} = []
> = (
  EntriesOf<ObjectFromArray<S>>
)

// Type-Of Entrie Record
export type ObjectFromEntries<T extends Entries = Entries> = (
  And<
    T extends (infer V)[]
      ? V extends [KeyOf, ValueOf]
        ? Has<V[0], V[1]>
        : never
      : never
  >
)

// Append Items To Array By Entries
export type ArrayAppendEntries<
  T extends Entries,
  A extends unknown[] = [],
> = (
  T extends []
    ? A
    : ArrayFirst<T> extends infer F
      ? ArrayPopFirst<T> extends infer AR
        ? F extends [KeyOf, unknown]
          ? AR extends Entries
            ? ArrayAppendEntries<
              AR,
              ArrayPush<A, F[1]>
            >
            : never
          : never
        : never
      : never
)

// Array Type From Entries
export type ArrayFromEntries<T extends Entries = []> = (
  ObjectFromEntries<T> extends infer O
    ? EntriesOfArray<O> extends infer E
      ? E extends Entries
        ? ArrayAppendEntries<E>
        : never
      : never
    : never
)

export type ArrayFromObject<O extends {}> = (
  EntriesOfArray<O> extends infer E
    ? E extends Entries
      ? ArrayFromEntries<E>
      : never
    : never
)

// ##########################################################################################################################

export type Partials<
  O extends Set,
  K extends unknown[] = TupleOf<keyof O>,
  ACC extends {} = {}
> = (
  K extends []
    ? And<ACC>
    : K[0] extends (infer P)
      ? P extends string | number | symbol 
        ? (
          { [K in keyof O as Exclude<K, P>]-?: O[K] } & { [K in P]?: O[P] }
        ) extends infer T
          ? T extends O
            ? Partials<O, ArrayPopFirst<K>, ACC & { [K in P]: true }>
            : Partials<O, ArrayPopFirst<K>, ACC & { [K in P]: false }>
          : never
        : never
      : never
)

// ##########################################################################################################################

type LoopBackSet<T> = {
  [x: string]: T | LoopBack<T>
  [x: number]: T | LoopBack<T>
  [x: symbol]: T | LoopBack<T> | boolean
}
type LoopBackArray<T> = (T | LoopBack<T>)[] | [...(T | LoopBack<T>)[]] | readonly [...(T | LoopBack<T>)[]]
export type LoopBack<T> = LoopBackSet<T> | LoopBackArray<T>

// ##########################################################################################################################

// Primitive Types
export type PrimitiveType = string | number | boolean | null | undefined

// Super Type
export type SuperType = Object | String | Number | Boolean | Array<unknown>

// Super-Construct Type
export type SuperConstruct<T> = (
  T extends string
    ? String
    : T extends number
      ? Number
      : T extends boolean
        ? Boolean
        : T extends unknown[]
          ? Array<unknown>
          : T extends {}
            ? Object
            : T
)

// Super-Type Constructor
export function SuperConstructor<T>(value: T) {
  return (
    is.string(value)
      ? (new String('' + value))
      : is.number(value)
        ? (new Number(0 + value))
        : is.boolean(value)
          ? (new Boolean(true && value))
          : is.array(value)
            ? (new Array([ ...value ]))
            : is.object(value)
              ? (new Object({ ...value }))
              : value
  ) as SuperConstruct<T>
}

// ##########################################################################################################################

// Get Primary Types
const primaryPrototype = typeof null
export type PrimaryTypes = typeof primaryPrototype
export type ExtendedTypes = keyof ExtendedTypesList

// Check Primary Types List
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type CheckPrimaryTypes = CheckBool<
  Extends<{ [P in PrimaryTypes]: PrimaryTypesList[P] }, PrimaryTypesList>
>

// Set Primary Types List
export interface PrimaryTypesList {
  string: string
  number: number
  bigint: bigint
  boolean: boolean
  symbol: symbol
  undefined: undefined
  object: {}
  function: Callable
}

// Set Extended Types List
export interface ExtendedTypesList {
  never: never
  unknown: unknown
  null: null
  true: true
  false: false
  array: unknown[]
  promise: Promise<unknown>
  error: Error
  date: Date
  regexp: RegExp
  typeof: Types
  keyof: KeyOf
  any: unknown
}

// Primary Type Symbols
export type Types = PrimaryTypes | ExtendedTypes

// Primary Type Generator
export type PrimaryType<N extends PrimaryTypes = PrimaryTypes> = (
  ValueOf<{ [P in PrimaryTypes]: N extends P ? PrimaryTypesList[P] : never }>
)

// ##########################################################################################################################

// Type Generator
export type Type<N extends Types = Types> = (
  N extends ExtendedTypes
    ? ValueOf<
        { [P in ExtendedTypes]: N extends P ? ExtendedTypesList[P] : never }
      >
    : N extends PrimaryTypes
    ? PrimaryType<N>
    : never
)

// Type-Name Generator Helper
type TypeOfIterator<V extends unknown, C extends boolean> = (
  ValueOf<
    {
      [P in PrimaryTypes | ExtendedTypes]: (
        Type<P> extends infer T
          ? unknown extends T
            ? undefined
            : C extends true
              ? Equal<T, V> extends true
                ? P
                : undefined
              : V extends T
                ? P
                : never
          : never
      )
    }
  >
)

// Type-Name Generator
export type TypeOf<V extends unknown = unknown> = (
  (TypeOfIterator<V, true> extends infer C
      ? C extends undefined
        ? TypeOfIterator<V, false>
        : C
      : never
  ) extends infer T
    ? T extends string
      ? T
      : never
    : never
)

// ##########################################################################################################################

// Type-Guard Interface
export type TypeGuardLike<A extends ArgOf = ArgOf> = (
  Callable<[obj: unknown, ...args: A], boolean>
)

// Generic Type-Guard Type
export interface TypeGuard<T = unknown, A extends ArgOf = ArgOf> {
  (obj: unknown, ...args: A): obj is T
}

// Type Of Guarded Type
export type TypeFromGuard<G extends TypeGuard> = (
  G extends TypeGuard<infer T> ? T : never
)

// Is-Type Type
export type IsType = <T extends Types>(
  obj: unknown,
  typeName: T | T[]
) => obj is Type<T>

// Guards Object Type
export type Guards<T extends Types = Types> = {
  [K in T]: TypeGuard<Type<K>, []>
}

// Set-Has Guard
export type HasGuard<T> = (
  <K extends KeyOf>(
    obj: unknown,
    key: K | K[],
  ) => obj is { [P in K]: T }
)

// Set Object Guard
export type ObjectIterGuard<T, H = never> = (
  <O extends Set = {}>(
    obj: unknown
  ) => obj is H | And<O | { [K in keyof O]: T }>
)

// Set Array Guard
export type ArrayIterGuard<T, H = never> = (
  <A extends unknown[] = unknown[]>(
    obj: unknown
  ) => obj is H | And<A &
    A extends (readonly unknown[])
      ? { [K in keyof A]: T }
      : T[]
  >
)

// ##########################################################################################################################

// Recursive-Guards Property Type
export interface GuardMethods<H> {
  in: HasGuard<H>
  or: SuperGuards<H>
  opt: SuperGuard<H> & { [opt]: true }
}

// Recursive-Object-Guards Property Type
export interface ObjectGuardMethods<H> {
  of: (<T extends GuardOrDescriptor>(guard: T) => (ObjectIterGuard<TypeFromGuardOrDescriptor<T>, H> & GuardMethods<{} | H>))
  & { [K in Types]: ObjectIterGuard<Type<K>, H> & GuardMethods<{} | H> }
}

// Recursive-Array-Guards Property Type
export interface ArrayGuardMethods<H> {
  of: (<T extends GuardOrDescriptor>(guard: T) => (ArrayIterGuard<TypeFromGuardOrDescriptor<T>, H> & GuardMethods<TypeFromGuardOrDescriptor<T>[] | H>))
  & { [K in Types]: ArrayIterGuard<Type<K>, H> & GuardMethods<Type<K>[] | H> }
}

// Helper for High-Depth Prevention
type SuperGuardHelper<H> = (
  TypeGuard<H, []> & GuardMethods<H>
)

// Super-Guards Object Type
export type SuperGuardsHelper<H = never> = (
  (<T extends GuardOrDescriptor>(guard: T) => SuperGuard<H | TypeFromGuardOrDescriptor<T>>) & 
  {
    [K in Types]: SuperGuard<H | Type<K>> & (
      K extends 'array'
        ? ArrayGuardMethods<H>
        : K extends 'object'
          ? ObjectGuardMethods<H>
          : {}
    )
  }
)

// Super-Guard Interface
export interface SuperGuard<H> extends SuperGuardHelper<H> {}

// Super-Guard Interface
export interface SuperGuards<H = never> extends SuperGuardsHelper<H> {}

// ##########################################################################################################################

// Tag For Optional Parameters
export const opt = Symbol('opt')

// Guard-Descriptor Type
export type GuardDescriptor<
  S extends ReadonlyInclude<unknown[] | Set> = null
> = (
  S extends null
    ? LoopBack<TypeGuard & { [opt]?: boolean }>
    : S extends ReadonlyInclude<unknown[]>
      ? {
        [K in keyof S as Exclude<K, typeof opt>]-?: (
          S[K] extends (infer I)
            ? boolean extends I
              ? TypeGuard<boolean, []>
              : true extends I
                ? TypeGuard<true, []>
                : false extends I
                  ? TypeGuard<false, []>
                  :  I extends (any | null | undefined)
                    ? TypeGuard<I, []>
                    : I extends ReadonlyInclude<unknown[] | Set>
                      ? GuardDescriptor<I>
                      : TypeGuard<I, []>
            : never
        )
      }
      : S extends ReadonlyInclude<Set>
        ? Partials<S> extends (infer P)
          ? {
            [K in keyof S as Exclude<K, typeof opt>]-?: And<(
              S[K] extends (infer I)
                ? boolean extends I
                  ? TypeGuard<boolean, []>
                  : true extends I
                    ? TypeGuard<true, []>
                    : false extends I
                      ? TypeGuard<false, []>
                      : I extends (any | null | undefined)
                        ? TypeGuard<I, []>
                        : I extends ReadonlyInclude<unknown[] | Set>
                          ? GuardDescriptor<I>
                          : TypeGuard<I, []>
                : never
            ) & (
              K extends keyof P
                ? P[K] extends true
                  ? { [opt]: true }
                  : unknown
                : never
            )>
          }
          : never
        : never
)

// Type-Of TypeGuard from Descriptor Helper
type TypeFromGuardDescriptorHelper<
  D extends GuardDescriptor,
  K extends keyof D
> = (
  D[K] extends GuardDescriptor
    ? TypeFromGuardDescriptor<D[K]>
    : D[K] extends TypeGuard
      ? TypeFromGuard<D[K]>
      : never
)

// Type-Of TypeGuard from Descriptor
export type TypeFromGuardDescriptor<
  D extends GuardDescriptor = null
> = (
  D extends unknown[]
    ? { [K in keyof D]: TypeFromGuardDescriptorHelper<D, K> } 
    : And<{
      [K in keyof D as (
        D[K] extends { [opt]: true } ? K : never
      )]+?: TypeFromGuardDescriptorHelper<D, K>
    } & {
      [K in keyof D as (
        D[K] extends { [opt]: true } ? never : K
      )]-?: TypeFromGuardDescriptorHelper<D, K>
    }> extends (infer U)
      ? { [K in keyof U as Exclude<K, typeof opt>]: U[K] }
      : never
)

// Guard Or Descriptor
export type GuardOrDescriptor = TypeGuard<unknown, []> | GuardDescriptor

// Type-Of Guard Or Descriptor
export type TypeFromGuardOrDescriptor<
  T extends GuardOrDescriptor
> = (
  T extends TypeGuard<unknown, []> 
    ? TypeFromGuard<T> 
    : T extends GuardDescriptor
      ? TypeFromGuardDescriptor<T>
      : never
)

// ##########################################################################################################################

// Is Interface
export interface Is extends SuperGuards {
  in: HasGuard<unknown>
}

// ##########################################################################################################################

// Type-Of Primary Key
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type KeyOfPrimary = keyof any

// Type-Of Record Key
export type KeyOf<
  T extends ReadonlyInclude<unknown[] | Set> = (unknown[] | Set)
> = (
  T extends {
    [P in infer K]: unknown
  }
    ? K & keyof T
    : never
)

// Type-Of Record Value
export type ValueOf<
  T extends ReadonlyInclude<unknown[] | Set> = (unknown[] | Set)
> = (
  T extends unknown[]
    ? T extends (infer V)[]
      ? V
      : never
    : T extends {
      [P in KeyOf]: infer V
    }
      ? V
      : never
)

// ##########################################################################################################################

// Type-Of Indexable Record
export interface StringSet<T = unknown> { [x: string]: T }
export interface NumberSet<T = unknown> { [x: number]: T }
export interface Set<T = unknown> {
  [x: string]: T
  [x: number]: T
  [x: symbol]: T
}

// Type-Of Has
export type Has<
  K extends KeyOf,
  T = unknown
> = { [P in K]: T }


// ##########################################################################################################################

// Type-Of Function
export interface Callable<
  A extends unknown[] = unknown[],
  R = unknown
> { (...args: A): R }

// Type-Of Function Args
export type ArgOf<F extends Callable = Callable> = (
  F extends Callable<infer A> ? A : never
)

// ##########################################################################################################################

// Async Function type
export interface Async<
  A extends ArgOf = ArgOf,
  R = unknown
> extends Callable<A, PromiseLike<R>> {}

// Return Type of Promise
export type PromiseThen<T extends PromiseLike<unknown>> = (
  T extends PromiseLike<infer R> ? R : never
)

// Return Type of Async
export type AsyncThen<T extends Async> = (
  PromiseThen<ReturnType<T>>
)

// Return Type of Promise or Async
export type Then<T> = (
  T extends PromiseLike<unknown>
    ? PromiseThen<T>
    : T extends Async
      ? AsyncThen<T>
      : never
)

// Return Type of Promise
export type PromiseAwait<T> = (
  T extends PromiseLike<unknown>
    ? PromiseAwait<PromiseThen<T>>
    : T
)

// Return Type of Await Promise or Async
export type Await<T> = (
  T extends PromiseLike<unknown>
    ? PromiseAwait<T>
    : T extends Async
      ? PromiseAwait<ReturnType<T>>
      : T
)

// ##########################################################################################################################
