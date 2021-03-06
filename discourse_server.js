import { createHmac } from 'crypto';
import { parse } from 'querystring';

Accounts.registerLoginHandler('discourse', (options) => {
  check(options, {
    nonce: String,
    returnQuery: String,
  });

  const config = ServiceConfiguration.configurations.findOne({ service: 'discourse' });
  if (!config || !config.secret) {
    return {
      type: 'discourse',
      error: new Meteor.Error(
        Accounts.LoginCancelledError.numericError,
        'Discourse not configured or missing secret',
      ),
    };
  }

  const { nonce, returnQuery } = options;

  const parsedQuery = parse(returnQuery);

  check(parsedQuery, {
    sso: String,
    sig: String,
  });

  const { sso, sig } = parsedQuery;

  const payloadHmac = createHmac('sha256', config.secret).update(sso).digest('hex');

  if (payloadHmac === sig) {
    const payload = parse(Buffer.from(sso, 'base64').toString());

    if (payload.nonce === nonce) {
      const result = {
        id: Number(payload.external_id),
        username: payload.username,
        admin: payload.admin === 'true',
        moderator: payload.moderator === 'true',
        email: payload.email,
      };

      if (config.onlyLoginAdmins && config.onlyLoginMods && !(result.admin || result.moderator)) {
        return {
          type: 'discourse',
          error: new Meteor.Error(
            Accounts.LoginCancelledError.numericError,
            'User is neither an admin nor a moderator',
          ),
        };
      } else if (config.onlyLoginAdmins && !config.onlyLoginMods && !result.admin) {
        return {
          type: 'discourse',
          error: new Meteor.Error(
            Accounts.LoginCancelledError.numericError,
            'User is not an admin',
          ),
        };
      } else if (config.onlyLoginMods && !config.onlyLoginAdmins && !result.moderator) {
        return {
          type: 'discourse',
          error: new Meteor.Error(
            Accounts.LoginCancelledError.numericError,
            'User is not a moderator',
          ),
        };
      }

      return Accounts.updateOrCreateUserFromExternalService('discourse', result);
    }
  }

  return {
    type: 'discourse',
    error: new Meteor.Error(
      Accounts.LoginCancelledError.numericError,
      'Bad result from Discourse',
    ),
  };
});


Meteor.methods({
  'discourse.getUrl': ({ nonce, returnUrl }) => {
    check(nonce, String);
    check(returnUrl, String);

    const config = ServiceConfiguration.configurations.findOne({ service: 'discourse' });
    if (!config || !config.url || !config.secret) {
      throw new ServiceConfiguration.ConfigError();
    }

    const payloadBase64 = Buffer.from(`nonce=${nonce}&return_sso_url=${returnUrl}`).toString('base64');
    const payloadURIEncoded = encodeURIComponent(payloadBase64);

    const signature = createHmac('sha256', config.secret).update(payloadBase64).digest('hex');

    const discourseUrl = config.url.slice(-1) === '/' ? config.url : `${config.url}/`;

    return `${discourseUrl}session/sso_provider?sso=${payloadURIEncoded}&sig=${signature}`;
  },
});
