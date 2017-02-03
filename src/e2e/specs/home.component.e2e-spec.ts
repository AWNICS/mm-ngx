import { browser, element, by } from 'protractor';

describe('Home', () => {

  beforeEach(async () => {
    return await browser.get('/');
  });

  it('should have an input form to type mobile number', () => {
    console.log('\nTest the home input form\n');
    expect(element(by.css('sd-home form input')).isPresent()).toEqual(true);
  });
  
  it("should have place order button be disabled initially", () => {  
    browser.get("/");
    let placeOrderSubmitButton = element(
          by.id("btnHomePlaceOrder"));
    console.log('\nTest the place order button on home page\n');
    expect(placeOrderSubmitButton.isEnabled()).toEqual(false);
  });
  
  /*
  
  it("should only enable place order button when the user types correct mobile number", () => {
    browser.get("/");
    let placeOrderSubmitButton = element(
          by.css("input[type=submit]"));
    expect(placeOrderSubmitButton.isEnabled()).toEqual(true);
  });
  it("should open the modal window on validation of the form field", () => {
    browser.get("/");
    let placeOrderSubmitButton = element(
          by.css("input[type=submit]"));
    expect(placeOrderSubmitButton.isEnabled()).toEqual(true);
    expect(element(by.css('sd-modal')).isPresent()).toEqual(true);
  });
  */

});