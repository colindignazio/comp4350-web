/* jshint expr: true */
module.exports = {
  browserUrl: "http://54.201.49.162",
  'Basic Login Test' : function (browser) {
    browser
      .url(this.browserUrl)
      .pause(1000)
      .waitForElementVisible('li[id="signIn"]', 3000)
      .click('li[id="signIn"]')
      .pause(500)
      .setValue('input[id="username"]', 'Mitchell')
      .setValue('input[id="password"]', 'MbrH42zp')
      .click('button[id=signInButton]')
      .waitForElementVisible('#userAccount', 3000)
      .click('#userAccount')
      .waitForElementVisible('#username', 3000)
      .pause(1000)
      .assert.value('#username', "Mitchell")
      .end(); 
  },
};
