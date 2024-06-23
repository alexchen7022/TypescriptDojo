import Logger from './Logger'
import { Wrapper } from './Wrapper'

describe('Logger', () => {
  let logger: Wrapper
  let consoleSpy: jest.SpyInstance

  beforeEach(() => {
    logger = Logger
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  describe('async', () => {
    it('should log method call and result', async () => {
      const method = jest.fn().mockResolvedValue('async result')
      const methodName = 'testAsyncMethod'
      const context = {}
      const args = [1, 2, 3]

      const result = await logger.asyncHandler(method, methodName, context, args)

      expect(console.log).toHaveBeenCalledWith(`Calling ${methodName} with args: ${JSON.stringify(args)}`)
      expect(console.log).toHaveBeenCalledWith(`Result of ${methodName}: async result`)
      expect(result).toBe('async result')
    })

    it('should log method call and result when result is a JSON string', async () => {
      const method = jest.fn().mockResolvedValue(JSON.stringify({ key: 'value' }))
      const methodName = 'testAsyncMethodWithJsonResult'
      const context = {}
      const args = [1, 2, 3]

      const result = await logger.asyncHandler(method, methodName, context, args)

      expect(console.log).toHaveBeenCalledWith(`Calling ${methodName} with args: ${JSON.stringify(args)}`)
      expect(console.log).toHaveBeenCalledWith(`Result of ${methodName}: ${JSON.stringify({ key: 'value' })}`)
      expect(result).toBe(JSON.stringify({ key: 'value' }))
    })

    it('should log method call and result when result is an object', async () => {
      const method = jest.fn().mockResolvedValue({ key: 'value' , key2:'value2'})
      const methodName = 'testAsyncMethodWithObjectResult'
      const context = {}
      const args = [1, 2, 3]

      const result = await logger.asyncHandler(method, methodName, context, args)

      expect(console.log).toHaveBeenCalledWith(`Calling ${methodName} with args: ${JSON.stringify(args)}`)
      expect(console.log).toHaveBeenCalledWith(`Result of ${methodName}: {key:value,key2:value2}`)
      expect(result).toEqual({ key: 'value' , key2:'value2'})
    })
  })

  describe('sync', () => {
    it('should log method call and result', () => {
      const method = jest.fn().mockReturnValue('sync result')
      const methodName = 'testSyncMethod'
      const context = {}
      const args = [4, 5, 6]

      const result = logger.syncHandler(method, methodName, context, args)

      expect(console.log).toHaveBeenCalledWith(`Calling ${methodName} with args: ${JSON.stringify(args)}`)
      expect(console.log).toHaveBeenCalledWith(`Result of ${methodName}: sync result`)
      expect(result).toBe('sync result')
    })

    it('should log method call and result when result is a JSON string', () => {
      const method = jest.fn().mockReturnValue(JSON.stringify({ key: 'value' }))
      const methodName = 'testSyncMethodWithJsonResult'
      const context = {}
      const args = [4, 5, 6]

      const result = logger.syncHandler(method, methodName, context, args)

      expect(console.log).toHaveBeenCalledWith(`Calling ${methodName} with args: ${JSON.stringify(args)}`)
      expect(console.log).toHaveBeenCalledWith(`Result of ${methodName}: ${JSON.stringify({ key: 'value' })}`)
      expect(result).toBe(JSON.stringify({ key: 'value' }))
    })

    it('should log method call and result when result is an object', () => {
      const method = jest.fn().mockReturnValue({ key: 'value' })
      const methodName = 'testSyncMethodWithObjectResult'
      const context = {}
      const args = [4, 5, 6]

      const result = logger.syncHandler(method, methodName, context, args)

      expect(console.log).toHaveBeenCalledWith(`Calling ${methodName} with args: ${JSON.stringify(args)}`)
      expect(console.log).toHaveBeenCalledWith(`Result of ${methodName}: {key:value}`)
      expect(result).toEqual({ key: 'value' })
    })
  })
})
