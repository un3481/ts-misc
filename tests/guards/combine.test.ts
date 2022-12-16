import { is } from '../../src/modules/guards'

describe('test SuperGuard combined', () => {

  const assertType1: (o) => o is number | string = is.number.or.string;

  test('test SuperGuard[number | string]', () => {
    expect( is.number.or.string(null)        ).toBe( false );
    expect( is.number.or.string({})          ).toBe( false );
    expect( is.number.or.string(0)           ).toBe( true  );
    expect( is.number.or.string(1)           ).toBe( true  );
    expect( is.number.or.string('')          ).toBe( true  );
    expect( is.number.or.string('test')      ).toBe( true  );
    expect( is.number.or.string(Number('1')) ).toBe( true  );
    expect( is.number.or.string(new Date())  ).toBe( false );
  });

  const assertType2: (o) => o is unknown[] | number = is.array.or.number;

  test('test SuperGuard[unknown[] | number]', () => {
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

  const assertType3: (o) => o is number | string | {} = is.number.or.string.or.object;

  test('test SuperGuard[number | string]', () => {
    expect( is.number.or.string.or.object(null)        ).toBe( false );
    expect( is.number.or.string.or.object({})          ).toBe( true  );
    expect( is.number.or.string.or.object(0)           ).toBe( true  );
    expect( is.number.or.string.or.object(1)           ).toBe( true  );
    expect( is.number.or.string.or.object('')          ).toBe( true  );
    expect( is.number.or.string.or.object('test')      ).toBe( true  );
    expect( is.number.or.string.or.object(Number('1')) ).toBe( true  );
    expect( is.number.or.string.or.object(new Date())  ).toBe( true  );
  });
})

describe('test SuperGuard iterator', () => {

  const assertType1: (o) => o is string[] = is.array.of.string;

  test('test SuperGuard[string[]]', () => {
    expect( is.array.of.string(null)            ).toBe( false );
    expect( is.array.of.string({})              ).toBe( false );
    expect( is.array.of.string(0)               ).toBe( false );
    expect( is.array.of.string(1)               ).toBe( false );
    expect( is.array.of.string('')              ).toBe( false );
    expect( is.array.of.string('test')          ).toBe( false );
    expect( is.array.of.string([1, '2'])        ).toBe( false );
    expect( is.array.of.string([1, 5, 3])       ).toBe( false );
    expect( is.array.of.string(['a', '4', 'e']) ).toBe( true  );
  });

  const assertType2: (o) => o is number | string[] = is.number.or.array.of.string;

  test('test SuperGuard[number | string[]]', () => {
    expect( is.number.or.array.of.string(null)            ).toBe( false );
    expect( is.number.or.array.of.string({})              ).toBe( false );
    expect( is.number.or.array.of.string(0)               ).toBe( true  );
    expect( is.number.or.array.of.string(1)               ).toBe( true  );
    expect( is.number.or.array.of.string('')              ).toBe( false );
    expect( is.number.or.array.of.string('test')          ).toBe( false );
    expect( is.number.or.array.of.string([1, '2'])        ).toBe( false );
    expect( is.number.or.array.of.string([1, 5, 3])       ).toBe( false );
    expect( is.number.or.array.of.string(['a', '4', 'e']) ).toBe( true  );
  });

  const assertType3: (o) => o is string[] | number = is.array.of.string.or.number;

  test('test SuperGuard[string[] | number]', () => {
    expect( is.array.of.string.or.number(null)            ).toBe( false );
    expect( is.array.of.string.or.number({})              ).toBe( false );
    expect( is.array.of.string.or.number(0)               ).toBe( true  );
    expect( is.array.of.string.or.number(1)               ).toBe( true  );
    expect( is.array.of.string.or.number('')              ).toBe( false );
    expect( is.array.of.string.or.number('test')          ).toBe( false );
    expect( is.array.of.string.or.number([1, '2'])        ).toBe( false );
    expect( is.array.of.string.or.number([1, 5, 3])       ).toBe( false );
    expect( is.array.of.string.or.number(['a', '4', 'e']) ).toBe( true  );
  });

  const assertType4: (o) => o is number[] = is.array.of.number;

  test('test SuperGuard[number[]]', () => {
    expect( is.array.of.number(null)            ).toBe( false );
    expect( is.array.of.number({})              ).toBe( false );
    expect( is.array.of.number(0)               ).toBe( false );
    expect( is.array.of.number(1)               ).toBe( false );
    expect( is.array.of.number('')              ).toBe( false );
    expect( is.array.of.number('test')          ).toBe( false );
    expect( is.array.of.number([1, '2'])        ).toBe( false );
    expect( is.array.of.number([1, 5, 3])       ).toBe( true  );
    expect( is.array.of.number(['a', '4', 'e']) ).toBe( false );
  });

  const assertType5: (o) => o is string | number[] = is.string.or.array.of.number;

  test('test SuperGuard[string | number[]]', () => {
    expect( is.string.or.array.of.number(null)            ).toBe( false );
    expect( is.string.or.array.of.number({})              ).toBe( false );
    expect( is.string.or.array.of.number(0)               ).toBe( false );
    expect( is.string.or.array.of.number(1)               ).toBe( false );
    expect( is.string.or.array.of.number('')              ).toBe( true  );
    expect( is.string.or.array.of.number('test')          ).toBe( true  );
    expect( is.string.or.array.of.number([1, '2'])        ).toBe( false );
    expect( is.string.or.array.of.number([1, 5, 3])       ).toBe( true  );
    expect( is.string.or.array.of.number(['a', '4', 'e']) ).toBe( false );
  });

  const assertType6: (o) => o is number[] | string = is.array.of.number.or.string;

  test('test SuperGuard[number[] | string]', () => {
    expect( is.array.of.number.or.string(null)            ).toBe( false );
    expect( is.array.of.number.or.string({})              ).toBe( false );
    expect( is.array.of.number.or.string(0)               ).toBe( false );
    expect( is.array.of.number.or.string(1)               ).toBe( false );
    expect( is.array.of.number.or.string('')              ).toBe( true  );
    expect( is.array.of.number.or.string('test')          ).toBe( true  );
    expect( is.array.of.number.or.string([1, '2'])        ).toBe( false );
    expect( is.array.of.number.or.string([1, 5, 3])       ).toBe( true  );
    expect( is.array.of.number.or.string(['a', '4', 'e']) ).toBe( false );
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

  // Examples of objects with Custom Type
  const example1: unknown = {hello: "world"};
  const example2: unknown = [example1, example1, example1];

  test('test TypeGuard[custom-type]', () => {
    expect( isHelloWorld(null)           ).toBe( false );
    expect( isHelloWorld({})             ).toBe( false );
    expect( isHelloWorld([1, '2'])       ).toBe( false );
    expect( isHelloWorld(1)              ).toBe( false );
    expect( isHelloWorld('test')         ).toBe( false );
    expect( isHelloWorld({foo: "bar"})   ).toBe( false );
    expect( isHelloWorld({hello: "foo"}) ).toBe( false );
    expect( isHelloWorld(example1)       ).toBe( true  );
    expect( isHelloWorld(example2)       ).toBe( false );
  });

  const assertType1: (o) => o is HelloWorld = is(isHelloWorld);

  test('test SuperGuard[custom-type]', () => {
    expect( is(isHelloWorld)(null)           ).toBe( false );
    expect( is(isHelloWorld)({})             ).toBe( false );
    expect( is(isHelloWorld)([1, '2'])       ).toBe( false );
    expect( is(isHelloWorld)(1)              ).toBe( false );
    expect( is(isHelloWorld)('test')         ).toBe( false );
    expect( is(isHelloWorld)({foo: "bar"})   ).toBe( false );
    expect( is(isHelloWorld)({hello: "foo"}) ).toBe( false );
    expect( is(isHelloWorld)(example1)       ).toBe( true  );
    expect( is(isHelloWorld)(example2)       ).toBe( false );
  });

  const assertType2: (o) => o is HelloWorld | string = is(isHelloWorld).or.string;

  test('test SuperGuard[custom-type | string]', () => {
    expect( is(isHelloWorld).or.string(null)           ).toBe( false );
    expect( is(isHelloWorld).or.string({})             ).toBe( false );
    expect( is(isHelloWorld).or.string([1, '2'])       ).toBe( false );
    expect( is(isHelloWorld).or.string(1)              ).toBe( false );
    expect( is(isHelloWorld).or.string('test')         ).toBe( true  );
    expect( is(isHelloWorld).or.string({foo: "bar"})   ).toBe( false );
    expect( is(isHelloWorld).or.string({hello: "foo"}) ).toBe( false );
    expect( is(isHelloWorld).or.string(example1)       ).toBe( true  );
    expect( is(isHelloWorld).or.string(example2)       ).toBe( false );
  });

  const assertType3: (o) => o is number | HelloWorld = is.number.or(isHelloWorld);

  test('test SuperGuard[number | custom-type]', () => {
    expect( is.number.or(isHelloWorld)(null)           ).toBe( false );
    expect( is.number.or(isHelloWorld)({})             ).toBe( false );
    expect( is.number.or(isHelloWorld)([1, '2'])       ).toBe( false );
    expect( is.number.or(isHelloWorld)(1)              ).toBe( true  );
    expect( is.number.or(isHelloWorld)('test')         ).toBe( false );
    expect( is.number.or(isHelloWorld)({foo: "bar"})   ).toBe( false );
    expect( is.number.or(isHelloWorld)({hello: "foo"}) ).toBe( false );
    expect( is.number.or(isHelloWorld)(example1)       ).toBe( true  );
    expect( is.number.or(isHelloWorld)(example2)       ).toBe( false );
  });

  const assertType4: (o) => o is HelloWorld[] = is.array.of(isHelloWorld);

  test('test SuperGuard[custom-type[]]', () => {
    expect( is.array.of(isHelloWorld)(null)           ).toBe( false );
    expect( is.array.of(isHelloWorld)({})             ).toBe( false );
    expect( is.array.of(isHelloWorld)([1, '2'])       ).toBe( false );
    expect( is.array.of(isHelloWorld)(1)              ).toBe( false );
    expect( is.array.of(isHelloWorld)('test')         ).toBe( false );
    expect( is.array.of(isHelloWorld)({foo: "bar"})   ).toBe( false );
    expect( is.array.of(isHelloWorld)({hello: "foo"}) ).toBe( false );
    expect( is.array.of(isHelloWorld)(example1)       ).toBe( false );
    expect( is.array.of(isHelloWorld)(example2)       ).toBe( true  );
  });

  const assertType5: (o) => o is HelloWorld[] | string = is.array.of(isHelloWorld).or.string;

  test('test SuperGuard[custom-type[] | string]', () => {
    expect( is.array.of(isHelloWorld).or.string(null)           ).toBe( false );
    expect( is.array.of(isHelloWorld).or.string({})             ).toBe( false );
    expect( is.array.of(isHelloWorld).or.string([1, '2'])       ).toBe( false );
    expect( is.array.of(isHelloWorld).or.string(1)              ).toBe( false );
    expect( is.array.of(isHelloWorld).or.string('test')         ).toBe( true  );
    expect( is.array.of(isHelloWorld).or.string({foo: "bar"})   ).toBe( false );
    expect( is.array.of(isHelloWorld).or.string({hello: "foo"}) ).toBe( false );
    expect( is.array.of(isHelloWorld).or.string(example1)       ).toBe( false );
    expect( is.array.of(isHelloWorld).or.string(example2)       ).toBe( true  );
  });

  const assertType6: (o) => o is number | HelloWorld[] = is.number.or.array.of(isHelloWorld);

  test('test SuperGuard[number | custom-type[]]', () => {
    expect( is.number.or.array.of(isHelloWorld)(null)           ).toBe( false );
    expect( is.number.or.array.of(isHelloWorld)({})             ).toBe( false );
    expect( is.number.or.array.of(isHelloWorld)([1, '2'])       ).toBe( false );
    expect( is.number.or.array.of(isHelloWorld)(1)              ).toBe( true  );
    expect( is.number.or.array.of(isHelloWorld)('test')         ).toBe( false );
    expect( is.number.or.array.of(isHelloWorld)({foo: "bar"})   ).toBe( false );
    expect( is.number.or.array.of(isHelloWorld)({hello: "foo"}) ).toBe( false );
    expect( is.number.or.array.of(isHelloWorld)(example1)       ).toBe( false );
    expect( is.number.or.array.of(isHelloWorld)(example2)       ).toBe( true  );
  });
})