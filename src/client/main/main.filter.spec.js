/* jshint -W117, -W030 */
'use strict';

describe('main percent filter', function()
{
  var filter;

  beforeEach(function()
  {
    module('main');
  });

  beforeEach(function()
  {
     inject(function(_$filter_)
      {
        filter = _$filter_('percent');
      });
  });

  it('should be created successfully', function()
  {
      expect(filter).to.be.defined;
  });

  it('should return 0 if passed in null', function()
  {
      expect(filter(null)).to.equal(0);
  });

  it('should return undefined if passed in undefined', function()
  {
      expect(filter(undefined)).to.be.undefined;
  });

  it('should return 0 if passed in empty string', function()
  {
      expect(filter('')).to.equal(0);
  });

  it('returns 0 if passed in 0', function()
  {
      expect(filter(0)).to.equal(0);
  });

  it('returns 100 if passed in 1', function()
  {
      expect(filter(1)).to.equal(100);
  });

});