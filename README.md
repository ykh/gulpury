# gulpury

**Gulpury is a [Gulp](https://github.com/gulpjs/gulp) plugin that helps you to write your tasks quick.**

## Gulpury as a Wrapper Provides these Kind of Jobs

- Copy Sources to Destination.
- Compile Your SASS Files to CSS ([gulp-sass](https://github.com/dlmanning/gulp-sass)).
- Minify Your CSS Files with ([gulp-clean-css](https://github.com/scniro/gulp-clean-css)).
- Minify/Uglify Your JS Files with ([gulp-uglify](https://github.com/terinjokes/gulp-uglify)).
- Concat Files with ([gulp-concat](https://github.com/contra/gulp-concat)).
- Rename Files with ([gulp-rename](https://github.com/hparra/gulp-rename)).
- GZip Files with ([gulp-gzip](https://github.com/jstuckey/gulp-gzip)).
- Replace String with another String in Your Text Files by Using ([gulp-replace](https://github.com/lazd/gulp-replace)).
- Replace Block of String in Your Text Files by Using ([gulp-html-replace](https://github.com/VFK/gulp-html-replace)).

## List of Plugins

```json
{
    "gulp-clean-css": "^2.3.2", 
    "gulp-concat": "^2.6.1",
    "gulp-gzip": "^1.4.0",
    "gulp-html-replace": "^1.6.2",
    "gulp-rename": "^1.2.2",
    "gulp-replace": "^0.5.4",
    "gulp-sass": "^3.1.0",
    "gulp-uglify": "^2.0.1"
}
```

## Install

```
npm install --save-dev gulpury
```

## Basic Usage
```js
var gulp = require('gulp');
var gulpury = require('gulpury');

// When You Want Copy some Sources to another Directory.
gulpury.add('i-want-copy-these', gulpury.TYPES.COPY, {
    src: [
        './src/*.html',
        './src/img/**'
    ],
    dest: './dist',
    base: './src'
});

// When You Want Replace Some Text in Your Text Files such as HTML Files.
gulpury.add('replace-version-with', gulpury.TYPES.COPY, {
    src: [
        './src/index.html',
        './src/layout.html'
    ],
    dest: './dist',
    params: {
        replace: [
            ['%version-js%', '1.0.0'],
            ['%version-css%', '0.1.0']
        ]
    }
});

// When You Want Compress some Files in GZip.
gulpury.add('oh-gzip', gulpury.TYPES.COPY, {
    src: [
        './src/assets/css/theme.min.css'
    ],
    dest: './dist/assets/css',
    params: {
        gzip: true
    }
});

// When You Want Compile/Minify/GZip Your SASS Files.
gulpury.add('css-from-sass', gulpury.TYPES.CSS, {
    src: [
        './src/assets/sass/style.scss'
    ],
    dest: './dist/assets/css',
    params: {
        sass: true,
        min: 'style.min.css',
        gzip: true
    }
});

// When You Want only Watch on Some Sources.
gulpury.add('watch-me', gulpury.TYPES.WATCH, {
    src: [
        './src/assets/sass/_common.scss'
    ]
});

// When You Want Uglify/GZip Your JS Files.
gulpury.add('hot-js', gulpury.TYPES.JS, {
    src: [
        './src/assets2/js/script.js'
    ],
    dest: './dist/assets2/js',
    params: {
        min: 'script.min.js',
        gzip: true
    }
});

/**
 * Run All Gulpury Assets with Type COPY.
 */
gulp.task('copy', function () {
    return gulpury.runByType(gulpury.TYPES.COPY);
});

/**
 * Watch All Sources in Gulpury Assets with Type COPY.
 */
gulp.task('copy:watch', ['copy'], function () {
    gulpury.watchByType(gulpury.TYPES.COPY, ['copy']);
});

/**
 * Run All Gulpury Assets with Type CSS.
 */
gulp.task('css', function () {
    return gulpury.runByType('css');
});

/**
 *
 */
gulp.task('css:watch', ['css'], function () {
   gulpury.watchByType(gulpury.TYPES.CSS, ['css']);
   gulpury.watchById('watch-me', ['css']);
});

/**
 * Run Gulpury Asset with Id 'hot-js'.
 */
gulp.task('js', function () {
    return gulpury.runById('hot-js');
});

/**
 * Watch Gulpury Assets with Id 'hot-js'
 */
gulp.task('js:watch', ['js'], function () {
    gulpury.watchById('hot-js', ['js']);
});
```

## Options

**All Asset TYPES:**

- ASSET_TYPES.WATCH
- ASSET_TYPES.COPY
- ASSET_TYPES.CSS
- ASSET_TYPES.JS

**Asset Params**
```js
var params = {
    src: 'sources',
    dest: 'destination-directory',
    base: 'base-directory',
    params: {
        sass: true, // Default Is False.
        rename: 'file-new-name', // e.g: style.min.css
        min: true, // Default Is False.
        gzip: true, // Default Is False.
        htmlReplace: { // According to gulp-html-replace Doc.
            'css1block': 'css/plugins.min.css?2.19',
            'css2block': 'css/style.min.css?2.19'
        },
        replace: [ // You Can Define Multiple Replacements.
           ['%placeholder1%', 'text1'],
           ['##placeholder2##', 'text2'],
           ['REPLACE_ME', 'text3']
        ]
    }
};
```
