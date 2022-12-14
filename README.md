# ts-misc
Typescript Miscellaneous Library

## usage
`ts-misc` module exports several utility methods for TypeScript, eg.:

```typescript
import { strings } from 'ts-misc'

const words = ['hello', 'world'] as const
const result: "hello world" = strings.join(words, ' ')
```

### Super Guard
One of the main goals of this library is to make Type-Guards simple (while keeping them compile-time correct). This is accomplished by the use of the `is` export.

The `is` export is a Proxy that generates dynamic Type-Guards programatically and allows developers to modify and improve existing Type-Guards. The type definition for this export is `SuperGuard`, because it add new functionalities for standard Type-Guards.

It can be used as following:

```typescript
import { is } from 'ts-misc'

let example: unknown

example = 2

if (is.number(example)) {
  console.log(`is number: ${example}`)
} else {
  console.log('this will never be logged')
}
```

