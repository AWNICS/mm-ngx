import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import { join, sep, normalize } from 'path';
import * as slash from 'slash';

import Config from '../../config';
import { TemplateLocalsBuilder } from '../../utils';

const plugins = <any>gulpLoadPlugins();

/**
 * Executes the build process, injecting the JavaScript and CSS dependencies into the `index.html` for the production
 * environment.
 */
export = () => {
  return gulp.src(join(Config.APP_SRC, 'index.html'))
    .pipe(injectJs())
    .pipe(injectCss())
<<<<<<< HEAD
    .pipe(plugins.template(new TemplateLocalsBuilder().wihtoutStringifiedEnvConfig().build()))
=======
    .pipe(plugins.template(new TemplateLocalsBuilder().withoutStringifiedEnvConfig().build()))
>>>>>>> a26407968cf5b7270e75b6bdfec46bdbe415fa09
    .pipe(gulp.dest(Config.APP_DEST));
};

/**
 * Injects the given file array and transforms the path of the files.
 * @param {Array<string>} files - The files to be injected.
 */
function inject(...files: Array<string>) {
    return plugins.inject(gulp.src(files, { read: false }), {
        files,
        transform: transformPath()
    });
}

/**
 * Injects the bundled JavaScript shims and application bundles for the production environment.
 */
function injectJs() {
  return inject(join(Config.JS_DEST, Config.JS_PROD_SHIMS_BUNDLE), join(Config.JS_DEST, Config.JS_PROD_APP_BUNDLE));
}

/**
 * Injects the bundled CSS files for the production environment.
 */
function injectCss() {
<<<<<<< HEAD
  return inject(join(Config.CSS_DEST, Config.CSS_PROD_BUNDLE));
=======
  return inject(join(Config.CSS_DEST, `${Config.CSS_BUNDLE_NAME}.css`));
>>>>>>> a26407968cf5b7270e75b6bdfec46bdbe415fa09
}

/**
 * Transform the path of a dependency to its location within the `dist` directory according to the applications
 * environment.
 */
function transformPath() {
  return function(filepath: string) {
    let path: Array<string> = normalize(filepath).split(sep);
    let slice_after = path.indexOf(Config.APP_DEST);
    if (slice_after > -1) {
      slice_after++;
    } else {
      slice_after = 3;
    }
<<<<<<< HEAD
    arguments[0] = Config.APP_BASE + path.slice(slice_after, path.length).join(sep) + `?${Date.now()}`;
=======
    arguments[0] = Config.APP_BASE + path.slice(slice_after, path.length).join(sep);
    const queryString = Config.QUERY_STRING_GENERATOR();
    if (queryString) {
      arguments[0] += `?${queryString}`;
    }
>>>>>>> a26407968cf5b7270e75b6bdfec46bdbe415fa09
    return slash(plugins.inject.transform.apply(plugins.inject.transform, arguments));
  };
}
