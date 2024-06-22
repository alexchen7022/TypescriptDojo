
// Compile target 需要在 ES2017 之後，不然Async的Method 都會是錯誤的
type Constructor<T = {}> = new (...args: any[]) => T

async function logAsyncMethodExecution(method: Function, methodName: string, context: any, args: any[]) {
  console.log(`Calling ${methodName} with args: ${JSON.stringify(args)}`);
  try {
    const result = await method.apply(context, args);
    console.log(`Result of ${methodName}: ${result}`);
    return result;
  } catch (error) {
    console.error(`Error in ${methodName}: ${error}`);
    throw error;
  }
}

function logSyncMethodExecution(method: Function, methodName: string, context: any, args: any[]) {
  console.log(`Calling ${methodName} with args: ${JSON.stringify(args)}`);
  try {
    const result = method.apply(context, args);
    console.log(`Result of ${methodName}: ${result}`);
    return result;
  } catch (error) {
    console.error(`Error in ${methodName}: ${error}`);
    throw error;
  }
}

function isAsyncFunction(method: Function): boolean {
  return method.constructor.name === "AsyncFunction";
}

function wrapMethod (method: Function, methodName: string) {
  return function (this: any, ...args: any[]) {
    if (isAsyncFunction(method)) {
      return logAsyncMethodExecution(method, methodName, this, args)
    } else {
      return logSyncMethodExecution(method, methodName, this, args)
    }
  }
}

export function logClassMethods<T extends Constructor> (Base: T) {
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
          (this as any)[propertyName] = wrapMethod(originalMethod, propertyName)
        }
      })
    }
  }
}
