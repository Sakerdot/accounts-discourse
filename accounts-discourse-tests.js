// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by accounts-discourse.js.
import { name as packageName } from "meteor/accounts-discourse";

// Write your tests here!
// Here is an example.
Tinytest.add('accounts-discourse - example', function (test) {
  test.equal(packageName, "accounts-discourse");
});
