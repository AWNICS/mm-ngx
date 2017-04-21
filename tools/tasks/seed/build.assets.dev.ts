import * as gulp from 'gulp';
import { join } from 'path';

import { AssetsTask } from '../assets_task';
import Config from '../../config';

/**
 * Executes the build process, copying the assets located in `src/client` over to the appropriate
 * `dist/dev` directory.
 */
export =
  class BuildAssetsTask extends AssetsTask {
<<<<<<< HEAD
    run() {
      let paths: string[] = [
        join(Config.APP_SRC, '**'),
=======
    run(done: any) {
      let paths: string[] = [
        join(Config.APP_SRC, '**'),
        join(Config.NPM_BASE, '@angular', 'service-worker', 'bundles', 'worker-basic.js'),
>>>>>>> a26407968cf5b7270e75b6bdfec46bdbe415fa09
        '!' + join(Config.APP_SRC, '**', '*.ts'),
        '!' + join(Config.APP_SRC, '**', '*.scss'),
        '!' + join(Config.APP_SRC, '**', '*.sass')
            ].concat(Config.TEMP_FILES.map((p) => { return '!' + p; }));

      return gulp.src(paths)
        .pipe(gulp.dest(Config.APP_DEST));
    }
  };
<<<<<<< HEAD

=======
>>>>>>> a26407968cf5b7270e75b6bdfec46bdbe415fa09
