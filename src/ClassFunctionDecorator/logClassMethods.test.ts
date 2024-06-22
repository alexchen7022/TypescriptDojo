import {logClassMethods} from './logClassMethods'

@logClassMethods
class TestClass {
    async asyncMethod(a: number, b: number): Promise<number> {
        return a + b
    }

    syncMethod(a: number, b: number): number {
        return a * b
    }

    async asyncError(): Promise<number> {
        throw new Error('Die async')
    }

    syncError(): number {
        throw new Error('Die sync')
    }

    asyncMethodArrow = async (a: number, b: number): Promise<number> => {
        return a + b
    }

    syncMethodArrow = (a: number, b: number): number => {
        return a * b
    }

    asyncErrorArrow = async (): Promise<number> => {
        throw new Error('Die async')
    }

    syncErrorArrow = (): number => {
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
        await expect(instance.asyncError()).rejects.toThrow('Die async')
        expect(consoleSpy).toHaveBeenCalledWith('Error in asyncError: Error: Die async')
        consoleSpy.mockRestore()
    })

    it('should log errors in sync methods', () => {
        const consoleSpy = jest.spyOn(console, 'error')
        expect(() => instance.syncError()).toThrow('Die sync')
        expect(consoleSpy).toHaveBeenCalledWith('Error in syncError: Error: Die sync')
        consoleSpy.mockRestore()
    })

    it('should log and execute async arrow methods correctly', async () => {
        const consoleSpy = jest.spyOn(console, 'log')
        const result = await instance.asyncMethodArrow(1, 2)

        expect(result).toBe(3)
        expect(consoleSpy).toHaveBeenCalledWith('Calling asyncMethodArrow with args: [1,2]')
        expect(consoleSpy).toHaveBeenCalledWith('Result of asyncMethodArrow: 3')

        consoleSpy.mockRestore()
    })

    it('should log and execute sync arrow methods correctly', () => {
        const consoleSpy = jest.spyOn(console, 'log')
        const result = instance.syncMethodArrow(2, 3)

        expect(result).toBe(6)
        expect(consoleSpy).toHaveBeenCalledWith('Calling syncMethodArrow with args: [2,3]')
        expect(consoleSpy).toHaveBeenCalledWith('Result of syncMethodArrow: 6')

        consoleSpy.mockRestore()
    })

    it('should log errors in async arrow methods', async () => {
        const consoleSpy = jest.spyOn(console, 'error')
        await expect(instance.asyncErrorArrow()).rejects.toThrow('Die async')
        expect(consoleSpy).toHaveBeenCalledWith('Error in asyncErrorArrow: Error: Die async')
        consoleSpy.mockRestore()
    })

    it('should log errors in sync methods', () => {
        const consoleSpy = jest.spyOn(console, 'error')
        expect(() => instance.syncErrorArrow()).toThrow('Die sync')
        expect(consoleSpy).toHaveBeenCalledWith('Error in syncErrorArrow: Error: Die sync')
        consoleSpy.mockRestore()
    })
})