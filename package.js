Package.describe({
  name: 'accounts-discourse',
  version: '0.0.1',
  summary: 'A login service using Discourse SSO as a provider',
  git: 'https://github.com/Sakerdot/accounts-discourse',
  documentation: 'README.md',
});

Package.onUse(function(api) {
  api.use('ecmascript', ['client', 'server']);
  api.imply('ecmascript', ['client', 'server']);

  api.use('accounts-base', ['client', 'server']);
  api.imply('accounts-base', ['client', 'server']);

  api.use('reload', 'client');
  api.imply('reload', 'client');

  api.use('random', 'client');
  api.imply('random', 'client');

  api.use('check', 'server');
  api.imply('check', 'server');

  api.use('service-configuration', 'server');
  api.imply('service-configuration', 'server');

  api.mainModule('discourse_client.js', 'client');
  api.mainModule('discourse_server.js', 'server');
});
