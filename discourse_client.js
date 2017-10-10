function convertError(err) {
  if (err && err instanceof Meteor.Error &&
      err.error === Accounts.LoginCancelledError.numericError) {
    return new Accounts.LoginCancelledError(err.reason);
  }

  return err;
}

function getNonceAfterRedirect() {
  const migrationData = Reload._migrationData('discourse');

  if (!migrationData || !migrationData.nonce) {
    return null;
  }

  return migrationData.nonce;
}

function requestCredential() {
  const nonce = Random.secret();

  Reload._onMigrate('discourse', () => [true, { nonce }]);
  Reload._migrate(null, { immediateMigration: true });

  Meteor.call('discourse.getUrl', { nonce }, (err, url) => {
    if (!err && url) {
      window.location.replace(url);
    }
  });
}

if (Meteor.isClient) {
  const loginWithDiscourse = () => {
    requestCredential();
  };

  Accounts.registerClientLoginFunction('discourse', loginWithDiscourse);
  Meteor.loginWithDiscourse = () => Accounts.applyLoginFunction('discourse', arguments);
}

Meteor.startup(() => {
  const nonce = getNonceAfterRedirect();
  if (nonce) {
    const returnQuery = window.location.search.slice(1);
    if (!returnQuery) {
      return;
    }

    const methodName = 'login';
    const methodArguments = {
      nonce,
      returnQuery,
    };

    Accounts.callLoginMethod({
      methodArguments: [methodArguments],
      userCallback: (err) => {
        err = convertError(err);

        Accounts._pageLoadLogin({
          type: 'discourse',
          allowed: !err,
          error: err,
          methodName,
          methodArguments,
        });
      },
    });
  }
});
