import {Wrapper} from "./Wrapper";

class Logger implements Wrapper {
    async = async (method: Function, methodName: string, context: any, args: any[]): Promise<any> => {
        console.log(`Calling ${methodName} with args: ${JSON.stringify(args)}`)
        const result: any = await method.apply(context, args)
        console.log(`Result of ${methodName}: ${result}`)
        return Promise.resolve(result)
    }
    sync = (method: Function, methodName: string, context: any, args: any[]) => {
        console.log(`Calling ${methodName} with args: ${JSON.stringify(args)}`)
        const result: any = method.apply(context, args)
        console.log(`Result of ${methodName}: ${result}`)
        return result
    }
}

export default new Logger();
