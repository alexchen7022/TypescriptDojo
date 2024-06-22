
// Compile target 需要在 ES2017 之後，不然Async的Method 都會是錯誤的
type Constructor<T = {}> = new (...args: any[]) => T

function isAsyncFunction (method: Function): boolean {
  return method.constructor.name === 'AsyncFunction'
}

function wrapMethod (method: Function, methodName: string, logAsyncMethod: Function, logSyncMethod: Function) {
  return function (this: any, ...args: any[]) {
    if (isAsyncFunction(method)) {
      return logAsyncMethod(method, methodName, this, args)
    } else {
      return logSyncMethod(method, methodName, this, args)
    }
  }
}

export function logClassMethods (logAsyncMethod: Function, logSyncMethod: Function) {
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
            (this as any)[propertyName] = wrapMethod(originalMethod, propertyName, logAsyncMethod, logSyncMethod)
          }
        })
      }
    }
  }
}
