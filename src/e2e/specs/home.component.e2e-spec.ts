import { browser, element, by } from 'protractor';

describe('Home', () => {

  beforeEach(async () => {
    return await browser.get('/');
  });
<<<<<<< HEAD
  it('should have an input form to type mobile number', () => {
    console.log('\nTest the home input form\n');
    expect(element(by.css('mm-home form input')).isPresent()).toEqual(true);
  });
  /*it('should have place order button be disabled initially', () => {
    browser.get('/');
    let placeOrderSubmitButton = element(
          by.id('btnHomePlaceOrder'));
    console.log('\nTest the place order button on home page\n');
    expect(placeOrderSubmitButton.isEnabled()).toEqual(false);
  });
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
    expect(element(by.css('mm-modal')).isPresent()).toEqual(true);
  });
  */
=======

  it('should have an input', () => {
    expect(element(by.css('sd-home form input')).isPresent()).toEqual(true);
  });

  it('should have a list of computer scientists', () => {
    expect(element(by.css('sd-home ul')).getText())
      .toEqual('Edsger Dijkstra\nDonald Knuth\nAlan Turing\nGrace Hopper');
  });

  it('should add a name to the list using the form', () => {
    element(by.css('sd-home form input')).sendKeys('Tim Berners-Lee');
    element(by.css('sd-home form button')).click();

    expect(element(by.css('sd-home ul')).getText())
      .toEqual('Edsger Dijkstra\nDonald Knuth\nAlan Turing\nGrace Hopper\nTim Berners-Lee');
  });

>>>>>>> a26407968cf5b7270e75b6bdfec46bdbe415fa09
});
