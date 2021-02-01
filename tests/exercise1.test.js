const { fizzBuzz } = require('../exercise1');

describe('fizzBuzz', () => {
  it('should throw an exception if input is not a number', () => {
    expect(() => {fizzBuzz('a').toThrow()});
    expect(() => {fizzBuzz(null).toThrow()});
    expect(() => {fizzBuzz(undefined).toThrow()});
    expect(() => {fizzBuzz({}).toThrow()});
  })
  
  it('should return FizzBuzz when input is divisible by 3 and 5', () => {
    const result = fizzBuzz(15);
    expect(result).toMatch('FizzBuzz');
  });

  it('should return Fizz when input is only divisible by 3', () => {
    const result = fizzBuzz(3);
    expect(result).toMatch('Fizz');
  });

  it('should retun Buzz when input is only divisible by 5', () => {
    const result = fizzBuzz(5);
    expect(result).toMatch('Buzz');
  });

  it('should return input for any other number input', () => {
    const result = fizzBuzz(2);
    expect(result).toBe(2);
  })
});