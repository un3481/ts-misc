export declare type ValidatorTypes = 'string' | 'boolean' | 'number' | 'array' | 'string?' | 'boolean?' | 'number?';
export declare type ValidatorDefinition < T > = {
  [key in keyof T]: T[key] extends string ? 'string' | 'string?' : T[key] extends number ? 'number' | 'number?' : T[key] extends boolean ? 'boolean' | 'boolean?' : T[key] extends Array < infer TArrayItem > ? Array < ValidatorDefinition < TArrayItem >> : ValidatorTypes;
};
export declare function typeGuardFactory < T > (reference: ValidatorDefinition < T > ): (value: unknown) => value is T;
