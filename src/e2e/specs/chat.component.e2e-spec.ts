import { browser, element, by } from 'protractor';
// import { TargetLocator } from 'selenium-webdriver';

describe('App', () => {

  beforeEach(async() => {
    // return await browser.get('http://localhost:5555');
    // jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
  });

  it('should have a title',async() => {
    await browser.get('http://localhost:5555');
    browser.sleep(2000);
    console.log('hie1');
  });
  it('Should test functionality',async()=>{
    browser.sleep(2000);
    // document.querySelector('.chat-history').scrollTop and scrollHeight
    const elem = element(by.css('[routerlink="/login"]'));
    const elem1 = element(by.css('input[type="email"]'));
    const elem2= element(by.css('input[type="password"]'));
    const elem3 = element(by.css('button[type="submit"]'));
    const elem4 = element(by.css('button.button__accent'));
    const elem5 = element(by.css('button[type="submit"]'));
    const elem6 = element(by.id('logo'));
    const elem7 = element.all(by.css('.btn-primary'));
    const elem8 = element(by.css('textarea'));
    const elem9 = element.all(by.id('message'));
    // var EC = protractor.ExpectedConditions
    // const elem6 = element.all(by.css('button.btn.btn-primary')).then((e)=>{
    //   console.log(e);
    // })

    expect(elem.getText()).toEqual('Login');
    elem.click();
    elem1.sendKeys('nilu@gmail.com');
    elem2.sendKeys('dontask');
    elem3.click();
    browser.sleep(2000);
    // await browser.wait(browser.ExpectedConditions.stalenessOf(elem6),7000,"Waiting for Mesomeds link");
      expect(elem6.getText()).toEqual('Mesomeds');
      elem6.click();  
    browser.sleep(4000);
    // await browser.wait(browser.ExpectedConditions.stalenessOf(elem4),7000,"Waiting for Consult now");
    // expect(elem4.getText()).toEqual('Consult Now');
     elem4.click();  
    browser.sleep(3000);
    // await browser.wait(browser.ExpectedConditions.stalenessOf(elem7),7000,"Waiting for Consult now button");
    // elem7.click();  
    elem7.get(1).click().then(()=>{
      browser.sleep(3000);
      browser.executeScript("document.querySelectorAll('.w3-bar-item img')[2].click()");
    })
    function msglength(){
          return document.querySelectorAll('#message').length;
    };
    function perf(){
       return performance.now();
    }
    let i;
    browser.sleep(3000);
    const msgleng = browser.executeScript(msglength)
    expect(msgleng).toEqual(40);
    let t4;
    const t1 = browser.executeScript(perf).then((t1)=>{
      console.log(t1);
      t4 = t1
    });
    
    // browser.wait(browser.ExpectedConditions.presenceOf(elem8),10000,"Waiting for textarea");
    for(i=0;i<50;i++){
        elem8.sendKeys('hi');
        elem5.click(); 
    }
    browser.sleep(2000).then(()=>{
      const t2 = browser.executeScript(perf).then((t3)=>{
        console.log('t2'+ t3)
      console.log("Message sending happened in "+((t3-t4)/1000)+" seconds")
      browser.sleep(2000);
      browser.executeScript(msglength).then((a)=>{
      console.log("message sent are "+(a-40)+" out of 50 messages sent")
     })
     });
     expect(browser.executeScript(msglength)).toEqual(90);
    })
  })
});

