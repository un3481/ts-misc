// ##########################################################################################################################

import type {
  Is,
  And,
  Set,
  Type,
  Types,
  KeyOf,
  Callable,
  PrimaryTypes,
  ExtendedTypes,
  TypeGuard,
  TypeGuardLike,
  Guards,
  SuperGuard,
  SuperGuards,
  Has,
  HasGuard,
  ArrayIterGuard,
  ObjectIterGuard,
  GuardDescriptor,
  ReadonlyInclude,
  TypeFromGuard,
  TypeFromGuardDescriptor,
  TypeFromGuardOrDescriptor,
  GuardOrDescriptor
} from './types'

// ##########################################################################################################################

// General Make Type-Guard
export const extend = <T, O = unknown>(
  obj: unknown
): obj is (
  T extends {}
    ? (O extends {} ? And<O & T> : O & T)
    : O & T
) => {
  return true
}

// General Set Type-Guard
export const guard = <T>(
  tg: TypeGuardLike
): TypeGuard<T> => {
  if (extend<TypeGuard<T>>(tg)) return tg
}

// ##########################################################################################################################

// Get Type-Of Object using 'ToString' Method
export const typeOf = (obj: unknown): string => {
  return Object
    .toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase()
}

// ##########################################################################################################################

// Check Primary Types
const setGuard = <N extends Types>(
  typeName: N,
  constructor: Callable | undefined
): TypeGuard<Type<N>, []> => {
  return (o: unknown): o is Type<N> => {
    // eslint-disable-next-line valid-typeof
    return (typeof o === typeName) || (constructor ? o instanceof constructor : o === undefined)
  }
}

// ##########################################################################################################################

// Primary Type-Guard Object
const primaryGuards: Guards<PrimaryTypes> = {
  undefined: setGuard( 'undefined', undefined ),
  string:    setGuard( 'string',    String    ),
  number:    setGuard( 'number',    Number    ),
  bigint:    setGuard( 'bigint',    BigInt    ),
  symbol:    setGuard( 'symbol',    Symbol    ),
  boolean:   setGuard( 'boolean',   Boolean   ),
  function:  setGuard( 'function',  Function  ),
  object:    (obj => (obj || false) && setGuard('object', Object)(obj)) as TypeGuard<{}>
}

// Extended Type-Guard Object
const extendedGuards: Guards<ExtendedTypes> = {
  any:     (obj => true) as TypeGuard<unknown>,
  never:   (obj => false) as TypeGuard<never>,
  unknown: (obj => true) as TypeGuard<unknown>,
  null:    (obj => obj === null) as TypeGuard<null>,
  true:    (obj => obj === true) as TypeGuard<true>,
  false:   (obj => obj === false) as TypeGuard<false>,
  date:    (obj => obj instanceof Date) as TypeGuard<Date>,
  array:   (obj => Array.isArray(obj)) as TypeGuard<unknown[]>,
  regexp:  (obj => obj instanceof RegExp) as TypeGuard<RegExp>,
  promise: (obj => obj instanceof Promise) as TypeGuard<Promise<unknown>>,
  keyof:   (obj => (p => p.string(obj) || p.number(obj) || p.symbol(obj))(primaryGuards)) as TypeGuard<KeyOf>,
  typeof:  (obj => (p => p.string(obj) && (obj in p || obj in extendedGuards))(primaryGuards)) as TypeGuard<Types>
}

// General Type-Guard Object
const guards: Guards = {
  ...primaryGuards,
  ...extendedGuards
}

// ##########################################################################################################################

// Has-Property Type-Guard
export const has = <
  K extends KeyOf, T = unknown
>(
  obj: unknown,
  key: K | K[],
  guard: TypeGuard<T, []> | null
): obj is Has<K, T> => {
  // Check Object
  if (!guards.object(obj)) return false
  // Set Check Function
  const checkType = <P extends KeyOf>(
    o: unknown, k: P
  ): o is Has<P, T> => {
    return guard ? guard(o[k]) : true
  }
  // Perform Key Check
  const checkKey = (o: {}, k: KeyOf): o is Has<K, T> => {
    if (o[k] === undefined) return false
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

// ##########################################################################################################################

// Check if Input is valid GuardDescriptor
const isGuardDescriptor = <
  T extends ReadonlyInclude<unknown[] | Set> = null
>(obj: unknown): obj is GuardDescriptor<T> => {
  if (guards.array(obj)) {
    if (obj.every(
      o => guards.function(o) || isGuardDescriptor(o)
    )) return true
  }
  else if (guards.object(obj)) {
    if (Object.values(obj).every(
      o => guards.function(o) || isGuardDescriptor(o)
    )) return true
  }
  return false
}

// ##########################################################################################################################

const guardFromArrayDescriptor = <
  D extends GuardDescriptor
>(descriptor: D): (
  TypeGuard<TypeFromGuardDescriptor<D>, []>
) => {
  if (!guards.array(descriptor)) throw new Error('invalid Guard-Descriptor')
  return (
    (obj: unknown): obj is TypeFromGuardDescriptor<D> => {
      if (!guards.array(obj)) return false
      return (
        descriptor.every(
          (guard, index) => {
            const _guard = guards.function(guard) ? guard : guardFromDescriptor(guard)
            return _guard(obj[index])
          }
        )
      )
    }
  )
}

const guardFromObjectDescriptor = <
  D extends GuardDescriptor
>(descriptor: D): (
  TypeGuard<TypeFromGuardDescriptor<D>, []>
) => (
  (obj: unknown): obj is TypeFromGuardDescriptor<D> => {
    if (!guards.object(obj)) return false
    return (
      Object.entries(descriptor).every(
        ([key, guard]) => {
          const _guard = guards.function(guard) ? guard : guardFromDescriptor(guard)
          return _guard(obj[key])
        }
      )
    )
  }
)

const guardFromDescriptor = <
  D extends GuardDescriptor
>(descriptor: D): TypeGuard<TypeFromGuardDescriptor<D>, []> => {
       if (guards.array(  descriptor )) return guardFromArrayDescriptor<D>(descriptor)
  else if (guards.object( descriptor )) return   guardFromObjectDescriptor(descriptor)
  else throw new Error('invalid Guard-Descriptor')
}

// ##########################################################################################################################

// Helper Types
type IterFlag = 'array' | 'object'

type IterMux<
  I extends IterFlag,
  AO,
  A,
  O,
  E
> = (
  I extends IterFlag
    ? AO : I extends 'array'
      ? A : I extends 'object'
        ? O : E
)

type IterGuard<
  I extends IterFlag,
  G,
  D
> = IterMux<
  I,
  ArrayIterGuard<G, D> | ObjectIterGuard<G, D>,
  ArrayIterGuard<G, D>,
  ObjectIterGuard<G, D>,
  never
>

// ##########################################################################################################################

// Target for Callable Proxy
const tar = (() => null) as null

// ##########################################################################################################################

// Check Iter Flag
const checkIterFlag = (
  flag: string
): flag is IterFlag => (
  ['array', 'object'].includes(flag)
)

// ##########################################################################################################################

// Type-Guard Proxy-Function Generator
const GuardGenerator = <
  D extends TypeGuard<unknown, []>,
  G extends TypeGuard<unknown, []>
>(
  prev: D | null,
  next: G
): (
  TypeGuard<TypeFromGuard<D> | TypeFromGuard<G>, []>
) => {
  // Set Downstream Guard
  const _prev = (guards.function(prev) ? prev : o => false) as TypeGuard<TypeFromGuard<D>, []>
  // Set Upstream Guard
  return (
    (o: unknown) => (_prev(o) || next(o) || false) && true
  ) as TypeGuard<TypeFromGuard<D> | TypeFromGuard<G>, []>
}

// ##########################################################################################################################

// Type-Guard Proxy-Function Generator
const IterGuardGenerator = <
  I extends IterFlag,
  D extends TypeGuard<unknown, []>,
  G extends TypeGuard<unknown, []>
>(
  prev: D | null,
  next: G,
  iter: I
): (
  IterGuard<I, TypeFromGuard<G>, TypeFromGuard<D>>
) => {
  // Set Downstream Guard
  const _prev = (guards.function(prev) ? prev : o => false) as TypeGuard<TypeFromGuard<D>, []>
  // Set Upstream Guard
  if (iter == 'array') {
    return (
      (o: unknown) => (_prev(o) || (guards.array(o) && o.every(next)) || false) && true
    ) as IterGuard<I, TypeFromGuard<G>, TypeFromGuard<D>>
  }
  if (iter == 'object') {
    return (
      (o: unknown) => (_prev(o) || Object.values(o).every(next) || false) && true
    ) as IterGuard<I, TypeFromGuard<G>, TypeFromGuard<D>>
  }
}

// ##########################################################################################################################

// In Proxy-Handler
const InProxyHandler = <
  G extends TypeGuard<unknown, []>
>(
  prev: G
): (
  ProxyHandler<HasGuard<TypeFromGuard<G>>>
) => ({
  // In Call
  apply<K extends KeyOf>(
    target: unknown,
    thisArg: unknown,
    args: [unknown, K]
  ): args is [{ [P in K]: TypeFromGuard<G> }, K] {
    if (args.length != 2) throw new Error('invalid arguments to "has"')
    if (prev && !guards.function(prev)) throw new Error('invalid type-guard for "has"')
    // Check For Key and Type
    return has(args[0], args[1], prev)
  },
  // General Methods
  get(target, p, receiver) { return undefined },
  set(target, p, value) { return null },
  deleteProperty(target, p) { return null },
  defineProperty(target, p, attr) { return null },
  ownKeys(target) { return Object.keys(guards) },
  has(target, p) { return p in guards }
})

// ##########################################################################################################################

// Or Proxy-Handler
const OrProxyHandler = <
  G extends TypeGuard<unknown, []>
>(
  prev: G | null
): (
  ProxyHandler<SuperGuards<TypeFromGuard<G>>>
) => ({
  // Or Call
  apply<T extends GuardOrDescriptor>(
    target: unknown,
    thisArg: unknown,
    args: [T]
  ): SuperGuard<TypeFromGuard<G> | TypeFromGuardOrDescriptor<T>> {
    if (args.length != 1) throw new Error('invalid arguments to Super-Guard')
    const guard = args[0]
    // Tranform GuardDescriptor
    let _guard: TypeGuard<TypeFromGuardOrDescriptor<T>, []>
    if (guards.function(guard)) { _guard = guard as (typeof _guard) }
    else if (isGuardDescriptor(guard)) { _guard = guardFromDescriptor(guard) as (typeof _guard) }
    else throw new Error('invalid Type-Guard or Guard-Descriptor')
    // Generate Recursive Type-Guard Proxy
    let next = GuardGenerator(prev, _guard)
    return new Proxy(
      tar, GuardProxyHandler(next)
    )
  },
  // Or Properties
  get<P extends string | symbol>(
    target: unknown,
    p: P,
    receiver: unknown
  ): SuperGuard<TypeFromGuard<G> | TypeFromGuard<TypeGuard<P extends Types ? Type<P>: never, []>>> {
    // Check if property exists
    if (!guards.typeof(p)) return undefined
    // Get Type-Guard
    const guard = guards[p] as TypeGuard<P extends Types ? Type<P> : never, []>
    // Generate Recursive Type-Guard Proxy
    const next = GuardGenerator(prev, guard)
    // Check for Array Or Object
    if (checkIterFlag(p)) {
      return new Proxy(
        tar, IterGuardProxyHandler(next, p)
      )
    } else {
      return new Proxy(
        tar, GuardProxyHandler(next)
      )
    }
  },
  // General Methods
  set(target, p, value) { return null },
  deleteProperty(target, p) { return null },
  defineProperty(target, p, attr) { return null },
  ownKeys(target) { return Object.keys(guards) },
  has(target, p) { return p in guards }
})

// ##########################################################################################################################

// Of Proxy-Handler
const OfProxyHandler = <
  I extends IterFlag,
  G extends TypeGuard<unknown, []>
>(
  prev: G | null,
  iter: I
): (
  ProxyHandler<SuperGuards<TypeFromGuard<G>>[I]['of']>
) => ({
  // Or Call
  apply<T extends GuardOrDescriptor>(
    target: unknown,
    thisArg: unknown,
    args: [T]
  ): SuperGuard<TypeFromGuard<IterGuard<I, TypeFromGuardOrDescriptor<T>, TypeFromGuard<G>>>> {
    if (args.length != 1) throw new Error('invalid arguments to Super-Guard')
    const guard = args[0]
    // Tranform GuardDescriptor
    let _guard: TypeGuard<TypeFromGuardOrDescriptor<T>, []>
    if (guards.function(guard)) { _guard = guard as (typeof _guard) }
    else if (isGuardDescriptor(guard)) { _guard = guardFromDescriptor(guard) as (typeof _guard) }
    else throw new Error('invalid Type-Guard or Guard-Descriptor')
    // Generate Recursive Type-Guard Proxy
    let next = IterGuardGenerator(prev, _guard, iter)
    return new Proxy(
      tar, GuardProxyHandler(next)
    )
  },
  // Or Properties
  get<P extends string | symbol>(
    target: unknown,
    p: P,
    receiver: null
  ): SuperGuard<TypeFromGuard<G> | TypeFromGuard<IterGuard<I, P extends Types ? Type<P> : never, never>>> {
    // Check if property exists
    if (!guards.typeof(p)) return undefined
    // Get Type-Guard
    const guard = guards[p] as TypeGuard<P extends Types ? Type<P> : never, []>
    // Generate Recursive Type-Guard Proxy
    const next = IterGuardGenerator(prev, guard, iter)
    return new Proxy(
      tar, GuardProxyHandler(next)
    )
  },
  // General Methods
  set(target, p, value) { return null },
  deleteProperty(target, p) { return null },
  defineProperty(target, p, attr) { return null },
  ownKeys(target) { return Object.keys(guards) },
  has(target, p) { return p in guards }
})

// ##########################################################################################################################

// Type-Guard Proxy-Function Generator
const GuardProxyHandler = <
  G extends TypeGuard<unknown, []>
>(
  guard: G
): (
  ProxyHandler<SuperGuard<TypeFromGuard<G>>>
) => ({
  // SuperGuard Call
  apply(
    target: unknown,
    thisArg: unknown,
    args: [unknown]
  ): args is [TypeFromGuard<G>] {
    if (args.length != 1) throw new Error('invalid arguments to "is"')
    return guard(args[0])
  },
  // SuperGuard Properties
  get<P extends string | symbol>(
    target: unknown,
    p: P,
    receiver: unknown
  ) {
    // Check Guard
    if (!guards.function(guard)) return undefined
    // In Clause
    if (p === 'in') return new Proxy(
      tar as HasGuard<TypeFromGuard<G>>,
      InProxyHandler(guard)
    )
    // Or Clause
    if (p === 'or') return new Proxy(
      tar as SuperGuards<TypeFromGuard<G>>,
      OrProxyHandler(guard)
    )
    // Optional Clause
    if (p === 'opt') {
      // Generate Recursive Type-Guard Proxy
      const next = GuardGenerator(guards.undefined, guard)
      return new Proxy(
        tar as SuperGuard<TypeFromGuard<G> | undefined>,
        GuardProxyHandler(next)
      )
    }
    // Else
    return undefined
  },
  // General Methods
  set(target, p, value) { return null },
  deleteProperty(target, p) { return null },
  defineProperty(target, p, attr) { return null },
  ownKeys(target) { return ['in', 'or', 'opt'] },
  has(target, p) { return p in ['in', 'or', 'opt'] }
})

// ##########################################################################################################################

// Iter SuperGuard Proxy
const IterGuardProxyHandler = <
  I extends IterFlag,
  G extends TypeGuard<unknown, []>
>(
  guard: G,
  iter: I
): (
  ProxyHandler<SuperGuard<TypeFromGuard<G>>>
) => {
  // SuperGuard ProxyHandler
  const handler = GuardProxyHandler(guard)
  // IterSuperGuard ProxyHandler
  return {
    ...handler,
    // IterSuperGuard Properties
    get<P extends string | symbol>(
      target: unknown,
      p: P,
      receiver: unknown
    ) {
      // Check Guard
      if (!guards.function(guard)) return undefined
      // Of Clause
      if (p === 'of') {
        return new Proxy(
          tar as SuperGuards<TypeFromGuard<G>>[I]['of'],
          OfProxyHandler(guard, iter)
        )
      }
      // Else
      return handler.get(target as null, p, receiver)
    },
    // General Methods
    ownKeys(target) { return Array.from(handler.ownKeys(target)).concat(['of']) },
    has(target, p) { return handler.has(target, p) || p in ['of'] }
  }
}

// ##########################################################################################################################

// Is ProxyHandler
const IsProxyHandler = (): (
  ProxyHandler<Is>
) => {
  // SuperGuards ProxyHandler
  const handler = OrProxyHandler(null as never)
  // Is ProxyHandler
  return {
    ...handler,
    // Is Properties
    get<P extends string | symbol>(
      target: unknown,
      p: P,
      receiver: unknown
    ) {
      // In Clause
      if (p === 'in') return new Proxy(
        tar, InProxyHandler(null)
      )
      // Else
      return handler.get(target as null, p, receiver)
    },
    // General Methods
    ownKeys(target) { return Array.from(handler.ownKeys(target)).concat(['in']) },
    has(target, p) { return handler.has(target, p) || p in ['in'] }
  }
}

// ##########################################################################################################################

// Is Proxy
export const is: Is = new Proxy(
  tar, IsProxyHandler()
)

// ##########################################################################################################################
