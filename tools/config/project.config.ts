import { join } from 'path';

import { SeedConfig } from './seed.config';
// import { ExtendPackages } from './seed.config.interfaces';

/**
 * This class extends the basic seed configuration, allowing for project specific overrides. A few examples can be found
 * below.
 */
export class ProjectConfig extends SeedConfig {

  PROJECT_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'project');

  constructor() {
    super();
    // this.APP_TITLE = 'Put name of your app here';
<<<<<<< HEAD
=======
    // this.GOOGLE_ANALYTICS_ID = 'Your site's ID';
>>>>>>> a26407968cf5b7270e75b6bdfec46bdbe415fa09

    /* Enable typeless compiler runs (faster) between typed compiler runs. */
    // this.TYPED_COMPILE_INTERVAL = 5;

    // Add `NPM` third-party libraries to be injected/bundled.
    this.NPM_DEPENDENCIES = [
      ...this.NPM_DEPENDENCIES,
      // {src: 'jquery/dist/jquery.min.js', inject: 'libs'},
      // {src: 'lodash/lodash.min.js', inject: 'libs'},
    ];

    // Add `local` third-party libraries to be injected/bundled.
    this.APP_ASSETS = [
<<<<<<< HEAD
      ...this.APP_ASSETS,
=======
>>>>>>> a26407968cf5b7270e75b6bdfec46bdbe415fa09
      // {src: `${this.APP_SRC}/your-path-to-lib/libs/jquery-ui.js`, inject: true, vendor: false}
      // {src: `${this.CSS_SRC}/path-to-lib/test-lib.css`, inject: true, vendor: false},
    ];

<<<<<<< HEAD
    this.addPackageBundles({
      name: 'angular-in-memory-web-api',
      path: 'node_modules/angular-in-memory-web-api/bundles/in-memory-web-api.umd.js'
    });

    this.addPackageBundles({
      name: 'ng2-smart-table',
      path: 'node_modules/ng2-smart-table/ng2-smart-table.ts'
    });

    this.addPackageBundles({
      name: 'ng2-completer',
      path: 'node_modules/ng2-completer/ng2-completer.umd.js'
    });
=======
    this.ROLLUP_INCLUDE_DIR = [
      ...this.ROLLUP_INCLUDE_DIR,
      //'node_modules/moment/**'
    ];

    this.ROLLUP_NAMED_EXPORTS = [
      ...this.ROLLUP_NAMED_EXPORTS,
      //{'node_modules/immutable/dist/immutable.js': [ 'Map' ]},
    ];
>>>>>>> a26407968cf5b7270e75b6bdfec46bdbe415fa09

    // Add packages (e.g. ng2-translate)
    // let additionalPackages: ExtendPackages[] = [{
    //   name: 'ng2-translate',
    //   // Path to the package's bundle
    //   path: 'node_modules/ng2-translate/bundles/ng2-translate.umd.js'
    // }];
    //
    // this.addPackagesBundles(additionalPackages);

<<<<<<< HEAD
    /* Add to or override NPM module configurations: */
    // this.mergeObject(this.PLUGIN_CONFIGS['browser-sync'], { ghostMode: false });
=======
    /* Add proxy middleware */
    // this.PROXY_MIDDLEWARE = [
    //   require('http-proxy-middleware')('/api', { ws: false, target: 'http://localhost:3003' })
    // ];

    /* Add to or override NPM module configurations: */
    // this.PLUGIN_CONFIGS['browser-sync'] = { ghostMode: false };
>>>>>>> a26407968cf5b7270e75b6bdfec46bdbe415fa09
  }

}
