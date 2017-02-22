import { browser, element, by } from 'protractor';

describe('App', () => {

  beforeEach(async () => {
    return await browser.get('/');
  });

  it('should have a title', () => {
    expect(browser.getTitle()).toEqual('Welcome to angular-seed!');
  });

/*
  it('should load all the components correctly', () => {
    expect(element(by.css('sd-app sd-contents sd-footer sd-home autofocus on form')));
  });
*/

});
