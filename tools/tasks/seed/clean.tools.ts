import { clean } from '../../utils';
import { join } from 'path';

import Config from '../../config';

/**
 * Removes all the js, js.map from the tools directories
 *
<<<<<<< HEAD
 * NB: this needs to remain syncronus, or check.tools will
=======
 * NB: this needs to remain syncronous, or check.tools will
>>>>>>> a26407968cf5b7270e75b6bdfec46bdbe415fa09
 * need to be updated to handle the returned promise/stream
 *
 */
export = clean([
  'gulpfile.js',
  'gulpfile.js.map',
  join(Config.TOOLS_DIR, '**/*.js'),
  join(Config.TOOLS_DIR, '**/*.js.map')
]);

