import { logClassMethods } from './ClassFunctionDecorator/logClassMethods'

@logClassMethods
class ExampleClass {
  sayHello1 (name: string): string {
    return `1.Hello, ${name}!`
  }

  async sayHelloAsync2 (name: string): Promise<string> {
    return `2.Hello, ${name}!`
  }

  sayHelloArrow3 = (name: string): string => {
    return `3.Hello, ${name}!`
  }

  sayHelloArrowAsync4 = async (name: string): Promise<string> => {
    return `4.Hello, ${name}!`
  }
}

// 測試
const example = new ExampleClass()
console.log('class result:', example.sayHello1('1'))
example.sayHelloAsync2('2').then((result: string) => console.log('class result:', result))
console.log('class result:', example.sayHelloArrow3('3'))
example.sayHelloArrowAsync4('4').then((result: string) => console.log('class result:', result))
