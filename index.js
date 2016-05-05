'use strict';

var dust = require('dustjs-linkedin');
var fs = require('fs');

dust.onLoad = function(template, callback) {
    fs.readFile(template, 'utf8', function(err, data) {
        if (err) return callback(err);

        callback(null, data);
    });
};

module.exports = {
    engine: function() {
        return function(template, options, callback) {
            dust.render(template, options, function(err, output) {
                callback(err, output);
            });
        };
    }
};
