var should = require('chai').should();
var expect = require('chai').expect;

describe('OAuth1.0 for Fitbit',function(){
  var OAuthClass = require('oauth');
  var oauth;

  beforeEach(function()
  {
    oauth = new OAuthClass.OAuth(
      'https://api.fitbit.com/oauth/request_token',
      'https://api.fitbit.com/oauth/access_token',
      '98cfee4f81cdd2e3f1776e02f306a4c3',
      'd525f09fe368f91dbe9f02c57fbcf6ba',
      '1.0',
      null,
      'HMAC-SHA1'
    );
  });

  afterEach(function()
  {
    oauth = null;
  });

  it('gets a request token',function(done){
    oauth.getOAuthRequestToken(function(error, requestAccessToken, requestAccessSecret, serverResponse)
    {
      console.log("getOAuthRequestToken callback");
      console.log('error:', error);
      console.log('requestAccessToken:', requestAccessToken);
      console.log('requestAccessSecret:', requestAccessSecret);
      console.log('serverResponse:', serverResponse);
      expect(error).to.be.null;
      done();
    });



    // oauth.get(
    //   'https://api.fitbit.com/1/user/3BMRHF/profile.json',
    //   '1731eb48a515a944946fa0c9513b46bd', //test user token
    //   'a47713127f4a818023d6d31db0bfbf8e', //test user secret            
    //   function (e, data, res){
    //     if (e) console.error(e);        
    //     console.log(require('util').inspect(data));
    //     done();
    //   });   

      // oauth.get(
      // 'https://api.fitbit.com/1/user/3BMRHF/activities/date/2015-04-18.json',
      // '1731eb48a515a944946fa0c9513b46bd', //test user token
      // 'a47713127f4a818023d6d31db0bfbf8e', //test user secret            
      // function (e, data, res){
      //   if (e) console.error(e);        
      //   console.log(require('util').inspect(data));
      //   done();
      // }); 
      
      // works
      // oauth.post(
      // 'https://api.fitbit.com/1/user/3BMRHF/apiSubscriptions/activities.json',
      // '1731eb48a515a944946fa0c9513b46bd', //test user token
      // 'a47713127f4a818023d6d31db0bfbf8e', //test user secret    
      // null,
      // null,       
      // function (e, data, res){
      //   if (e) console.error(e);        
      //   console.log(require('util').inspect(data));
      //   done();
      // }); 

      // oauth.get(
      // 'https://api.fitbit.com/1/user/3BMRHF/apiSubscriptions.json',
      // '1731eb48a515a944946fa0c9513b46bd', //test user token
      // 'a47713127f4a818023d6d31db0bfbf8e', //test user secret     
      // function (e, data, res){
      //   if (e) console.error(e);        
      //   console.log(require('util').inspect(data));
      //   done();
      // });
      
      
  });
});

// oauth_token=3f4a7b2617b95de014f5323747b5b2f0&
// oauth_verifier=2ddd505f0c5d1e937bb1bdef2a74d8c3


