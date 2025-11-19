import type {Registration as DBRegistration} from '@/lib/db/schema'

// Utility type to convert camelCase keys to snake_case
type CamelToSnake<S extends string> = S extends `${infer T}${infer U}`
  ? `${T extends Capitalize<T> ? '_' : ''}${Lowercase<T>}${CamelToSnake<U>}`
  : S

type KeysToSnakeCase<T> = {
  [K in keyof T as CamelToSnake<string & K>]: T[K] extends Date ? string : T[K]
}

// Export snake_case version as the default "Registration" type for frontend use
// This matches form field names and keeps frontend code consistent
export type Registration = KeysToSnakeCase<DBRegistration>

// Also export the Drizzle type if needed for direct DB operations
export type {Registration as RegistrationDB} from '@/lib/db/schema'
