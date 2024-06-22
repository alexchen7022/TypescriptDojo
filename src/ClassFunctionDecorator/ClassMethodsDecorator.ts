
// Compile target 需要在 ES2017 之後，不然Async的Method 都會是錯誤的
type Constructor<T = {}> = new (...args: any[]) => T

function isAsyncFunction (method: Function): boolean {
  return method.constructor.name === 'AsyncFunction'
}

function wrapMethod (originalMethod: Function, methodName: string, asyncWrapMethod: Function, syncWrapMethod: Function) {
  return function (this: any, ...args: any[]) {
    if (isAsyncFunction(originalMethod)) {
      return asyncWrapMethod(originalMethod, methodName, this, args)
    } else {
      return syncWrapMethod(originalMethod, methodName, this, args)
    }
  }
}

export function classMethodsDecorator (asyncWrapMethod: Function, syncWrapMethod: Function) {
  return function <T extends Constructor>(Base: T) {
    return class extends Base {
      constructor (...args: any[]) {
        super(...args)

        const propertyNames = [
          ...Object.keys(this),
          ...Object.getOwnPropertyNames(Base.prototype)
        ]

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
