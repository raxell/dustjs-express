'use strict';

var dust = require('dustjs-linkedin');
var fs = require('fs');
var path = require('path');

var views;

var exists = function(path) {
    var stat;

    try {
        stat = fs.statSync(path);
    }
    catch(e) {}

    return stat && stat.isFile();
};

var lookup = function(template) {
    if (path.extname(template) !== '.dust') {
        template += '.dust';
    }

    var templatePath;

    for (var i = 0; i < views.length && !templatePath; i++) {
        templatePath = path.join(views[i], template);

        if (!exists(templatePath)) {
            templatePath = undefined;
        }
    }

    return templatePath;
};

dust.onLoad = function(template, callback) {
    var templatePath = template;

    if (!path.isAbsolute(template)) {
        templatePath = lookup(template);

        if (!templatePath) {
            return callback(new Error(
                'Cannot lookup template "' + template + '" in views directories "' + views + '"'
            ));
        }
    }

    fs.readFile(templatePath, 'utf8', function(err, data) {
        if (err) {
            return callback(err);
        }

        callback(null, data);
    });
};

module.exports = {
    engine: function() {
        return function(template, options, callback) {
            if (!views) {
                views = options.settings.views;

                if (!Array.isArray(views)) {
                    views = [views];
                }
            }

            dust.render(template, options, function(err, output) {
                if (err) {
                    return callback(err);
                }

                callback(err, output);
            });
        };
    }
};
