Package.describe({
  name: 'accounts-discourse',
  version: '0.0.1',
  summary: 'A login service using Discourse SSO as a provider',
  // URL to the Git repository containing the source code for this package.
  git: '',
  documentation: 'README.md',
});

Package.onUse(function(api) {
  api.use('ecmascript', ['client', 'server']);
  api.use('accounts-base', ['client', 'server']);
  api.use('reload', 'client');
  api.use('random', 'client');
  api.use('check', 'server');

  api.mainModule('discourse_client.js', 'client');
  api.mainModule('discourse_server.js', 'server');
});
