import { is } from '../../src/modules/guards'

describe('test ExtendedGuards', () => {

  test('test ExtendedGuards[any]', () => {
    expect( is.any(null) ).toBe( true );
    expect( is.any({})   ).toBe( true );
    expect( is.any(1)    ).toBe( true );
    expect( is.any('')   ).toBe( true );
  });

  test('test ExtendedGuards[never]', () => {
    expect( is.never(null) ).toBe( false );
    expect( is.never({})   ).toBe( false );
    expect( is.never(1)    ).toBe( false );
    expect( is.never('')   ).toBe( false );
  });

  test('test ExtendedGuards[unknown]', () => {
    expect( is.unknown(null) ).toBe( true );
    expect( is.unknown({})   ).toBe( true );
    expect( is.unknown(1)    ).toBe( true );
    expect( is.unknown('')   ).toBe( true );
  });

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
})