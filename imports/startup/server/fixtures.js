// Fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';
import { Links } from '/imports/api/links/links.js';
import { Messages } from '../../api/messages/messages.js';

export function createFixtures() {
  // if the Links collection is empty
  if (Links.find().count() === 0) {
    const data = [
      {
        title: 'Do the Tutorial',
        url: 'https://www.meteor.com/try',
        createdAt: new Date(),
      },
      {
        title: 'Follow the Guide',
        url: 'http://guide.meteor.com',
        createdAt: new Date(),
      },
      {
        title: 'Read the Docs',
        url: 'https://docs.meteor.com',
        createdAt: new Date(),
      },
      {
        title: 'Discussions',
        url: 'https://forums.meteor.com',
        createdAt: new Date(),
      },
    ];

    data.forEach(link => Links.insert(link));
  }

    if (Messages.find().count() === 0) {
        [
            { value: 'This is a message.', time: Date.now(), },
            { value: 'This is another message.', time: Date.now(), },
            { value: 'This is the third message.', time: Date.now(), },
        ].forEach(msg => Messages.insert(msg));
    }
}
