window.name = "NG_DEFER_BOOTSTRAP!";

require.config({
  baseUrl: "/",
  paths: {
    'angular':          'vendors/angular.min',
    'angularRouter':    'vendors/angular-ui-router',
    'angularResource':  'vendors/angular-resource',
    'templates':        'assets/scripts/templates',
  },
  priority: [
                        'angular'
  ],
  shim: {
    'angular':          {exports: 'angular'},
    'angularRouter':    ['angular'],
    'angularResource':  ['angular'],
    'templates':        ['angular']
  },
  deps: ['app']
});
