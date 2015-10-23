var Assembler = require('./lib');
var vow = require('vow');

module.exports = function(pages, baseFolder) {
    var defer = vow.defer();

    // TODO: make it parallel
    pages.forEach(function(page) {
        (new Assembler(page, baseFolder)).run();
    });
    setTimeout(function() {
        defer.resolve();
    }, 0);

    return defer.promise();
};
