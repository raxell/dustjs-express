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

describe('Single template', function() {
    it('should throw an error if the template does not exist', function(done) {
        render(templates.nonexistent, options, function(err) {
            err.should.exist;

            done();
        });
    });

    it('should read the template from disk if cache is disabled', function(done) {
        dust.config.cache = false;
        dust.cache = {};

        render(templates.hello, options, function(err, output) {
            if (err) {
                console.log(err)
            }

            dust.cache.should.be.empty();
            output.should.be.equal('Hello Marco');

            done();
        });
    });

    it('should read the template from cache if it is enabled', function(done) {
        dust.config.cache = true;
        dust.cache = {};

        render(templates.hello, options, function(err, output) {
            if (err) {
                console.log(err);
            }

            dust.cache.should.have.property(templates.hello);
            output.should.be.equal('Hello Marco');

            done();
        })
    });
});
