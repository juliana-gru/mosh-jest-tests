const lib = require('../lib');
const db = require('../db');
const mail = require('../mail');

describe('absolute', () => {
  it('should return a positive number if input is positive', () => {
    const result = lib.absolute(1);
    expect(result).toBe(1);
  });

  it('should return a positive number if input is negative', () => {
    const result = lib.absolute(-1);
    expect(result).toBe(1);
  });

  it('should return 0 if input is 0', () => {
    const result = lib.absolute(0);
    expect(result).toBe(0);
  });
})

describe('greet', () => {
  it('should return the greeting message', () => {
    const result = lib.greet('Mosh');

    //this test is too specific and can easily break
    expect(result).toBe('Welcome Mosh');

    expect(result).toMatch(/Mosh/); // less specific
    //or
    expect(result).toContain('Mosh');
  })
});

describe('getCurrencies', () => {
  it('should return supported currencies', () => {
    const result = lib.getCurrencies();
    
    //Too general
    expect(result).toBeDefined();
    //Too specific because you're testing the exact location
    expect(result[0]).toBe('USD')
    expect(result[1]).toBe('AUD');
    expect(result.length).toBe(3); //lenght might change

    //proper way
    expect(result).toContain('USD');
    //...

    //ideal way
    expect(result).toEqual(expect.arrayContaining(['EUR', 'USD', 'AUD']));
  })
});

describe('getProduct', () => {
  it('should return the product with the given id', () => {
    const result = lib.getProduct(1);

    //This test is often too specific for objects:
    expect(result).toEqual({ id:1, price: 10 }); //checks object equality. 

    //Better:
    expect(result).toMatchObject({ id:1, price: 10 }); //Does't check all properties, it'll work as long as they share the properties being matched.
    
    expect(result).toHaveProperty('id', 1);
  });
});

describe('registerUser', () => {
  it('should throw if username is falsy', () => {
    expect(() => { lib.registerUser(null) }).toThrow();

    //Alternative to this would be a parameterised test, but jest doesnt support it 
  
    //Another approach
    const args = [null, undefined, NaN, '', 0, false];
    args.forEach(a => {
      expect(() => { lib.registerUser(a) }).toThrow();
    });
  });

  it('should return a user object if valid username is passed', () => {
    const result = lib.registerUser('Mosh');
    expect(result).toMatchObject({ username: 'Mosh' });
    expect(result.id).toBeGreaterThan(0);
  });
});

// MOCK FUNCTIONS

describe('applyDiscount', () => {
  it('should apply 10% discount if customer has more than 10 points', () => {
    //To mock the db call, we set the function to a new function.
    db.getCustomerSync = function(customerId) {
      console.log('Fake reading a customer...');
      return { id: customerId, points: 11 };
    }

    const order = { customerId: 1, totalPrice: 10 };
    lib.applyDiscount(order);
    expect(order.totalPrice).toBe(9);

  })
});

describe('notifyCustomer', () => {
  it('should send an email to the customer', () => {
    //mocking function without jest
    db.getCustomerSync = function(customerId) {
      return { email: 'a' };
    }
    
    let mailSent = false;
    mail.send = function(email, message) {
      mailSent = true;
    }

    //better approach for MOCKs using jest
    db.getCustomerSync = jest.fn().mockReturnValue({ email: 'a' })
    mail.send = jest.fn();

    lib.notifyCustomer({ customerId: 1 });

    expect(mail.send).toHaveBeenCalled();
    expect(mail.send.mock.calls[0][0]).toBe('a');
  });
});
