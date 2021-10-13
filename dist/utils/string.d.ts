import type {
  StringLike,
  StringJoin,
  ReadonlyInclude
} from './types.js';
export declare function join < T extends ReadonlyInclude < unknown[] > , D extends StringLike > (arr: T, delim ? : D): StringJoin < T, D > ;
