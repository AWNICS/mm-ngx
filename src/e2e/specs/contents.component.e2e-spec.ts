import { browser, element, by } from 'protractor';

describe('Contents', () => {

  beforeEach(async () => {
    return await browser.get('/contents');
  });

  it('should load all the sections correctly', () => {
    expect(element(by.css('sd-contents')).isPresent()).toEqual(true);
  });

});