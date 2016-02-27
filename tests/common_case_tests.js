/* jshint expr: true */
module.exports = {
    browserUrl: "http://54.201.49.162",
    'View User Profile Test' : function (browser) {
        browser
            .url(this.browserUrl + "#/User/1")
            .pause(1000)
            .waitForElementVisible('#username', 3000)
            .pause(1000)
            .assert.visible('#username')
            .end();
    },

    'View User Reviews Test' : function (browser) {
        browser
            .url(this.browserUrl + "#/User/1")
            .pause(1000)
            .waitForElementVisible('#review', 3000)
            .pause(1000)
            .assert.visible('#review')
            .end();
    },

    'User Search Test' : function (browser) {
        browser
            .url(this.browserUrl + "#/Search")
            .pause(1000)
            .waitForElementVisible('#searchToken', 3000)
            .pause(1000)
            .click('#searchType')
            .click('#userSelect')
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
            .click('#searchType')
            .click('#beerSelect')
            .setValue('input[id="searchToken"]', 'Ale')
            .click('button[id=search]')
            .waitForElementVisible('#beerResult', 3000)
            .assert.visible('#beerResult')
            .end();
    },

    'Beer Advanced Search Test' : function (browser) {
        browser
            .url(this.browserUrl + "#/Search")
            .pause(1000)
            .click('button[id=advancedSearch]')
            .waitForElementVisible('#advancedBeerName', 3000)
            .pause(1000)
            .setValue('input[id="advancedBeerName"]', 'Grass')
            .pause(1000)
            .setValue('input[id="advancedBeerType"]', 'Ale')
            .click('button[id=advancedSearchSubmit]')
            .waitForElementVisible('#advancedBeerResults', 3000)
            .assert.visible('#advancedBeerResults')
            .end();
    },

    'Top Drink Test' : function (browser) {
        browser
            .url(this.browserUrl + "#/TopDrinks")
            .waitForElementVisible('#topDrink', 3000)
            .assert.visible('#topDrink')
            .end();
    },

  'Follow User Test' : function (browser) {
    browser
        .url(this.browserUrl + "#/Login")
        .waitForElementVisible('#username', 3000)
        .setValue('input[id="username"]', "dexterpeters")
        .setValue('input[id="password"]', "password")
        .click('button[id="signInButton"]')
        .url(this.browserUrl + "#/User/1")
        .pause(1000)
        .waitForElementVisible('#followButton', 3000, false, function (visible) {
          if(visible) {
            browser.click('button[id="followButton"]');
            browser.refresh();
            browser.pause(1000);
            browser.assert.visible('#unfollowButton');
          } else {
            browser.click('button[id="unfollowButton"]');
            browser.refresh();
            browser.pause(1000);
            browser.assert.visible('#followButton');
          }
        })
        .end();
  }
};
