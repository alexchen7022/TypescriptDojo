import { Wrapper } from './Wrapper'

type Constructor<T = {}> = new (...args: any[]) => T

/**
 * Determines if a function is asynchronous.
 * Note: The compile target needs to be ES2017 or later, as only ES2017 formally supports async/await.
 * Before ES2017, async/await was implemented in a marginal way, so there wouldn't be a constructor named AsyncFunction.
 *
 * @param method - The function to check
 * @returns True if the function is asynchronous, otherwise false
 */
function isAsyncFunction (method: Function): boolean {
  return method.constructor.name === 'AsyncFunction'
}

/**
 * Wraps a synchronous method, choosing the appropriate wrapper based on whether the method is asynchronous.
 *
 * @param originalMethod - The original method to wrap
 * @param sourceName - The name of the source class and method
 * @param wrapperFunction - The wrapper function to use
 * @returns The wrapped method
 */
function wrapSyncMethod (originalMethod: Function, sourceName: string, wrapperFunction: Wrapper) {
  return function (this: any, ...args: any[]) {
    return wrapperFunction.sync(originalMethod, sourceName, this, args)
  }
}

/**
 * Wraps an asynchronous method with the appropriate wrapper.
 *
 * @param originalMethod - The original method to wrap
 * @param sourceName - The name of the source class and method
 * @param wrapperFunction - The wrapper function to use
 * @returns The wrapped asynchronous method
 */
function wrapAsyncMethod (originalMethod: Function, sourceName: string, wrapperFunction: Wrapper) {
  return async function (this: any, ...args: any[]) {
    return await wrapperFunction.async(originalMethod, sourceName, this, args)
  }
}

/**
 * Class methods decorator used to wrap all methods in a class.
 *
 * @param wrapper - The wrapper function to use
 * @returns The class with wrapped methods
 */
export function classMethodsDecorator (wrapper: Wrapper) {
  return function <T extends Constructor>(Base: T) {
    const className = Base.name
    const DecoratedClass = class extends Base {
      constructor (...args: any[]) {
        super(...args)
        // Get all property names of the class,
        // Object.keys for arrow functions,
        // Object.getOwnPropertyNames for standard class functions
        const propertyNames = [
          ...Object.keys(this),
          ...Object.getOwnPropertyNames(Base.prototype)
        ]

        // Check and wrap each method
        propertyNames.forEach(propertyName => {
          if (propertyName === 'constructor') return
          const originalMethod = (this as any)[propertyName]
          if (typeof originalMethod !== 'function') {
            return
          }
          const sourceName = `<${Base.name}-${propertyName}>`
          if (isAsyncFunction(originalMethod)) {
            (this as any)[propertyName] = wrapAsyncMethod(originalMethod, sourceName, wrapper)
          } else {
            (this as any)[propertyName] = wrapSyncMethod(originalMethod, sourceName, wrapper)
          }
        })
      }
    }
    Object.defineProperty(DecoratedClass, 'name', { value: className })
    return DecoratedClass
  }
}
