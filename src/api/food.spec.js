/* jshint -W117, -W030 */
'use strict';

var expect = require('chai').expect;
var request = require('request');

describe('food api', function()
{
  before(function()
  {
    // foodAPI = require('./food');
  });

  it('has a basic test', function()
  {
    expect(true).to.be.true;
  });

  it('tests', function(done)
  {
    request('http://127.0.0.1:2146/ping', function(error, response, body)
    {
      console.log("error:", error);
      console.log("response:", response.statusCode);
      console.log("body:", body);
      expect(error).to.exist;
      done();
    });

  });

});