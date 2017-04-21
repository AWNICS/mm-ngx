import * as gulp from 'gulp';
import { join } from 'path';

import Config from '../../config';

/**
<<<<<<< HEAD
 * This sample task copies all TypeScript files over to the appropiate `dist/dev|prod|test` directory, depending on the
=======
 * This sample task copies all TypeScript files over to the appropriate `dist/dev|prod|test` directory, depending on the
>>>>>>> a26407968cf5b7270e75b6bdfec46bdbe415fa09
 * current application environment.
 */
export = () => {
  return gulp.src(join(Config.APP_SRC, '**/*.ts'))
    .pipe(gulp.dest(Config.APP_DEST));
};
