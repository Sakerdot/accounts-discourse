import { createHmac } from 'crypto';
import { parse } from 'querystring';

Accounts.registerLoginHandler('discourse', (options) => {
  check(options, {
    nonce: String,
    returnQuery: String,
  });

  if (!Meteor.settings.discourseSecret) {
    return {
      type: 'discourse',
      error: new Meteor.Error(
        Accounts.LoginCancelledError.numericError,
        'Discourse secret SSO key not set on settings',
      ),
    };
  }

  const { nonce, query } = options;

  const parsedQuery = parse(query);

  check(parsedQuery, {
    sso: String,
    sig: String,
  });

  const { sso, sig } = parsedQuery;

  const payloadHmac = createHmac('sha256', Meteor.settings.discourseSecret).update(sso).digest('hex');

  if (payloadHmac === sig) {
    const payload = parse(Buffer.from(sso, 'base64').toString());

    if (payload.nonce === nonce) {
      const result = {
        id: payload.external_id,
        username: payload.username,
        admin: payload.admin,
        moderator: payload.moderator,
      };

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
  'discourse.getUrl': ({ nonce }) => {
    check(nonce, String);

    if (!Meteor.settings.discourseSecret) {
      throw new Meteor.Error(500, 'Discourse secret SSO key not set on settings');
    }

    const discourseUrl = Meteor.settings.public.discourseUrl || Meteor.settings.discourseUrl;

    if (!discourseUrl) {
      throw new Meteor.Error(500, 'Discourse url not set on settings');
    }

    const returnUrl = Meteor.absoluteUrl('discourse/sso/');

    const payloadBase64 = Buffer.from(`nonce=${nonce}&return_sso_url=${returnUrl}`).toString('base64');
    const payloadURIEncoded = encodeURIComponent(payloadBase64);

    const signature = createHmac('sha256', Meteor.settings.discourseSecret).update(payloadBase64).digest('hex');

    return `${discourseUrl}/session/sso_provider?sso=${payloadURIEncoded}&sig=${signature}`;
  },
});
