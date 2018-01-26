// Tests for messages methods
//
// https://guide.meteor.com/testing.html

import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { Messages } from './messages.js';
import './methods.js';

if (Meteor.isServer) {
  describe('messages methods', function () {
    beforeEach(function () {
      Messages.remove({});
    });

    it('can add a new link', function () {
      const handler = Meteor.server.method_handlers['messages.insert'];

      handler.apply({}, ['Hello, this is a message!']);

      assert.equal(Messages.find().count(), 1);
    });
  });
}
