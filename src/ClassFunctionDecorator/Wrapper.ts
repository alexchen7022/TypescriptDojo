export interface Wrapper {
  asyncHandler: (method: Function, methodName: string, context: any, args: any[]) => Promise<any>
  syncHandler: (method: Function, methodName: string, context: any, args: any[]) => any
}
