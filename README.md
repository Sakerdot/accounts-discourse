# accounts-discourse
[Source code of released version](https://github.com/meteor/meteor/tree/master/packages/accounts-facebook)
***

## Summary
A login service using [Discourse SSO as a provider](https://meta.discourse.org/t/using-discourse-as-a-sso-provider/32974). Based on Meteor oauth modules.

## Usage
Requires a [service](https://docs.meteor.com/api/accounts.html#service-configuration) to be configured like this:
```javascript
ServiceConfiguration.configurations.upsert(
    { service: 'discourse' },
    {
        $set: {
            secret: 'secret',
            url: 'http://example.discourse.com',
        },
    },
);
```
I recommend setting secret and url outside of source code in a settings.json file. Read more about it [here](https://docs.meteor.com/api/core.html#Meteor-settings).  
Secret won't be exposed to the client.

To use just call `Meteor.loginWithDiscourse();` on the client.