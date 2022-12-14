import { is } from '../../src/modules/guards'

describe('test UnusualGuards', () => {

  test('test UnusualGuards[null]', () => {
    expect( is.null(null)         ).toBe( true  );
    expect( is.null(undefined)    ).toBe( false );
    expect( is.null({})           ).toBe( false );
    expect( is.null({foo: 'bar'}) ).toBe( false );
    expect( is.null(0)            ).toBe( false );
    expect( is.null(1)            ).toBe( false );
    expect( is.null('')           ).toBe( false );
    expect( is.null('1')          ).toBe( false );
  });
})