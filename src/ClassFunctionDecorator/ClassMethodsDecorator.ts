import {Wrapper} from "./Wrapper";

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
 * @param wrapperFunction
 * @returns The wrapped method
 */
function syncWrapMethod(originalMethod: Function, methodName: string, wrapperFunction: Wrapper) {
    return function (this: any, ...args: any[]) {
        return wrapperFunction.sync(originalMethod, methodName, this, args)
    }
}

function asyncSyncMethod(originalMethod: Function, methodName: string, wrapperFunction: Wrapper) {
    return async function (this: any, ...args: any[]) {
        return await wrapperFunction.async(originalMethod, methodName, this, args)
    }
}

/**
 * Class methods decorator, used to wrap all methods in a class.
 *
 * @returns The class with wrapped methods
 * @param wrapperFunction :
 */
export function classMethodsDecorator(wrapperFunction: Wrapper) {
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
                    if (typeof originalMethod !== 'function') {
                        return
                    }
                    if (isAsyncFunction(originalMethod)) {
                        (this as any)[propertyName] = asyncSyncMethod(originalMethod, propertyName, wrapperFunction)
                    } else {
                        (this as any)[propertyName] = syncWrapMethod(originalMethod, propertyName, wrapperFunction)
                    }
                })
            }
        }
    }
}
