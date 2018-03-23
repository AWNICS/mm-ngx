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
    // this.GOOGLE_ANALYTICS_ID = 'Your site's ID';

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
      // {src: `${this.APP_SRC}/your-path-to-lib/libs/jquery-ui.js`, inject: true, vendor: false}
      // {src: `${this.CSS_SRC}/path-to-lib/test-lib.css`, inject: true, vendor: false},
    ];

    this.ROLLUP_INCLUDE_DIR = [
      ...this.ROLLUP_INCLUDE_DIR,
      //'node_modules/moment/**'
    ];

    this.ROLLUP_NAMED_EXPORTS = [
      ...this.ROLLUP_NAMED_EXPORTS,
      //{'node_modules/immutable/dist/immutable.js': [ 'Map' ]},
    ];

    this.addPackageBundles({
      name: 'angular-in-memory-web-api',
      path: 'node_modules/angular-in-memory-web-api/bundles/in-memory-web-api.umd.js'
    });

    this.addPackageBundles({
      name: 'ng2-smart-table',
      path: 'node_modules/ng2-smart-table/bundles/table.umd.js'
    });

    this.addPackageBundles({
      name: 'ng2-completer',
      path: 'node_modules/ng2-completer/ng2-completer.umd.js'
    });

    this.addPackageBundles({
      name: 'lodash',
      path: 'node_modules/lodash/lodash.js'
    });

    this.addPackageBundles({
      name: 'ngx-rating',
      path: 'node_modules/ngx-rating/index.js'
    });

    this.addPackageBundles({
      name: 'ng2-page-scroll',
      path: 'node_modules/ng2-page-scroll/bundles/ng2-page-scroll.umd.js'
    });

    this.addPackageBundles({
      name: 'socket.io-client',
      path: 'node_modules/socket.io-client/dist/socket.io.slim.js'
    });

    this.addPackageBundles({
      name: 'moment',
      path: 'node_modules/moment/moment.js'
    });

    // Add packages (e.g. ng2-translate)
    // let additionalPackages: ExtendPackages[] = [{
    //   name: 'ng2-translate',
    //   // Path to the package's bundle
    //   path: 'node_modules/ng2-translate/bundles/ng2-translate.umd.js'
    // }];
    //
    // this.addPackagesBundles(additionalPackages);

    /* Add proxy middleware */
    // this.PROXY_MIDDLEWARE = [
    //   require('http-proxy-middleware')('/api', { ws: false, target: 'http://localhost:3003' })
    // ];

    /* Add to or override NPM module configurations: */
    // this.PLUGIN_CONFIGS['browser-sync'] = { ghostMode: false };
  }

}
