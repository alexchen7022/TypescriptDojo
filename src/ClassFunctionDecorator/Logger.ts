import { Wrapper } from './Wrapper'

class Logger implements Wrapper {
  asyncHandler = async (method: Function, methodName: string, context: any, args: any[]): Promise<any> => {
    console.log(`Calling ${methodName} with args: ${JSON.stringify(args)}`)
    const result: any = await method.apply(context, args)
    console.log(`Result of ${methodName}: ${this.convertValue(result)}`)
    return await Promise.resolve(result)
  }

  syncHandler = (method: Function, methodName: string, context: any, args: any[]): any => {
    console.log(`Calling ${methodName} with args: ${JSON.stringify(args)}`)
    const result: any = method.apply(context, args)
    console.log(`Result of ${methodName}: ${this.convertValue(result)}`)
    return result
  }

  convertValue = (value: any): string => {
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

  processObject = (obj: { [key: string]: any }): string => {
    let values: string = ''
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        values = `${values}${key}:${this.convertValue(obj[key])},`
      }
    }
    if (values.length > 1) {
      values = values.slice(0, -1)
    }

    return `{${values}}`
  }
}

export default new Logger()
