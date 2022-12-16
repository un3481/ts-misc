import { is } from '../../src/modules/guards'

describe('test PrimaryGuards', () => {

  const assertType1: (o) => o is undefined = is.undefined;

  test('test PrimaryGuards[undefined]', () => {
    expect( is.undefined(null)         ).toBe( false );
    expect( is.undefined(undefined)    ).toBe( true  );
    expect( is.undefined({})           ).toBe( false );
    expect( is.undefined({foo: 'bar'}) ).toBe( false );
    expect( is.undefined(0)            ).toBe( false );
    expect( is.undefined(1)            ).toBe( false );
    expect( is.undefined('')           ).toBe( false );
    expect( is.undefined('1')          ).toBe( false );
  });

  const assertType2: (o) => o is string = is.string;

  test('test PrimaryGuards[string]', () => {
    expect( is.string(null)            ).toBe( false );
    expect( is.string(undefined)       ).toBe( false );
    expect( is.string({})              ).toBe( false );
    expect( is.string({foo: 'bar'})    ).toBe( false );
    expect( is.string([])              ).toBe( false );
    expect( is.string(1)               ).toBe( false );
    expect( is.string('1')             ).toBe( true  );
    expect( is.string('')              ).toBe( true  );
    expect( is.string(String(1))       ).toBe( true  );
    expect( is.string(String('1'))     ).toBe( true  );
    expect( is.string(new String(1))   ).toBe( true  );
    expect( is.string(new String('1')) ).toBe( true  );
  });

  const assertType3: (o) => o is number = is.number;

  test('test PrimaryGuards[number]', () => {
    expect( is.number(null)            ).toBe( false );
    expect( is.number(undefined)       ).toBe( false );
    expect( is.number({})              ).toBe( false );
    expect( is.number({foo: 'bar'})    ).toBe( false );
    expect( is.number([])              ).toBe( false );
    expect( is.number('1')             ).toBe( false );
    expect( is.number(1)               ).toBe( true  );
    expect( is.number(0)               ).toBe( true  );
    expect( is.number(Number(1))       ).toBe( true  );
    expect( is.number(Number('1'))     ).toBe( true  );
    expect( is.number(new Number(1))   ).toBe( true  );
    expect( is.number(new Number('1')) ).toBe( true  );
    expect( is.number(BigInt(1))       ).toBe( false );
    expect( is.number(BigInt('1'))     ).toBe( false );
  });

  const assertType4: (o) => o is bigint = is.bigint;

  test('test PrimaryGuards[bigint]', () => {
    expect( is.bigint(null)            ).toBe( false );
    expect( is.bigint(undefined)       ).toBe( false );
    expect( is.bigint({})              ).toBe( false );
    expect( is.bigint({foo: 'bar'})    ).toBe( false );
    expect( is.bigint([])              ).toBe( false );
    expect( is.bigint('1')             ).toBe( false );
    expect( is.bigint(1)               ).toBe( false );
    expect( is.bigint(0)               ).toBe( false );
    expect( is.bigint(Number(1))       ).toBe( false );
    expect( is.bigint(Number('1'))     ).toBe( false );
    expect( is.bigint(new Number(1))   ).toBe( false );
    expect( is.bigint(new Number('1')) ).toBe( false );
    expect( is.bigint(BigInt(1))       ).toBe( true  );
    expect( is.bigint(BigInt('1'))     ).toBe( true  );
  });

  const assertType5: (o) => o is symbol = is.symbol;

  test('test PrimaryGuards[symbol]', () => {
    expect( is.symbol(null)               ).toBe( false );
    expect( is.symbol(undefined)          ).toBe( false );
    expect( is.symbol({})                 ).toBe( false );
    expect( is.symbol({foo: 'bar'})       ).toBe( false );
    expect( is.symbol([])                 ).toBe( false );
    expect( is.symbol('1')                ).toBe( false );
    expect( is.symbol(1)                  ).toBe( false );
    expect( is.symbol(Symbol('foo'))      ).toBe( true  );
    expect( is.symbol(Symbol(42))         ).toBe( true  );
    expect( is.symbol(Symbol.iterator)    ).toBe( true  );
    expect( is.symbol(Symbol.hasInstance) ).toBe( true  );
  });

  const assertType6: (o) => o is {} = is.object;

  test('test PrimaryGuards[object]', () => {
    expect( is.object(null)            ).toBe( false );
    expect( is.object(undefined)       ).toBe( false );
    expect( is.object({})              ).toBe( true  );
    expect( is.object({foo: 'bar'})    ).toBe( true  );
    expect( is.object([])              ).toBe( true  );
    expect( is.object('1')             ).toBe( false );
    expect( is.object(1)               ).toBe( false );
    expect( is.object(Symbol('foo'))   ).toBe( false );
    expect( is.object(Symbol(42))      ).toBe( false );
    expect( is.object(BigInt(1))       ).toBe( false );
    expect( is.object(BigInt('1'))     ).toBe( false );
    expect( is.object(Number(1))       ).toBe( false );
    expect( is.object(Number('1'))     ).toBe( false );
    expect( is.object(new Number(1))   ).toBe( true  );
    expect( is.object(new Number('1')) ).toBe( true  );
    expect( is.object(String(1))       ).toBe( false );
    expect( is.object(String('1'))     ).toBe( false );
    expect( is.object(new String(1))   ).toBe( true  );
    expect( is.object(new String('1')) ).toBe( true  );
  });

  const assertType7: (o) => o is boolean = is.boolean;

  test('test PrimaryGuards[boolean]', () => {
    expect( is.boolean(null)         ).toBe( false );
    expect( is.boolean(undefined)    ).toBe( false );
    expect( is.boolean({})           ).toBe( false );
    expect( is.boolean({foo: 'bar'}) ).toBe( false );
    expect( is.boolean([])           ).toBe( false );
    expect( is.boolean('1')          ).toBe( false );
    expect( is.boolean(1)            ).toBe( false );
    expect( is.boolean(0)            ).toBe( false );
    expect( is.boolean(true)         ).toBe( true  );
    expect( is.boolean(false)        ).toBe( true  );
    expect( is.boolean(1 + 1 == 2)   ).toBe( true  );
  });

  const anonymous = (() => null);
  function named() { return null };

  const assertType8: (o) => o is ((...args: unknown[]) => unknown) = is.function;

  test('test PrimaryGuards[function]', () => {
    expect( is.function(null)         ).toBe( false );
    expect( is.function(undefined)    ).toBe( false );
    expect( is.function({})           ).toBe( false );
    expect( is.function({foo: 'bar'}) ).toBe( false );
    expect( is.function([])           ).toBe( false );
    expect( is.function('1')          ).toBe( false );
    expect( is.function(1)            ).toBe( false );
    expect( is.function(() => null)   ).toBe( true  );
    expect( is.function(anonymous)    ).toBe( true  );
    expect( is.function(named)        ).toBe( true  );
  });
});