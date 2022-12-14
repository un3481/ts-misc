import { is } from '../../src/modules/guards'

describe('test PrimaryGuards', () => {

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
  });

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
});