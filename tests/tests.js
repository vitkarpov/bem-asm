var fs = require('fs');
var path = require('path');
var expect = require('expect.js');
var bemass = require('../');

var expected = {
  page1: {
    html: fs.readFileSync(path.join(__dirname, 'expected.page1.html'), 'utf-8'),
    css: fs.readFileSync(path.join(__dirname, 'expected.page1.css'), 'utf-8')
  },
  page2: {
    html: fs.readFileSync(path.join(__dirname, 'expected.page2.html'), 'utf-8'),
    css: fs.readFileSync(path.join(__dirname, 'expected.page2.css'), 'utf-8')
  }
};

describe('Assembler', function() {
  beforeEach(function() {
    this._build = bemass(['page1', 'page2'], __dirname);
  });
  afterEach(function() {
    this._build = null;
  });

  describe('should compile css', function() {
    it('for the first page', function() {
      this._build.then(function() {
          var css = fs.readFileSync(path.join(__dirname, 'pages/page1/page1.css'), 'utf-8');
          try {
            expect(css).to.eql(expected.page1.css);
          } catch(e) {
            return done(e);
          }
          done();
      });
    });
    it('for the second page', function() {
      this._build.then(function() {
          var css = fs.readFileSync(path.join(__dirname, 'pages/page2/page2.css'), 'utf-8');
          try {
            expect(css).to.eql(expected.page2.css);
          } catch(e) {
            return done(e);
          }
          done();
      });
    });
  });

  describe('should compile html', function() {
    it('for the first page', function() {
      this._build.then(function() {
          var html = fs.readFileSync(path.join(__dirname, 'pages/page1/page1.html'), 'utf-8');
          try {
            expect(html).to.eql(expected.page1.html);
          } catch(e) {
            return done(e);
          }
          done();
      });
    });
    it('for the second page', function() {
      this._build.then(function() {
          var html = fs.readFileSync(path.join(__dirname, 'pages/page2/page2.html'), 'utf-8');
          try {
            expect(html).to.eql(expected.page2.html);
          } catch(e) {
            return done(e);
          }
          done();
      });
    });
  });
});
