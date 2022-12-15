import { is } from '../../src/modules/guards'

describe('test SuperGuard combined', () => {

  test('test SuperGuard[number or string]', () => {
    expect( is.number.or.string(null)        ).toBe( false );
    expect( is.number.or.string({})          ).toBe( false );
    expect( is.number.or.string(0)           ).toBe( true  );
    expect( is.number.or.string(1)           ).toBe( true  );
    expect( is.number.or.string('')          ).toBe( true  );
    expect( is.number.or.string('test')      ).toBe( true  );
    expect( is.number.or.string(Number('1')) ).toBe( true  );
    expect( is.number.or.string(new Date())  ).toBe( false );
  });

  test('test SuperGuard[array or number]', () => {
    expect( is.array.or.number(null)        ).toBe( false );
    expect( is.array.or.number({})          ).toBe( false );
    expect( is.array.or.number([])          ).toBe( true  );
    expect( is.array.or.number([1, '2'])    ).toBe( true  );
    expect( is.array.or.number(0)           ).toBe( true  );
    expect( is.array.or.number(1)           ).toBe( true  );
    expect( is.array.or.number('')          ).toBe( false );
    expect( is.array.or.number('test')      ).toBe( false );
    expect( is.array.or.number(Number('1')) ).toBe( true  );
    expect( is.array.or.number(new Date())  ).toBe( false );
  });
})

describe('test SuperGuard combined with custom TypeGuard', () => {

  // Example of custom type
  type HelloWorld = { hello: "world" }
    
  // A standard Type-Guard for a custom type
  function isHelloWorld(obj: unknown): obj is HelloWorld {
    if (!obj) return false
    if (typeof obj != 'object') return false
    if (!('hello' in obj)) return false
    if (obj['hello'] != 'world') return false
    else return true
  }

  test('test TypeGuard[custom-type]', () => {
    expect( isHelloWorld(null)             ).toBe( false );
    expect( isHelloWorld({})               ).toBe( false );
    expect( isHelloWorld([1, '2'])         ).toBe( false );
    expect( isHelloWorld(1)                ).toBe( false );
    expect( isHelloWorld('test')           ).toBe( false );
    expect( isHelloWorld({foo: "bar"})     ).toBe( false );
    expect( isHelloWorld({hello: "foo"})   ).toBe( false );
    expect( isHelloWorld({hello: "world"}) ).toBe( true  );
  });

  test('test SuperGuard[custom-type]', () => {
    expect( is(isHelloWorld)(null)             ).toBe( false );
    expect( is(isHelloWorld)({})               ).toBe( false );
    expect( is(isHelloWorld)([1, '2'])         ).toBe( false );
    expect( is(isHelloWorld)(1)                ).toBe( false );
    expect( is(isHelloWorld)('test')           ).toBe( false );
    expect( is(isHelloWorld)({foo: "bar"})     ).toBe( false );
    expect( is(isHelloWorld)({hello: "foo"})   ).toBe( false );
    expect( is(isHelloWorld)({hello: "world"}) ).toBe( true  );
  });

  test('test SuperGuard[custom-type or string]', () => {
    expect( is(isHelloWorld).or.string(null)             ).toBe( false );
    expect( is(isHelloWorld).or.string({})               ).toBe( false );
    expect( is(isHelloWorld).or.string([1, '2'])         ).toBe( false );
    expect( is(isHelloWorld).or.string(1)                ).toBe( false );
    expect( is(isHelloWorld).or.string('test')           ).toBe( true  );
    expect( is(isHelloWorld).or.string({foo: "bar"})     ).toBe( false );
    expect( is(isHelloWorld).or.string({hello: "foo"})   ).toBe( false );
    expect( is(isHelloWorld).or.string({hello: "world"}) ).toBe( true  );
  });

  test('test SuperGuard[number or custom-type]', () => {
    expect( is.number.or(isHelloWorld)(null)             ).toBe( false );
    expect( is.number.or(isHelloWorld)({})               ).toBe( false );
    expect( is.number.or(isHelloWorld)([1, '2'])         ).toBe( false );
    expect( is.number.or(isHelloWorld)(1)                ).toBe( true  );
    expect( is.number.or(isHelloWorld)('test')           ).toBe( false );
    expect( is.number.or(isHelloWorld)({foo: "bar"})     ).toBe( false );
    expect( is.number.or(isHelloWorld)({hello: "foo"})   ).toBe( false );
    expect( is.number.or(isHelloWorld)({hello: "world"}) ).toBe( true  );
  });
})