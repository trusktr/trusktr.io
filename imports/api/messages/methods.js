// Methods related to messages

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Messages } from './messages.js';

Meteor.methods({
    'messages.insert'(value) {
        check(value, String);

        return Messages.insert({
            value,
            time: Date.now(),
        });
    },
});
