import { Wrapper } from './Wrapper'

// Logger class implementing the Wrapper interface
class Logger implements Wrapper {
  // Asynchronous handler method
  asyncHandler = async (method: Function, methodName: string, context: any, args: any[]): Promise<any> => {
    // Log method name and arguments
    console.log(`Calling ${methodName} with args: ${this.processArgs(args)}`)
    // Invoke the method with the given context and arguments
    const result: any = await method.apply(context, args)
    // Log the result of the method call
    console.log(`Result of ${methodName}: ${this.convertResult(result)}`)
    // Return the result as a resolved Promise
    return await Promise.resolve(result)
  }

  // Synchronous handler method
  syncHandler = (method: Function, methodName: string, context: any, args: any[]): any => {
    // Log method name and arguments
    console.log(`Calling ${methodName} with args: ${this.processArgs(args)}`)
    // Invoke the method with the given context and arguments
    const result: any = method.apply(context, args)
    // Log the result of the method call
    console.log(`Result of ${methodName}: ${this.convertResult(result)}`)
    // Return the result
    return result
  }

  // Convert result to string representation
  convertResult = (value: any): string => {
    if (typeof value === 'string' || typeof value === 'number' || value instanceof Date) {
      return value.toString()
    } else if (Array.isArray(value)) {
      return String(value.length)
    } else if (typeof value === 'object' && value !== null) {
      return this.processObject(value)
    } else {
      return 'Unsupported type'
    }
  }

  // Process object to string representation
  processObject = (obj: { [key: string]: any }): string => {
    const values = Object.keys(obj)
        .map(key => `${key}:${this.convertResult(obj[key])}`)
        .join(',')
    return `{${values}}`
  }

  // Process arguments to string representation
  processArgs = (args: any[]): string => {
    const values = args.map(arg => this.convertResult(arg)).join(',')
    return `[${values}]`
  }
}

export default new Logger()
