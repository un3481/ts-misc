[![CI](https://github.com/un3481/ts-misc/actions/workflows/CI.yml/badge.svg)](https://github.com/un3481/ts-misc/actions/workflows/CI.yml)

# ts-misc
Typescript Miscellaneous Library

## Usage
The `ts-misc` package exports several utility modules for TypeScript.

For example, the `strings` module:

```typescript
import { strings } from 'ts-misc'

// Join strings preserving const Type
const words = ['hello', 'world'] as const
const result: "hello world" = strings.join(words, ' ')
```

## Super Guard
One of the main goals of this library is to make Type-Guards simple (while keeping them compile-time correct). This is accomplished by the use of the `is` export.

The `is` export is a Proxy object that generates Type-Guards programmatically and allows developers to modify and improve existing Type-Guards. The type for this export is `SuperGuard` because it adds new functionalities for the standard Type-Guards.

It can be used as following:

```typescript
import { is } from 'ts-misc'

// Example variable with unknown type
let example: unknown = 2

// Check type of object
if (is.number(example)) {
  console.log(`it's a number: ${example}`)
} else {
  console.log('this will never be logged')
}
```

Although it's main function is generating dynamic Type-Guards, the type definitions for those must be known at compile time, like any other type in TypeScript.

This module doesn't aim to create functionalities that TypeScript itself doesn't have, but it should make some of the existing ones simpler.

Some more examples:

```typescript
import { is } from 'ts-misc'

// Example variable with unknown type
let example: unknown = 'hello world'

// This will work
if (is.string(example)) {
  console.log(`it's a string: ${example}`)
}

// This will fail
if (is.number(example)) {
  console.log('this will never be logged')
}

// This works as well
if (is.number.or.string(example)) {
  console.log(`it's a number or a string: ${example}`)
}
```

### Using existing Type-Guards along with `SuperGuard`

Let's assume you've defined the following Type and Type-Guard:

```typescript
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
```

You could integrate both into `is` like the following:

```typescript
import { is } from 'ts-misc'

// Example variable with unknown type
let example: unknown = { hello: "world" }

// Using predefined Type-Guard will work
if (isHelloWorld(example)) {
  console.log(`it's a HelloWorld: ${example}`)
}

// This will fail
if (is.number(example)) {
  console.log('this will never be logged')
}

// This works as well
if (is.number.or(isHelloWorld)(example)) {
  console.log(`it's a number or a HelloWorld: ${example}`)
}
```

Using the `SuperGuard` object to extend existing Type-Guards will greatly reduce developing time and improve the readability of the code.

### Iterate over objects with `SuperGuard`

As shown before, the `is` Proxy allows you to combine multiple Type-Guards with the use of the `or` arttibute.

There are also other ways of combining Type-Guards, on of them is the `of` attribute, which is available for Type-Guards ending in `array` or `object`.

The `or` attribute allows you to interate through an object and check if all properties have the Type specified.

Let's see some examples:

```typescript
import { is } from 'ts-misc'

// Example variable with unknown type
let example: unknown = [56, 21, 3]

// Using array Type-Guard will work
if (is.array(example)) {
  console.log(`it's an array: ${example}`)
}

// This will fail
if (is.number(example)) {
  console.log('this will never be logged')
}

// This works as well
if (is.array.of.number(example)) {
  console.log(`it's an array of numbers: ${example}`)
}
```

The `of` attribute allows you to iterate over object enumerable keys as well, like the following:

```typescript
import { is } from 'ts-misc'

// Example variable with unknown type
let example: unknown = { foo: true, bar: false, test: true }

// Using object Type-Guard will work
if (is.object(example)) {
  console.log(`it's an array: ${example}`)
}

// This will fail
if (is.boolean(example)) {
  console.log('this will never be logged')
}

// This works as well
if (is.object.of.boolean(example)) {
  console.log(`it's an object containing only boolean values: ${example}`)
}
```

### Using a `GuardDescriptor` to genreate Type-Guards

Finnaly, there's one more function for the `is` Proxy, it can generate interface Type-Guards in a very intuitive and concise way using what's called a `GuardDescriptor`.

A `GuardDescriptor` is an object (or array) that contains only Type-Guards or other nested `GuardDescriptor` objects.

From this input, the `is` Proxy is capable of creating a precise interface guard in a dclarative way, instead of an imperative way like usual.

So, for example, for the following type:

```typescript
// Custom Type
type CustomUser = {
  id: number
  firstName: string
  lastName: string
  joined?: Date
  active: boolean
};
```

You could define a Type-Guard using the following code:

```typescript
import { is } from 'ts-misc'

// Create a Type-Guard for Custom Type
const isCustomUser = is({
  id: is.number,
  firstName: is.string,
  lastName: is.string,
  joined: is.date.opt,
  active: is.boolean
});
```

That's it, you can build a Type-Guard for an complex interface just like that. And you can also certify that the resulting Type-Guard is correct by doing the following:

```typescript
// Create a Type-Guard for Custom Type and ensure the resulting Guard is correct
const isCustomUser: (obj) => obj is CustomUser = is({
  id: is.number,
  firstName: is.string,
  lastName: is.string,
  joined: is.date.opt,
  active: is.boolean
});
```

This way, if the resulting Type-Guard does not match exactly with the type you targeted, this code will not compile.

Then you can use your new Type-Guard like any other, pass ot around the code to wherever you want.

```typescript
import { is } from 'ts-misc'

// Example variable with unknown type
let example: unknown = {
  id: 10756,
  firstName: "David",
  lastName: "Smith",
  joined: new Date("2013-08-06"),
  active: false
}

// This works!
if (isCustomUser(example)) {
  console.log(`it's a CustomUser: ${example}`)
}
```

What happens here is that the `is` Proxy is also callable, and if you pass it a correct `GuardDescriptor` it will use it to build a new Type-Guard based on it's enumerable keys.

This should make the use of Type-Guards orders of magnetude simpler and quicker. And no overhead since you can always ensure the resulting Type-Guard matches a given type.