import { is } from '../../src/modules/guards'
import { Types } from '../../src/modules/types';

describe('test ExtendedGuards', () => {

  const assertType1: (o) => o is unknown = is.any;

  test('test ExtendedGuards[any]', () => {
    expect( is.any(null) ).toBe( true );
    expect( is.any({})   ).toBe( true );
    expect( is.any(1)    ).toBe( true );
    expect( is.any('')   ).toBe( true );
  });

  const assertType2: (o) => o is never = is.never;

  test('test ExtendedGuards[never]', () => {
    expect( is.never(null) ).toBe( false );
    expect( is.never({})   ).toBe( false );
    expect( is.never(1)    ).toBe( false );
    expect( is.never('')   ).toBe( false );
  });

  const assertType3: (o) => o is unknown = is.unknown;

  test('test ExtendedGuards[unknown]', () => {
    expect( is.unknown(null) ).toBe( true );
    expect( is.unknown({})   ).toBe( true );
    expect( is.unknown(1)    ).toBe( true );
    expect( is.unknown('')   ).toBe( true );
  });

  const assertType4: (o) => o is null = is.null;

  test('test ExtendedGuards[null]', () => {
    expect( is.null(null)         ).toBe( true  );
    expect( is.null(undefined)    ).toBe( false );
    expect( is.null({})           ).toBe( false );
    expect( is.null({foo: 'bar'}) ).toBe( false );
    expect( is.null(0)            ).toBe( false );
    expect( is.null(1)            ).toBe( false );
    expect( is.null('')           ).toBe( false );
    expect( is.null('1')          ).toBe( false );
  });

  const assertType5: (o) => o is true = is.true;

  test('test ExtendedGuards[true]', () => {
    expect( is.true(null)   ).toBe( false );
    expect( is.true({})     ).toBe( false );
    expect( is.true(0)      ).toBe( false );
    expect( is.true(1)      ).toBe( false );
    expect( is.true('')     ).toBe( false );
    expect( is.true('true') ).toBe( false );
    expect( is.true(true)   ).toBe( true  );
    expect( is.true(false)  ).toBe( false );
  });

  const assertType6: (o) => o is false = is.false;

  test('test ExtendedGuards[false]', () => {
    expect( is.false(null)    ).toBe( false );
    expect( is.false({})      ).toBe( false );
    expect( is.false(0)       ).toBe( false );
    expect( is.false(1)       ).toBe( false );
    expect( is.false('')      ).toBe( false );
    expect( is.false('false') ).toBe( false );
    expect( is.false(true)    ).toBe( false );
    expect( is.false(false)   ).toBe( true  );
  });

  const assertType7: (o) => o is unknown[] = is.array;

  test('test ExtendedGuards[array]', () => {
    expect( is.array(null)                ).toBe( false );
    expect( is.array({})                  ).toBe( false );
    expect( is.array(1)                   ).toBe( false );
    expect( is.array('')                  ).toBe( false );
    expect( is.array('text')              ).toBe( false );
    expect( is.array([])                  ).toBe( true  );
    expect( is.array(['1', 2])            ).toBe( true  );
    expect( is.array(Array(3))            ).toBe( true  );
    expect( is.array(Array([1, 2]))       ).toBe( true  );
    expect( is.array(new Array(2))        ).toBe( true  );
    expect( is.array(new Array([1, '2'])) ).toBe( true  );
  });

  const assertType8: (o) => o is Date = is.date;

  test('test ExtendedGuards[date]', () => {
    expect( is.date(null)                   ).toBe( false );
    expect( is.date({})                     ).toBe( false );
    expect( is.date(1)                      ).toBe( false );
    expect( is.date('')                     ).toBe( false );
    expect( is.date('1')                    ).toBe( false );
    expect( is.date(Date())                 ).toBe( false );
    expect( is.date(new Date())             ).toBe( true  );
    expect( is.date(new Date("2022-03-25")) ).toBe( true  );
  });

  const assertType9: (o) => o is Error = is.error;

  test('test ExtendedGuards[error]', () => {
    expect( is.error(null)              ).toBe( false );
    expect( is.error({})                ).toBe( false );
    expect( is.error(1)                 ).toBe( false );
    expect( is.error('')                ).toBe( false );
    expect( is.error('1')               ).toBe( false );
    expect( is.error(Error())           ).toBe( true  );
    expect( is.error(new Error())       ).toBe( true  );
    expect( is.error(new Error("test")) ).toBe( true  );
  });

  const assertType10: (o) => o is RegExp = is.regexp;

  test('test ExtendedGuards[regexp]', () => {
    expect( is.regexp(null)             ).toBe( false );
    expect( is.regexp({})               ).toBe( false );
    expect( is.regexp(1)                ).toBe( false );
    expect( is.regexp('')               ).toBe( false );
    expect( is.regexp('1')              ).toBe( false );
    expect( is.regexp(/\s/)             ).toBe( true  );
    expect( is.regexp(RegExp('\s'))     ).toBe( true  );
    expect( is.regexp(RegExp(/\s/))     ).toBe( true  );
    expect( is.regexp(new RegExp('\s')) ).toBe( true  );
    expect( is.regexp(new RegExp(/\s/)) ).toBe( true  );
  });

  const assertType11: (o) => o is Promise<unknown> = is.promise;

  test('test ExtendedGuards[promise]', async () => {
    const example = new Promise(r => r(null));

    expect( is.promise(null)                     ).toBe( false );
    expect( is.promise({})                       ).toBe( false );
    expect( is.promise(1)                        ).toBe( false );
    expect( is.promise('')                       ).toBe( false );
    expect( is.promise('1')                      ).toBe( false );
    expect( is.promise(Promise)                  ).toBe( false );
    expect( is.promise(example)                  ).toBe( true  );
    expect( is.promise(example.then(v => null))  ).toBe( true  );
    expect( is.promise(example.catch(e => null)) ).toBe( true  );
    expect( is.promise(await example)            ).toBe( false );
  });

  const assertType12: (o) => o is Types = is.typeof;

  test('test ExtendedGuards[typeof]', () => {
    expect( is.typeof(null)      ).toBe( false );
    expect( is.typeof({})        ).toBe( false );
    expect( is.typeof(1)         ).toBe( false );
    expect( is.typeof('')        ).toBe( false );
    expect( is.typeof('foo')     ).toBe( false );
    expect( is.typeof('string')  ).toBe( true  );
    expect( is.typeof('number')  ).toBe( true  );
    expect( is.typeof('promise') ).toBe( true  );
    expect( is.typeof('time')    ).toBe( false );
  });

  const assertType13: (o) => o is (string | number | symbol) = is.keyof;

  test('test ExtendedGuards[keyof]', () => {
    expect( is.keyof(null)            ).toBe( false );
    expect( is.keyof({})              ).toBe( false );
    expect( is.keyof([])              ).toBe( false );
    expect( is.keyof(1)               ).toBe( true  );
    expect( is.keyof('')              ).toBe( true  );
    expect( is.keyof('foo')           ).toBe( true  );
    expect( is.keyof('bar')           ).toBe( true  );
    expect( is.keyof('1')             ).toBe( true  );
    expect( is.keyof(Symbol('foo'))   ).toBe( true  );
    expect( is.keyof(Symbol.iterator) ).toBe( true  );
  });
})