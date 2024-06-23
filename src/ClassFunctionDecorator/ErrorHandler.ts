import {Wrapper} from "./Wrapper";

class ErrorHandler implements Wrapper {
    async = async (method: Function, methodName: string, context: any, args: any[]): Promise<any> => {
        try {
            return await method.apply(context, args)
        } catch (error) {
            console.error(`Error in ${methodName}: ${error}`)
            throw error
        }

    }
    sync = (method: Function, methodName: string, context: any, args: any[]) => {
        try {
            return method.apply(context, args)
        } catch (error) {
            console.error(`Error in ${methodName}: ${error}`)
            throw error
        }
    }
}

export default new ErrorHandler();
