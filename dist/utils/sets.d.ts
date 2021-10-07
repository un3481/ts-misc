import {
  Extra,
  KeyOf,
  ValueOf,
  ReadonlyIncluded
} from './types.js';
export declare function rand < T extends ValueOf > (arr: ReadonlyIncluded < Extra < KeyOf, T > | Array < T >> ): T;
export declare function generate < T > (obj: T, replacer ? : (key: KeyOf, value: unknown) => unknown): T;
export declare function serialize < T > (obj: T): T;
