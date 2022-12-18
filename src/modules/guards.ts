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
  array:   (obj => Array.isArray(obj)) as TypeGuard<unknown[]>,
  date:    (obj => obj instanceof Date) as TypeGuard<Date>,
  error:   (obj => obj instanceof Error) as TypeGuard<Error>,
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
    return guard ? ((guard(o[k]) || false) && true) : true
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

// Check if Input is valid GuardDescriptor
const isGuardDescriptor = <
  T extends ReadonlyInclude<unknown[] | Set> = null
>(
  obj: unknown
): obj is GuardDescriptor<T> => {
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
>(
  descriptor: D
): (
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

// ##########################################################################################################################

const guardFromObjectDescriptor = <
  D extends GuardDescriptor
>(
  descriptor: D
): (
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

// ##########################################################################################################################

const guardFromDescriptor = <
  D extends GuardDescriptor
>(
  descriptor: D
): (
  TypeGuard<TypeFromGuardDescriptor<D>, []>
) => (
  guards.array(descriptor)
    ? guardFromArrayDescriptor<D>(descriptor)
    : (
      guards.object(descriptor)
        ? guardFromObjectDescriptor(descriptor)
        : null
    )
)

// ##########################################################################################################################

const GuardGenerate = <
  D extends GuardOrDescriptor
>(
  descriptor: D
): (
  TypeGuard<TypeFromGuardOrDescriptor<D>, []>
) => (
  (
    guards.function(descriptor)
      ? descriptor
      : (
        isGuardDescriptor(descriptor)
          ? guardFromDescriptor(descriptor)
          : null
      )
  ) as TypeGuard<TypeFromGuardOrDescriptor<D>, []>
)

// ##########################################################################################################################

// Type-Guard Proxy-Function Generator
const GuardAppend = <
  D extends TypeGuard<unknown, []>,
  G extends TypeGuard<unknown, []>
>(
  prev: D | null,
  guard: G
): (
  TypeGuard<TypeFromGuard<D> | TypeFromGuard<G>, []>
) => (
  (
    guards.function(prev)
      ? (o: unknown) => prev(o) || guard(o)
      : (o: unknown) => guard(o)
  ) as TypeGuard<TypeFromGuard<D> | TypeFromGuard<G>, []>
)

// ##########################################################################################################################

// Type-Guard Proxy-Function Generator
const IterGuardAppend = <
  I extends IterFlag,
  D extends TypeGuard<unknown, []>,
  G extends TypeGuard<unknown, []>
>(
  prev: D | null,
  guard: G,
  iter: I
): (
  IterGuard<I, TypeFromGuard<G>, TypeFromGuard<D>>
) => (
  GuardAppend(
    prev,
    (
      (iter == 'array')
        ? ((o: unknown) => (guards.array(o) && o.every(guard)))
        : (
          (iter == 'object')
            ? ((o: unknown) => (guards.object(o) && Object.values(o).every(guard)))
            : null
        )
    ) as IterGuard<I, TypeFromGuard<G>, never>
  ) as IterGuard<I, TypeFromGuard<G>, TypeFromGuard<D>>
)

// ##########################################################################################################################

const DefaultProxyHandler: ProxyHandler<{}> = {
  ownKeys(target) { return [] },
  has(target, p) { return false },
  deleteProperty(target, p) { return undefined },
  defineProperty(target, p, attr) { return undefined },
  set(target, p, value) { return undefined },
  get(target, p, receiver) { return undefined },
  apply(target, thisArg,  args) { return undefined }
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
  ...DefaultProxyHandler,
  // In Call
  apply<K extends KeyOf>(
    target: unknown,
    thisArg: unknown,
    args: [unknown, K]
  ): args is [{ [P in K]: TypeFromGuard<G> }, K] {
    if (args.length != 2) throw new Error('invalid arguments to "has"')
    // Transform GuardDescriptor
    const guard = prev ? GuardGenerate(prev) : null
    // Check For Key and Type
    return has(args[0], args[1], guard)
  }
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
  ...DefaultProxyHandler,
  // Key Listing
  ownKeys(target) { return Object.keys(guards) },
  has(target, p) { return p in guards },
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
    const next = GuardAppend(prev, guard)
    // Check for Array Or Object
    if (p === 'object' || p === 'array') {
      return new Proxy(
        (() => null) as null,
        IterGuardProxyHandler(prev, next, p)
      )
    } else {
      return new Proxy(
        (() => null) as null,
        GuardProxyHandler(next)
      )
    }
  },
  // Or Call
  apply<T extends GuardOrDescriptor>(
    target: unknown,
    thisArg: unknown,
    args: [T]
  ): SuperGuard<TypeFromGuard<G> | TypeFromGuardOrDescriptor<T>> {
    if (args.length != 1) throw new Error('invalid arguments to Super-Guard')
    // Transform GuardDescriptor
    const guard = GuardGenerate(args[0])
    if (!is.function(guard)) throw new Error('invalid Type-Guard or Guard-Descriptor')
    // Generate Recursive Type-Guard Proxy
    const next = GuardAppend(prev, guard)
    return new Proxy(
      (() => null) as null,
      GuardProxyHandler(next)
    )
  }
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
  ...OrProxyHandler(prev) as {},
  // Of Properties
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
    const next = IterGuardAppend(prev, guard, iter)
    return new Proxy(
      (() => null) as null,
      GuardProxyHandler(next)
    )
  },
  // Of Call
  apply<T extends GuardOrDescriptor>(
    target: unknown,
    thisArg: unknown,
    args: [T]
  ): SuperGuard<TypeFromGuard<IterGuard<I, TypeFromGuardOrDescriptor<T>, TypeFromGuard<G>>>> {
    if (args.length != 1) throw new Error('invalid arguments to Super-Guard')
    // Transform GuardDescriptor
    const guard = GuardGenerate(args[0])
    if (!is.function(guard)) throw new Error('invalid Type-Guard or Guard-Descriptor')
    // Generate Recursive Type-Guard Proxy
    const next = IterGuardAppend(prev, guard, iter)
    return new Proxy(
      (() => null) as null,
      GuardProxyHandler(next)
    )
  }
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
  ...DefaultProxyHandler,
  // Key Listing
  ownKeys(target) { return ['in', 'or', 'opt'] },
  has(target, p) { return p in ['in', 'or', 'opt'] },
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
      (() => null) as null as HasGuard<TypeFromGuard<G>>,
      InProxyHandler(guard)
    )
    // Or Clause
    if (p === 'or') return new Proxy(
      (() => null) as null as SuperGuards<TypeFromGuard<G>>,
      OrProxyHandler(guard)
    )
    // Optional Clause
    if (p === 'opt') {
      // Generate Recursive Type-Guard Proxy
      const next = GuardAppend(guards.undefined, guard)
      return new Proxy(
        (() => null) as null as SuperGuard<TypeFromGuard<G> | undefined>,
        GuardProxyHandler(next)
      )
    }
    // Else
    return undefined
  },
  // SuperGuard Call
  apply(
    target: unknown,
    thisArg: unknown,
    args: [unknown]
  ): args is [TypeFromGuard<G>] {
    if (args.length != 1) throw new Error('invalid arguments to "super-guard"')
    return ((guard(args[0]) || false) && true)
  }
})

// ##########################################################################################################################

// Iter SuperGuard Proxy
const IterGuardProxyHandler = <
  I extends IterFlag,
  B extends TypeGuard<unknown, []>,
  G extends TypeGuard<unknown, []>
>(
  prev: B | null,
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
    // General Methods
    ownKeys(target) { return Array.from(handler.ownKeys(target)).concat(['of']) },
    has(target, p) { return handler.has(target, p) || p in ['of'] },
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
          (() => null) as null as SuperGuards<TypeFromGuard<B> | TypeFromGuard<G>>[I]['of'],
          OfProxyHandler(prev, iter)
        )
      }
      // Else
      return handler.get(target as null, p, receiver)
    }
  }
}

// ##########################################################################################################################

// In Null ProxyHandler
const inHandler = InProxyHandler(null as null)

// Or Null ProxyHandler
const orHandler = OrProxyHandler(null as null)

// Is ProxyHandler
const IsProxyHandler: ProxyHandler<Is> = {
  ...orHandler,
  // Is Properties
  get<P extends string | symbol>(
    target: unknown,
    p: P,
    receiver: unknown
  ) {
    // In Clause
    if (p === 'in') return new Proxy(
      (() => null) as null,
      inHandler
    )
    // Else
    return orHandler.get(target as null, p, receiver)
  },
  // General Methods
  ownKeys(target) { return Array.from(orHandler.ownKeys(target)).concat(['in']) },
  has(target, p) { return orHandler.has(target, p) || p in ['in'] }
}

// ##########################################################################################################################

// Is Proxy
export const is: Is = new Proxy(
  (() => null) as null,
  IsProxyHandler
)

// ##########################################################################################################################
