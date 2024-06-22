import { logClassMethods } from './logClassMethods'

@logClassMethods
class TestClass {
  async asyncMethod(a: number, b: number): Promise<number> {
    return a + b
  }

  syncMethod(a: number, b: number): number {
    return a * b
  }

  async asyncError(a: number, b: number): Promise<number> {
    throw new Error('Die async')
  }

  syncError(a: number, b: number): number {
    throw new Error('Die sync')
  }
}

describe('logClassMethods', () => {
  let instance: TestClass

  beforeEach(() => {
    instance = new TestClass()
    jest.clearAllMocks()
  })

  it('should log and execute async methods correctly', async () => {
    const consoleSpy = jest.spyOn(console, 'log')
    const result = await instance.asyncMethod(1, 2)

    expect(result).toBe(3)
    expect(consoleSpy).toHaveBeenCalledWith('Calling asyncMethod with args: [1,2]')
    expect(consoleSpy).toHaveBeenCalledWith('Result of asyncMethod: 3')

    consoleSpy.mockRestore()
  })

  it('should log and execute sync methods correctly', () => {
    const consoleSpy = jest.spyOn(console, 'log')
    const result = instance.syncMethod(2, 3)

    expect(result).toBe(6)
    expect(consoleSpy).toHaveBeenCalledWith('Calling syncMethod with args: [2,3]')
    expect(consoleSpy).toHaveBeenCalledWith('Result of syncMethod: 6')

    consoleSpy.mockRestore()
  })

  it('should log errors in async methods', async () => {
    const consoleSpy = jest.spyOn(console, 'error')
    await expect(instance.asyncError(1, 2)).rejects.toThrow('Die async')
    expect(consoleSpy).toHaveBeenCalledWith('Error in asyncError: Error: Die async')
    consoleSpy.mockRestore()
  })

  it('should log errors in sync methods', () => {
    const consoleSpy = jest.spyOn(console, 'error')
    expect(() => instance.syncError(2, 3)).toThrow('Die sync')
    expect(consoleSpy).toHaveBeenCalledWith('Error in syncError: Error: Die sync')
    consoleSpy.mockRestore()
  })
})