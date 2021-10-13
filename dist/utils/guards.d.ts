import type {
  As,
  Is,
  And,
  Types,
  PrimaryTypes,
  UnusualTypes,
  TypeGuard,
  TypeGuardLike,
  Guards,
  Callable,
  Extra,
  Has,
  KeyOf,
  ArgOf,
  TypeOf,
  Type
} from './types.js';
export declare function extend < T, O = unknown > (obj: unknown): obj is As < T extends Extra ? (O extends Extra ? And < O & T > : O & T) : O & T > ;
export declare function guard < T > (tg: TypeGuardLike): TypeGuard < T > ;
export declare function typeOf(obj: unknown): string;
export declare const primaryGuards: Guards < PrimaryTypes > ;
export declare const unusualGuards: Guards < UnusualTypes > ;
export declare function isType < T extends Types > (obj: unknown, typeName: T | T[]): obj is Type < T > ;
export declare const superGuards: {
  string: ((obj: unknown) => obj is string) & import("./types.js").ReGuard < "string" > ;
  number: ((obj: unknown) => obj is number) & import("./types.js").ReGuard < "number" > ;
  bigint: ((obj: unknown) => obj is bigint) & import("./types.js").ReGuard < "bigint" > ;
  boolean: ((obj: unknown) => obj is boolean) & import("./types.js").ReGuard < "boolean" > ;
  symbol: ((obj: unknown) => obj is symbol) & import("./types.js").ReGuard < "symbol" > ;
  undefined: ((obj: unknown) => obj is undefined) & import("./types.js").ReGuard < "undefined" > ;
  object: ((obj: unknown) => obj is {
    [x: string]: unknown;
    [x: number]: unknown;
  }) & import("./types.js").ReGuard < "object" > ;
  function: ((obj: unknown) => obj is(...args: unknown[]) => unknown) & import("./types.js").ReGuard < "function" > ;
  never: ((obj: unknown) => obj is never) & import("./types.js").ReGuard < "never" > ;
  unknown: ((obj: unknown) => obj is unknown) & import("./types.js").ReGuard < "unknown" > ;
  null: ((obj: unknown) => obj is null) & import("./types.js").ReGuard < "null" > ;
  true: ((obj: unknown) => obj is true) & import("./types.js").ReGuard < "true" > ;
  false: ((obj: unknown) => obj is false) & import("./types.js").ReGuard < "false" > ;
  array: ((obj: unknown) => obj is unknown[]) & import("./types.js").ReGuard < "array" > ;
  promise: ((obj: unknown) => obj is Promise < unknown > ) & import("./types.js").ReGuard < "promise" > ;
  date: ((obj: unknown) => obj is Date) & import("./types.js").ReGuard < "date" > ;
  regexp: ((obj: unknown) => obj is RegExp) & import("./types.js").ReGuard < "regexp" > ;
  typeof: ((obj: unknown) => obj is "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" | "never" | "unknown" | "null" | "true" | "false" | "array" | "promise" | "date" | "regexp" | "typeof" | "keyof" | "class" | "any") & import("./types.js").ReGuard < "typeof" > ;
  keyof: ((obj: unknown) => obj is string | number | symbol) & import("./types.js").ReGuard < "keyof" > ;
  class: ((obj: unknown) => obj is import("./types.js").PseudoClass < string > | import("./types.js").PseudoClass < symbol > ) & import("./types.js").ReGuard < "class" > ;
  any: ((obj: unknown) => obj is unknown) & import("./types.js").ReGuard < "any" > ;
};
export declare function has < K extends KeyOf = KeyOf, T extends Types = Types, O extends Extra = {} > (obj: unknown, key: K | K[], typeName ? : T | T[], _oref ? : O): obj is Has < K, Type < T > , O > ;
export declare function are < K extends number, T extends Types, O extends Extra | unknown[] = {} > (obj: Extra | unknown[], typeName: T | T[], _oref ? : O): obj is O extends unknown[] ? Type < T > [] : Extra < K, Type < T >> ;
export declare const is: Is;
export declare function isReturn < R extends Types > (typeName: R): < A extends ArgOf > (obj: Callable < A > , ...args: A) => obj is Callable < A, TypeOf < R >> ;
