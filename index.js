'use strict';

module.exports = {
    engine: function() {
        return function(template, options, callback) {
            callback(null, null);
        };
    }
};
