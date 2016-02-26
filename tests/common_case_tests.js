/* jshint expr: true */
module.exports = {
    browserUrl: "http://54.201.49.162",
  'View User Profile Test' : function (browser) {
    browser
      .url(this.browserUrl + "#/User/1")
      .pause(1000)
      .waitForElementVisible('#username', 3000)
      .pause(1000)
      /*.setValue('input[id="username"]', 'Mitchell')
      .setValue('input[id="password"]', 'MbrH42zp')
      .click('button[id=signInButton]')
      .waitForElementVisible('#userAccount', 3000)
      .click('#userAccount')
      .waitForElementVisible('#username', 3000)
      .pause(1000)*/
      .assert.visible('#username')
      .end(); 
  },

  'View User Reviews Test' : function (browser) {
    browser
      .url(this.browserUrl + "#/User/1")
      .pause(1000)
      .waitForElementVisible('#review', 3000)
      .pause(1000)
      /*.setValue('input[id="username"]', 'Mitchell')
      .setValue('input[id="password"]', 'MbrH42zp')
      .click('button[id=signInButton]')
      .waitForElementVisible('#userAccount', 3000)
      .click('#userAccount')
      .waitForElementVisible('#username', 3000)
      .pause(1000)*/
      .assert.visible('#review')
      .end(); 
  },

  'User Search Test' : function (browser) {
    browser
      .url(this.browserUrl + "#/Search")
      .pause(1000)
      .waitForElementVisible('#searchToken', 3000)
      .pause(1000)
      .click('#userRadio')
      .setValue('input[id="searchToken"]', 'Mit')
      .click('button[id=search]')
      .waitForElementVisible('#userResult', 3000)
      .assert.visible('#userResult')
      .end(); 
  },

  'Beer Search Test' : function (browser) {
    browser
      .url(this.browserUrl + "#/Search")
      .pause(1000)
      .waitForElementVisible('#searchToken', 3000)
      .pause(1000)
      .click('#beerRadio')
      .setValue('input[id="searchToken"]', 'Ale')
      .click('button[id=search]')
      .waitForElementVisible('#beerResult', 3000)
      .assert.visible('#beerResult')
      .end(); 
  },
};
