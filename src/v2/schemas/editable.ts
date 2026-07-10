/** Recursively converts non-literal number fields to strings, including array and tuple elements. */
export type EditableSchema<T> = T extends Date
  ? T
  : T extends readonly unknown[]
    ? { [K in keyof T]: EditableSchema<T[K]> }
    : T extends object
      ? { [K in keyof T]: EditableSchema<T[K]> }
      : T extends number
        ? number extends T
          ? string
          : T
        : T
