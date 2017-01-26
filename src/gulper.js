module.exports = (function () {
    var gulp;
    var ASSET_TYPES;
    var ASSETS ;
    var PLUGINS;

    /**
     *
     */
    (function () {
        gulp = require('gulp');

        ASSET_TYPES = {
            WATCH: 'watch',
            COPY: 'copy',
            CSS: 'css',
            JS: 'js'
        };

        ASSETS = [];

        PLUGINS = {};
        PLUGINS.argv = require('yargs').argv;
        PLUGINS.cleanCSS = require('gulp-clean-css');
        PLUGINS.concat = require('gulp-concat');
        PLUGINS.del = require('del');
        PLUGINS.es = require('event-stream');
        PLUGINS.uglify = require('gulp-uglify');
        PLUGINS.sass = require('gulp-sass');
        PLUGINS.rename = require("gulp-rename");
        PLUGINS.gzip = require('gulp-gzip');
        PLUGINS.runSequence = require('run-sequence');
    })();

    /**
     *
     */
    function isValidType(type) {
        var found;

        found = false;

        for (var key in ASSET_TYPES) {
            if (ASSET_TYPES.hasOwnProperty(key)) {
                if (ASSET_TYPES[key] === type.toLowerCase()) {
                    found = true;
                    break;
                }
            }
        }

        return found;
    }

    /**
     *
     * @param id
     * @param type
     * @param obj
     *
     * @returns {{}|*}
     */
    function add(id, type, obj) {
        var asset;

        obj.params = obj.params || {};

        asset = {};
        asset.id = id || '';
        asset.type = type || ASSET_TYPES.COPY;

        // Set Asset Fields.
        asset.src = obj.src;
        asset.dest = obj.dest || './dist';
        asset.base = obj.base || false;

        // Set Asset Params.
        asset.params = {};
        asset.params.sass = obj.params.sass || false;
        asset.params.rename = obj.params.rename || false;
        asset.params.min = obj.params.min || false;
        asset.params.gzip = obj.params.gzip || false;

        ASSETS.push(asset);

        return asset;
    }

    /**
     *
     * @param type
     */
    function runByType(type) {
        var streams;

        streams = [];

        ASSETS.forEach(function (asset) {
            if (asset.type && ASSET_TYPES[type.toUpperCase()] && asset.type.toLowerCase() === type.toLowerCase()) {
                streams.push(build(asset));
            }
        });

        return PLUGINS.es.merge(streams);
    }

    /**
     *
     * @param id
     */
    function runById(id) {
        var streams;

        streams = [];

        ASSETS.forEach(function (asset) {
            if (asset.id && asset.id === id) {
                streams.push(build(asset));
            }
        });

        return PLUGINS.es.merge(streams);
    }

    /**
     *
     * @param type
     * @param tasks
     */
    function watchByType (type, tasks) {
        ASSETS.forEach(function (asset) {
            if (asset.type && ASSET_TYPES[type.toUpperCase()] && asset.type.toLowerCase() === type.toLowerCase()) {
                gulp.watch(asset.src, tasks);
            }
        });
    }

    /**
     *
     * @param id
     * @param tasks
     */
    function watchById (id, tasks) {
        ASSETS.forEach(function (asset) {
            if (asset.id && asset.id === id) {
                gulp.watch(asset.src, tasks);
            }
        });
    }

    /**
     *
     * @param asset
     *
     * @returns {*}
     */
    function build(asset) {
        var options,
            stream;

        options = {};

        if (asset.base !== false) {
            options.base = asset.base;
        }

        stream = gulp.src(asset.src, options);

        // SASS.
        if (asset.params.sass) {
            stream = stream.pipe(PLUGINS.sass().on('error', PLUGINS.sass.logError));
        }

        // Concat & Rename.
        if (asset.params.rename) {
            stream = stream
                .pipe(PLUGINS.concat(asset.params.rename))
                .pipe(gulp.dest(asset.dest));
        }

        switch (asset.type) {
            case ASSET_TYPES.COPY:
                stream = stream.pipe(gulp.dest(asset.dest));
                break;
            case ASSET_TYPES.CSS:
                // Compress CSS.
                if (asset.params.min) {
                    stream = stream
                        .pipe(PLUGINS.cleanCSS({compatibility: 'ie8'}))
                        .pipe(PLUGINS.rename(asset.params.min))
                        .pipe(gulp.dest(asset.dest));
                }
                break;
            case ASSET_TYPES.JS:
                // Make JS Ugly.
                if (asset.params.min) {
                    stream = stream
                        .pipe(PLUGINS.uglify())
                        .pipe(PLUGINS.rename(asset.params.min))
                        .pipe(gulp.dest(asset.dest));
                }
                break;
        }

        // GZip.
        if (asset.params.gzip) {
            stream = stream
                .pipe(PLUGINS.gzip())
                .pipe(gulp.dest(asset.dest));
        }

        return stream;
    }

    return {
        add: add,
        runByType: runByType,
        runById: runById,
        watchByType: watchByType,
        watchById: watchById,
        TYPES: ASSET_TYPES
    };
}());