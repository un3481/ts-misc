export declare type Extends < A, B > = A extends B ? true : false;
export declare type CheckBool < B extends true > = As < B > ;
export declare type As < T > = T;
export declare type Intersect < U extends unknown > = As < (U extends unknown ? (...args: U[]) => void : never) extends(...args: As < infer A > []) => void ? As < A > : never > ;
export declare type Join < T extends unknown > = As < [
  Intersect < T >
] extends[infer I] ? I extends never ? never : I extends Extra ? {
  [K in KeyOf < I > ]: I[K];
} : never : never > ;
export declare type And < T extends unknown > = As < [
  Intersect < T >
] extends[infer I] ? I extends never ? never : I extends Extra ? Join < I > : I : never > ;
export declare type ReadonlyIncluded < T > = T | Readonly < T > ;
export declare type LastOf < T > = As < And < T extends unknown ? () => T : never > extends() => infer R ? R : never > ;
export declare type Push < T extends unknown[], V > = As < [...T, V] > ;
export declare type TupleOf < T = never, L = LastOf < T > , N = [T] extends[never] ? true : false > = As < true extends N ? [] : Push < TupleOf < Exclude < T, L >> , L >> ;
export declare type New < C extends Constructor > = ReturnOf < C > ;
export interface Constructor < N extends string | symbol = string | symbol > {
  [Symbol.hasInstance]: Callable < [instance: unknown],
  boolean > ;
  name: N extends string ? N : string;
  (...args: ArgOf): unknown;
}
declare const primaryPrototype: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
export declare type PrimaryTypes = typeof primaryPrototype;
export declare type UnusualTypes = keyof UnusualTypesEntries;
export declare type PrimaryTypesEntries = As < {
  string: string;
  number: number;
  bigint: bigint;
  boolean: boolean;
  symbol: symbol;
  undefined: undefined;
  object: AnySet;
  function: Callable;
} > ;
export declare type UnusualTypesEntries = As < {
  never: never;
  unknown: unknown;
  null: null;
  true: true;
  false: false;
  array: unknown[];
  promise: Promise < unknown > ;
  date: Date;
  regexp: RegExp;
  typeof: Types;
  keyof: KeyOf;
  class: Constructor;
  any: unknown;
} > ;
export declare type Types = As < PrimaryTypes | UnusualTypes > ;
export declare type PrimaryType < N extends PrimaryTypes = PrimaryTypes > = As < ValueOf < {
  [P in PrimaryTypes]: N extends P ? PrimaryTypesEntries[P] : never;
} >> ;
export declare type Type < N extends Types = Types > = As < N extends UnusualTypes ? ValueOf < {
  [P in UnusualTypes]: N extends P ? UnusualTypesEntries[P] : never;
} > : N extends PrimaryTypes ? PrimaryType < N > : never > ;
export declare type TypeOf < V extends unknown = unknown > = As < ValueOf < {
  [P in PrimaryTypes | UnusualTypes]: Type < P > extends infer T ? unknown extends T ? never : V extends T ? T extends V ? P : never : never : never;
} >> ;
export declare type TypeGuardShape < A extends ArgOf = ArgOf > = As < Callable < [obj: unknown, ...args: A], boolean >> ;
export declare type TypeGuard < T, A extends ArgOf = ArgOf > = As < (obj: unknown, ...args: A) => obj is T > ;
export declare type GuardOf < G extends TypeGuard < unknown >> = As < G extends TypeGuard < infer T > ? T : never > ;
export declare type IsType = < T extends Types > (obj: unknown, typeName: T | T[]) => obj is Type < T > ;
export declare type Guards < K extends Types = Types > = As < And < K extends Types ? Has < K, TypeGuard < Type < K > , [] >> : never >> ;
declare type GuardSetHas = < O = unknown, K extends KeyOf = KeyOf, T extends Types = Types > (obj: unknown, key: K | K[], typeName ? : T | T[]) => obj is Has < K, Type < T > , O > ;
declare type GuardSetEvery = < K extends KeyOf, T extends Types > (obj: Extra < K > , typeName: T | T[]) => obj is Extra < K, TypeOf < T >> ;
export declare type SuperGuards < K extends Types | 'in' | 'every' = Types | 'in' | 'every' > = As < And < K extends Types ? Guards < K > : {
  in: GuardSetHas;
  every: GuardSetEvery;
} >> ;
export interface Is extends SuperGuards, IsType {}
declare type KeyOfPrimary = keyof any;
export declare type KeyOf < T extends Extra = Extra > = As < T extends {
  [P in infer K]: unknown;
} ? K & keyof T : never > ;
export declare type ValueOf < T extends Extra = Extra > = As < T extends {
  [P in KeyOf]: infer V;
} ? V : never > ;
export declare type Entries < T extends {
  [P in KeyOf]: ValueOf;
} = {
  [P in KeyOf]: ValueOf;
} > = As < TupleOf < {
  [K in KeyOf < T > ]: [K, T[K]];
} [KeyOf < T > ] >> ;
export declare type EntrieOf < T extends[KeyOf, ValueOf][] = [KeyOf, ValueOf][] > = As < And < T extends(infer V)[] ? V extends[KeyOf, ValueOf] ? Has < V[0], V[1] > : never : never >> ;
export declare type StringSet < T = ValueOf > = As < {
  [x: string]: T;
} > ;
export declare type NumberSet < T = ValueOf > = As < {
  [x: number]: T;
} > ;
export declare type AnySet < T = unknown > = As < {
  [x: string]: T;
  [x: number]: T;
} > ;
export declare type Extra < K extends KeyOfPrimary = KeyOfPrimary, T = unknown > = As < {
  [P in K]: T;
} & AnySet < T >> ;
export declare type Has < K extends KeyOf, T extends ValueOf = ValueOf, O = unknown > = As < And < {
  [P in K]: T;
} & O >> ;
export declare type Callable < A extends unknown[] = unknown[], R = unknown > = As < (...args: A) => R > ;
export declare type ArgOf < F extends Callable = Callable > = As < F extends Callable < infer A > ? A : never > ;
export declare type ReturnOf < F extends Callable = Callable > = As < ReturnType < F >> ;
export declare type PromiseThen < T extends Promise < unknown >> = As < T extends PromiseLike < infer R > ? R : never > ;
export declare type AsyncThen < T extends Callable < ArgOf, Promise < unknown >>> = As < PromiseThen < ReturnOf < T >>> ;
export declare type Then < T > = As < T extends Promise < unknown > ? PromiseThen < T > : T extends Callable < ArgOf, Promise < unknown >> ? AsyncThen < T > : never > ;
export declare type PromiseAwait < T > = As < T extends Promise < unknown > ? PromiseAwait < PromiseThen < T >> : T > ;
export declare type Await < T > = As < T extends Promise < unknown > ? PromiseAwait < T > : T extends Callable < ArgOf, Promise < unknown >> ? PromiseAwait < ReturnOf < T >> : T > ;
export {};
