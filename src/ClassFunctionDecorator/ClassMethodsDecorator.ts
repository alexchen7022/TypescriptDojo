type Constructor<T = {}> = new (...args: any[]) => T

/**
 * Determines if a function is asynchronous.
 * Note: The compile target needs to be ES2017 or later, as only ES2017 formally supports async/await.
 * Before ES2017, async/await was implemented in a marginal way, so there wouldn't be a constructor named AsyncFunction.
 *
 * @param method - The function to check
 * @returns True if the function is asynchronous, otherwise false
 */
function isAsyncFunction(method: Function): boolean {
  return method.constructor.name === 'AsyncFunction'
}

/**
 * Wraps a method, choosing the appropriate wrapper based on whether the method is asynchronous.
 *
 * @param originalMethod - The original method
 * @param methodName - The name of the method
 * @param asyncWrapMethod - The wrapper for asynchronous methods
 * @param syncWrapMethod - The wrapper for synchronous methods
 * @returns The wrapped method
 */
function wrapMethod(originalMethod: Function, methodName: string, asyncWrapMethod: Function, syncWrapMethod: Function) {
  return function (this: any, ...args: any[]) {
    if (isAsyncFunction(originalMethod)) {
      return asyncWrapMethod(originalMethod, methodName, this, args)
    } else {
      return syncWrapMethod(originalMethod, methodName, this, args)
    }
  }
}

/**
 * Class methods decorator, used to wrap all methods in a class.
 *
 * @param asyncWrapMethod - The wrapper for asynchronous methods
 * @param syncWrapMethod - The wrapper for synchronous methods
 * @returns The class with wrapped methods
 */
export function classMethodsDecorator(asyncWrapMethod: Function, syncWrapMethod: Function) {
  return function <T extends Constructor>(Base: T) {
    return class extends Base {
      constructor(...args: any[]) {
        super(...args)

        // Get all property names of the class,
        // Object.keys for arrow function.
        // Object.getOwnPropertyNames for std class function
        const propertyNames = [
          ...Object.keys(this),
          ...Object.getOwnPropertyNames(Base.prototype)
        ]

        // Check and wrap each method
        propertyNames.forEach(propertyName => {
          if (propertyName === 'constructor') return
          const originalMethod = (this as any)[propertyName]
          if (typeof originalMethod === 'function') {
            (this as any)[propertyName] = wrapMethod(originalMethod, propertyName, asyncWrapMethod, syncWrapMethod)
          }
        })
      }
    }
  }
}
