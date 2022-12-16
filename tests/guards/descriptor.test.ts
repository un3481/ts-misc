import { is } from '../../src/modules/guards'
import { GuardDescriptor } from '../../src/modules/types';

describe('test SuperGuard from GuardDescriptor[object]', () => {

  // Custom Type
  type CustomUser = {
    id: number
    firstName: string
    lastName: string
    joined?: Date
    active: boolean
    foo: "bar"
  };

  // Create a Type-Guard for Custom Type
  const isCustomUser = is({
    id: is.number,
    firstName: is.string,
    lastName: is.string,
    joined: is.date.opt,
    active: is.boolean,
    foo: (obj: unknown): obj is "bar" => { return obj === 'bar' }
  });

  // Examples of objects with Custom Type
  const example1 = {
    id: 342,
    firstName: "Jhon",
    lastName: "Smith",
    active: true,
    foo: "bar"
  };
  const example2 = {
    id: 756,
    firstName: "David",
    lastName: "Richard",
    joined: new Date("2013-08-06"),
    active: false,
    foo: "bar"
  };

  const assertType1: (o) => o is CustomUser = isCustomUser;

  test('test TypeGuard[custom-type]', () => {
    expect( isCustomUser(null)         ).toBe( false );
    expect( isCustomUser({})           ).toBe( false );
    expect( isCustomUser([1, '2'])     ).toBe( false );
    expect( isCustomUser(1)            ).toBe( false );
    expect( isCustomUser('test')       ).toBe( false );
    expect( isCustomUser({foo: "bar"}) ).toBe( false );
    expect( isCustomUser(example1)     ).toBe( true  );
    expect( isCustomUser(example2)     ).toBe( true  );
  });

  const assertType2: (o) => o is CustomUser = is(isCustomUser);

  test('test SuperGuard[custom-type]', () => {
    expect( is(isCustomUser)(null)         ).toBe( false );
    expect( is(isCustomUser)({})           ).toBe( false );
    expect( is(isCustomUser)([1, '2'])     ).toBe( false );
    expect( is(isCustomUser)(1)            ).toBe( false );
    expect( is(isCustomUser)('test')       ).toBe( false );
    expect( is(isCustomUser)({foo: "bar"}) ).toBe( false );
    expect( is(isCustomUser)(example1)     ).toBe( true  );
    expect( is(isCustomUser)(example2)     ).toBe( true  );
  });

  const assertType3: (o) => o is CustomUser | string = is(isCustomUser).or.string;

  test('test SuperGuard[custom-type | string]', () => {
    expect( is(isCustomUser).or.string(null)         ).toBe( false );
    expect( is(isCustomUser).or.string({})           ).toBe( false );
    expect( is(isCustomUser).or.string([1, '2'])     ).toBe( false );
    expect( is(isCustomUser).or.string(1)            ).toBe( false );
    expect( is(isCustomUser).or.string('test')       ).toBe( true  );
    expect( is(isCustomUser).or.string({foo: "bar"}) ).toBe( false );
    expect( is(isCustomUser).or.string(example1)     ).toBe( true  );
    expect( is(isCustomUser).or.string(example2)     ).toBe( true  );
  });

  const assertType4: (o) => o is number | CustomUser = is.number.or(isCustomUser);

  test('test SuperGuard[number | custom-type]', () => {
    expect( is.number.or(isCustomUser)(null)         ).toBe( false );
    expect( is.number.or(isCustomUser)({})           ).toBe( false );
    expect( is.number.or(isCustomUser)([1, '2'])     ).toBe( false );
    expect( is.number.or(isCustomUser)(1)            ).toBe( true  );
    expect( is.number.or(isCustomUser)('test')       ).toBe( false );
    expect( is.number.or(isCustomUser)({foo: "bar"}) ).toBe( false );
    expect( is.number.or(isCustomUser)(example1)     ).toBe( true  );
    expect( is.number.or(isCustomUser)(example2)     ).toBe( true  );
  });
})

describe('test SuperGuard from GuardDescriptor[array]', () => {

  // Custom Type
  type CustomTuple = readonly [
    number,
    string,
    Date | string,
    boolean,
    "foo"
  ];

  // Create a Type-Guard for Custom Type
  const isCustomTuple = is([
    is.number,
    is.string,
    is.date.or.string,
    is.boolean,
    (obj: unknown): obj is "foo" => { return obj === 'foo' }
  ] as const);

  // Examples of objects with Custom Type
  const example1 = [
    878,
    "example",
    new Date("2022-11-07"),
    true,
    "foo"
  ];
  const example2 = [
    291,
    "unit testing",
    "2022-06-23",
    false,
    "foo"
  ];

  const assertType1: (o) => o is CustomTuple = isCustomTuple;

  test('test TypeGuard[custom-type]', () => {
    expect( isCustomTuple(null)         ).toBe( false );
    expect( isCustomTuple({})           ).toBe( false );
    expect( isCustomTuple([])           ).toBe( false );
    expect( isCustomTuple([1, '2'])     ).toBe( false );
    expect( isCustomTuple(1)            ).toBe( false );
    expect( isCustomTuple('test')       ).toBe( false );
    expect( isCustomTuple({foo: "bar"}) ).toBe( false );
    expect( isCustomTuple(example1)     ).toBe( true  );
    expect( isCustomTuple(example2)     ).toBe( true  );
  });

  const assertType2: (o) => o is CustomTuple = is(isCustomTuple);

  test('test SuperGuard[custom-type]', () => {
    expect( is(isCustomTuple)(null)         ).toBe( false );
    expect( is(isCustomTuple)({})           ).toBe( false );
    expect( is(isCustomTuple)([])           ).toBe( false );
    expect( is(isCustomTuple)([1, '2'])     ).toBe( false );
    expect( is(isCustomTuple)(1)            ).toBe( false );
    expect( is(isCustomTuple)('test')       ).toBe( false );
    expect( is(isCustomTuple)({foo: "bar"}) ).toBe( false );
    expect( is(isCustomTuple)(example1)     ).toBe( true  );
    expect( is(isCustomTuple)(example2)     ).toBe( true  );
  });

  const assertType3: (o) => o is CustomTuple | string = is(isCustomTuple).or.string;

  test('test SuperGuard[custom-type | string]', () => {
    expect( is(isCustomTuple).or.string(null)         ).toBe( false );
    expect( is(isCustomTuple).or.string({})           ).toBe( false );
    expect( is(isCustomTuple).or.string([])           ).toBe( false );
    expect( is(isCustomTuple).or.string([1, '2'])     ).toBe( false );
    expect( is(isCustomTuple).or.string(1)            ).toBe( false );
    expect( is(isCustomTuple).or.string('test')       ).toBe( true  );
    expect( is(isCustomTuple).or.string({foo: "bar"}) ).toBe( false );
    expect( is(isCustomTuple).or.string(example1)     ).toBe( true  );
    expect( is(isCustomTuple).or.string(example2)     ).toBe( true  );
  });

  const assertType4: (o) => o is number | CustomTuple = is.number.or(isCustomTuple);

  test('test SuperGuard[number | custom-type]', () => {
    expect( is.number.or(isCustomTuple)(null)         ).toBe( false );
    expect( is.number.or(isCustomTuple)({})           ).toBe( false );
    expect( is.number.or(isCustomTuple)([])           ).toBe( false );
    expect( is.number.or(isCustomTuple)([1, '2'])     ).toBe( false );
    expect( is.number.or(isCustomTuple)(1)            ).toBe( true  );
    expect( is.number.or(isCustomTuple)('test')       ).toBe( false );
    expect( is.number.or(isCustomTuple)({foo: "bar"}) ).toBe( false );
    expect( is.number.or(isCustomTuple)(example1)     ).toBe( true  );
    expect( is.number.or(isCustomTuple)(example2)     ).toBe( true  );
  });
})

describe('test SuperGuard from inline GuardDescriptor[object]', () => {

  // Custom Type
  type CustomRecord = {
    id: number
    token: string
    success?: boolean
    done?: boolean
  };

  // Create a Type-Guard for Custom Type
  const customRecord = {
    id: is.number,
    token: is.string,
    success: is.boolean.opt,
    done: is.boolean.opt
  };

  // Examples of objects with Custom Type
  const example1 = {
    id: 758,
    token: "U78545FXSA",
    done: false,
  };
  const example2 = {
    id: 758,
    token: "U355XNTYSA",
    done: true,
    success: true
  };

  const assertType1: GuardDescriptor<CustomRecord> = customRecord;
  
  const assertType2: (o) => o is CustomRecord = is(customRecord);

  test('test SuperGuard[custom-type]', () => {
    expect( is(customRecord)(null)         ).toBe( false );
    expect( is(customRecord)({})           ).toBe( false );
    expect( is(customRecord)([1, '2'])     ).toBe( false );
    expect( is(customRecord)(1)            ).toBe( false );
    expect( is(customRecord)('test')       ).toBe( false );
    expect( is(customRecord)({foo: "bar"}) ).toBe( false );
    expect( is(customRecord)(example1)     ).toBe( true  );
    expect( is(customRecord)(example2)     ).toBe( true  );
  });

  const assertType3: (o) => o is CustomRecord | string = is(customRecord).or.string;

  test('test SuperGuard[custom-type or string]', () => {
    expect( is(customRecord).or.string(null)         ).toBe( false );
    expect( is(customRecord).or.string({})           ).toBe( false );
    expect( is(customRecord).or.string([1, '2'])     ).toBe( false );
    expect( is(customRecord).or.string(1)            ).toBe( false );
    expect( is(customRecord).or.string('test')       ).toBe( true  );
    expect( is(customRecord).or.string({foo: "bar"}) ).toBe( false );
    expect( is(customRecord).or.string(example1)     ).toBe( true  );
    expect( is(customRecord).or.string(example2)     ).toBe( true  );
  });

  const assertType4: (o) => o is number | CustomRecord = is.number.or(customRecord);

  test('test SuperGuard[number or custom-type]', () => {
    expect( is.number.or(customRecord)(null)         ).toBe( false );
    expect( is.number.or(customRecord)({})           ).toBe( false );
    expect( is.number.or(customRecord)([1, '2'])     ).toBe( false );
    expect( is.number.or(customRecord)(1)            ).toBe( true  );
    expect( is.number.or(customRecord)('test')       ).toBe( false );
    expect( is.number.or(customRecord)({foo: "bar"}) ).toBe( false );
    expect( is.number.or(customRecord)(example1)     ).toBe( true  );
    expect( is.number.or(customRecord)(example2)     ).toBe( true  );
  });
})