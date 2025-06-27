/**
 * Creates a deep clone of the provided object or value using JSON serialization/deserialization.
 *
 * This function creates a completely new instance with all nested objects and arrays
 * copied deeply. The clone is created by first converting the object to a JSON string
 * and then parsing it back to create a new object structure.
 *
 * Limitations:
 * - Functions, undefined values, and Symbols are not preserved
 * - Circular references will cause an error
 * - Class instances will lose their prototype chain and methods
 * - Date objects will be converted to strings
 * - Maps, Sets, and other non-JSON data types are not supported
 *
 * @template T - The type of the object to be cloned
 * @param {T} o - The object or value to clone
 * @returns {T} A deep clone of the input value
 *
 * @example
 * // Cloning a simple object
 * const obj = { name: 'John', age: 30 };
 * const cloned = clone(obj);
 *
 * @example
 * // Cloning nested structures
 * const nested = {
 *   user: { id: 1, name: 'John' },
 *   scores: [10, 20, 30]
 * };
 * const clonedNested = clone(nested);
 *
 * @throws {TypeError} If the input contains circular references
 * @throws {Error} If the input contains values that cannot be serialized to JSON
 */
export function clone<T>(o: T): T {
  return JSON.parse(JSON.stringify(o));
}

/**
 * Creates a deep clone of the provided object or value using the structured clone algorithm.
 *
 * Advantages over JSON.parse(JSON.stringify()):
 * - Preserves Date objects
 * - Handles Map and Set objects
 * - Supports TypedArrays, ArrayBuffers, and DataViews
 * - Handles circular references
 * - Better performance
 *
 * Limitations:
 * - Cannot clone functions
 * - Cannot clone DOM nodes
 * - Cannot clone Error objects
 *
 * @template T - The type of the object to be cloned
 * @param {T} value - The value to clone
 * @returns {T} A deep clone of the input value
 *
 * @throws {DOMException} If the input contains unclonable data (like functions)
 */
export function deepClone<T>(value: T): T {
  return structuredClone(value);
}
