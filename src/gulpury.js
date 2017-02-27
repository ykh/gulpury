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
        PLUGINS.htmlReplace = require('gulp-html-replace');
        PLUGINS.replace = require('gulp-replace');
        PLUGINS.sourcemaps = require('gulp-sourcemaps');
    })();

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
        asset.params.htmlReplace = obj.params.htmlReplace || false;
        asset.params.replace = obj.params.replace || false;
        asset.params.sourcemaps = obj.params.sourcemaps || false;

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

        // Replace.
        if (asset.params.replace) {
            var replace;

            replace = asset.params.replace;

            if (Array.isArray(replace)) {
                replace.forEach(function (item) {
                    if (Array.isArray(item)) {
                        stream = stream
                            .pipe(PLUGINS.replace(item[0], item[1]))
                    }
                })
            }
        }

        // HTML Replace.
        if (asset.params.htmlReplace) {
            stream = stream
                .pipe(PLUGINS.htmlReplace(asset.params.htmlReplace))
        }

        // Concat & Rename.
        if (asset.params.rename) {
            stream = stream
                .pipe(PLUGINS.concat(asset.params.rename));
        }

        // Source Maps Initialize.
        if (asset.params.sourcemaps) {
            stream = stream
                .pipe(PLUGINS.sourcemaps.init())
        }

        // CSS.
        if (asset.type === ASSET_TYPES.CSS) {
            // Compress CSS.
            if (asset.params.min) {
                stream = stream
                    .pipe(PLUGINS.cleanCSS({compatibility: 'ie8'}))
                    .pipe(PLUGINS.rename(asset.params.min))
                    .pipe(gulp.dest(asset.dest));
            }
        }

        // JS.
        if (asset.type === ASSET_TYPES.JS) {
            // Make JS Ugly.
            if (asset.params.min) {
                stream = stream
                    .pipe(PLUGINS.uglify())
                    .pipe(PLUGINS.rename(asset.params.min))
                    .pipe(gulp.dest(asset.dest));
            }
        }

        // GZip.
        if (asset.params.gzip) {
            // DO NOT Change Stream because of SourceMaps Conflicts.
            stream
                .pipe(PLUGINS.gzip())
                .pipe(gulp.dest(asset.dest));
        }

        // Source Maps Write.
        if (asset.params.sourcemaps) {
            stream = stream.pipe(PLUGINS.sourcemaps.write('.'));
        }

        stream.pipe(gulp.dest(asset.dest));

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