'use strict';

var dust = require('dustjs-linkedin');
var dustjsExpress = require('../index.js');
var path = require('path');
var should = require('should');

var templates = {
    hello: path.join(__dirname, 'views/hello.dust'),
    nonexistent: path.join(__dirname, 'nonexistent')
};
var options = {
    settings: {
        'views': [
            __dirname,
            path.join(__dirname, 'views')
        ],
        'view cache': false
    },
    name: 'Marco'
};
var render = dustjsExpress.engine();

dust.config.cache = false;

describe('Single template', function() {
    it('should throw an error if the template does not exist', function(done) {
        render(templates.nonexistent, options, function(err) {
            err.should.exist;

            done();
        });
    });

    it('should retrieve and render the template code from the given path', function(done) {
        render(templates.hello, options, function(err, output) {
            if (err) {
                console.log(err);
            }

            output.should.be.equal('Hello Marco');

            done();
        });
    });
});
