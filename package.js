Package.describe({
  name: 'sakerdot:accounts-discourse',
  version: '1.0.1',
  summary: 'A login service using Discourse SSO as a provider',
  git: 'https://github.com/Sakerdot/accounts-discourse',
  documentation: 'README.md',
});

Package.onUse(function(api) {
  api.versionsFrom('1.4.2');

  api.use('ecmascript', ['client', 'server']);
  api.use('reload', 'client');
  api.use('random', 'client');
  api.use('check', 'server');
  
  api.use('accounts-base', ['client', 'server']);
  api.imply('accounts-base', ['client', 'server']);

  api.use('service-configuration', ['client', 'server']);
  api.imply('service-configuration', ['client', 'server']);

  api.mainModule('discourse_client.js', 'client');
  api.mainModule('discourse_server.js', 'server');
});
