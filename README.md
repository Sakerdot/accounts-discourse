# accounts-discourse
[Source code of released version](https://github.com/meteor/meteor/tree/master/packages/accounts-facebook)
***

## Usage
A login service using Discourse SSO as a provider (https://meta.discourse.org/t/using-discourse-as-a-sso-provider/32974). Based on Meteor oauth modules.  
Requires a settings.json such as:
```json
{
    "discourseSecret": "secret key on Discourse SSO admin page",
    "public": {
        "discourseUrl": "Url of the Discourse forum (http://discourse.example.com)"
    }
}
```
You can also define discourseUrl outside public.

To use just call `Meteor.loginWithDiscourse();`