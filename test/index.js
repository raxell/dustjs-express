'use strict';

var dust = require('dustjs-linkedin');
var dustjsExpress = require('../index.js');
var path = require('path');
var should = require('should');

var templates = {
    hello:              path.join(__dirname, 'views/hello.dust'),
    helloPartial:       path.join(__dirname, 'views/hello_partial.dust'),
    helloInlinePartial: path.join(__dirname, 'views/hello_inline_partial.dust'),
    nonexistentPartial: path.join(__dirname, 'views/nonexistent_partial.dust'),
    nonexistent:        path.join(__dirname, 'nonexistent'),
    helloPartialCustom: path.join(__dirname, 'views/hello_partial2.tpl')
};
var options = {
    settings: {
        'views': [
            __dirname,
            path.join(__dirname, 'views'),
            path.join(__dirname, 'partials')
        ],
        'view engine': 'dust',
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

describe('Partials', function() {
    it('should throw an error if the partial does not exist', function(done) {
        render(templates.nonexistentPartial, options, function(err) {
            err.should.exist;

            done();
        });
    });

    it('should lookup partials in multiple directories', function(done) {
        render(templates.helloPartial, options, function(err, output) {
            if (err) {
                console.log(err);
            }

            output.should.be.equal('Hello Marco');

            done();
        });
    });

    it('should lookup inline partials in multiple directories', function(done) {
        render(templates.helloInlinePartial, options, function(err, output) {
            if (err) {
                console.log(err);
            }

            output.should.be.equal('Hello Marco');

            done();
        });
    });
});

describe('Templates cache', function() {
    beforeEach(function(done) {
        delete require.cache[require.resolve('../index.js')];
        dustjsExpress = require('../index.js');
        render = dustjsExpress.engine();

        done();
    });

    it('should load templates from disk if cache is disabled', function(done) {
        options.settings['view cache'] = false;

        render(templates.hello, options, function(err, output) {
            dust.config.cache.should.be.false();
            dust.cache.should.be.empty();

            done();
        });
    });

    it('should load templates from cache if it is enabled', function(done) {
        options.settings['view cache'] = true;

        render(templates.hello, options, function(err, output) {
            dust.config.cache.should.be.true();
            dust.cache.should.have.property(templates.hello);

            done();
        });
    });
});

describe('Custom template file extension', function() {
    before(function(done) {
        delete require.cache[require.resolve('../index.js')];
        dustjsExpress = require('../index.js');
        render = dustjsExpress.engine();
        options.settings['view engine'] = 'tpl';

        done();
    });

    it('should search the templates using a custom file extension', function(done) {
        render(templates.helloPartialCustom, options, function(err, output) {
            if (err) {
                console.log(err);
            }

            output.should.be.equal('Hello Marco');

            done();
        });
    });
});
