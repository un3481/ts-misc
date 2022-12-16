/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

// Imports
import fs from 'fs'
import { is } from './guards'
import { safe } from './handles'
import { SuperConstructor } from './types'

// Type Imports
import type {
  As,
  Set,
  KeyOf,
  ValueOf,
  ReadonlyInclude,
  PrimitiveType,
  SuperType
} from './types'

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

// Get Random Item of Array
export function rand<T extends ValueOf>(
  arr: ReadonlyInclude<Set<T> | T[]>
): T {
  const keys = Object.keys(arr)
  const k = keys[Math.floor(Math.random() * keys.length)]
  return arr[k] as T
}

// Generate new Serial Object
export function generate<T>(
  obj: T,
  replacer?: (key: KeyOf, value: unknown) => unknown
): T {
  return JSON.parse(JSON.stringify(obj, replacer))
}

// Remove Cyclic References from Object
export function serialize<T>(obj: T): T {
  const seen = []
  const getCircularReplacer = (k, value) => {
    if (is.object(value)) {
      if (seen.indexOf(value) !== -1) return
      else seen.push(value)
    }
    return value
  }
  return generate(obj, getCircularReplacer)
}

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

// Type Parse
export type PrimitiveJSON = As<
| PrimitiveType
| Record<string | number, unknown>
| unknown[]
>

// Access JSON Class
export class AccessJSON {
  path: string

  constructor (path: string) {
    // Assign Path
    this.path = path
  }

  // Read-JSON Method
  read() {
    // Read-File Function
    const readFile = safe(
      (_p: string) => fs.readFileSync(_p).toString()
    )
    // Read File
    let [ok, file] = readFile(this.path)
    // Parse Json
    let value: PrimitiveJSON = null
    if (ok) {
      try {
        value = JSON.parse(file as string) as PrimitiveJSON
      } catch(e) { ok = false }
    }
    // Make Return a Object
    const obj = SuperConstructor(value)
    // Return Object
    return [ok, obj] as const
  }

  // Read-JSON Method
  write(json: unknown) {
    // Read-File Function
    const writeFile = safe(
      (_p: string, _o: string) => fs.writeFileSync(_p, _o)
    )
    // Serialize Object
    const strgfy = JSON.stringify(serialize(json))
    // Write File
    const [ok, error] = writeFile(this.path, strgfy)
    // Return Status
    return ok
  }
}

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

export function proxyJSON(path: string) {
  // Define AccessJSON Object
  const file = new AccessJSON(path)
  // Return Proxy
  return new Proxy({}, {
    get(_target, p) {
      const [ok, obj] = file.read()
      if (!ok) return undefined
      return obj[p]
    },
    set(_target, p, value) {
      const [ok, obj] = file.read()
      if (!ok) return false
      obj[p] = value
      return file.write(obj)
    },
    deleteProperty(_target, p) {
      const [ok, obj] = file.read()
      if (!ok) return false
      delete obj[p]
      return file.write(obj)
    },
    enumerate(_target, p) {
      const [ok, obj] = file.read()
      if (!ok) return undefined
      return Object.keys(obj)
    },
    ownKeys(_target, p) {
      const [ok, obj] = file.read()
      if (!ok) return undefined
      return Object.keys(obj)
    },
    has(_target, p) {
      const [ok, obj] = file.read()
      if (!ok) return undefined
      return p in obj || is.in(obj, p)
    },
    defineProperty(_target, p, desc) {
      const [ok, obj] = file.read()
      if (!ok) return undefined
      if (desc && is.in(desc, 'value')) obj[p] = desc.value
      if (file.write(obj)) return obj
    },
    getOwnPropertyDescriptor(_target, p) {
      const [ok, obj] = file.read()
      if (!ok) return undefined
      const value = obj[p]
      const desc: PropertyDescriptor = {
        value: value,
        writable: true,
        enumerable: true,
        configurable: false
      }
      if (value) return desc
    }
  } as unknown as ProxyHandler<SuperType>)
}

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/
