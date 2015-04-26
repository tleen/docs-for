'use strict';

var docs4 = require('..'),
path = require('path');

var lodashHP = 'https://lodash.com/';

describe('find local modules', function(){
  describe('should find the lodash homepage', function(){
    it('with a string arg', function(done){
      docs4('lodash', function(err, url){
	url.should.be.a.String.equal(lodashHP);
	return done(err);
      });
    });

    it('with an options arg', function(done){
      docs4({name : 'lodash'}, function(err, url){
	url.should.be.a.String.equal(lodashHP);
	return done(err);
      });
    });
  });
});

// try overriding cwd
describe('override cwd', function(){
  it('should find the lodash homepage', function(done){
    docs4({ name : 'lodash', from : __dirname}, function(err, url){
      url.should.be.a.String.equal(lodashHP);
      return done(err);      
    });
  });
});

// bad configuration
describe('no name', function(){
  it('should error', function(done){
    docs4('', function(err, url){
      err.should.be.an.Error.and.match(/required$/);
      (url === undefined).should.be.true;
      return done();
    });
  });
});


// error comes up from find lib
describe('no package.json', function(){
  it('should error', function(done){
    var there = path.resolve(__dirname,'..','..');
    docs4({ name : 'whatever', from : there }, function(err, url){
      err.should.be.an.Error.and.match(/^Unable to find/);
      (url === undefined).should.be.true;
      return done();      
    });
  });
});
