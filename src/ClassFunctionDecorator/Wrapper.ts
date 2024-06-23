export interface Wrapper {
  async: (method: Function, methodName: string, context: any, args: any[]) => Promise<any>
  sync: (method: Function, methodName: string, context: any, args: any[]) => any
}
