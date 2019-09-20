export const WeddingRSVPs = new Mongo.Collection("WeddingRSVPs");

if (Meteor.isServer) {
    Meteor.methods({
        rsvpToWedding(yesOrNo, id) {
            if (WeddingRSVPs.findOne(id) && ['yes', 'no', 'undecided'].includes(yesOrNo))
                WeddingRSVPs.upsert(id, { $set: { rsvp: yesOrNo } });
        },
    });

    Meteor.publish('WeddingRSVPs', function () {
        return WeddingRSVPs.find({});
    });
    
    Meteor.startup(() => {
        const people = [
            'Clyde Brown',
            'Yazmin Guerrero',
        ]

        // WeddingRSVPs.remove({})

        if (!WeddingRSVPs.find({}).count()) {
            for (const name of people) {
                const _id = ('' + Math.floor(Math.random() * 9999999)).padStart(7, '0')
                console.log(' ----------------- rsvp for', name, _id)
                WeddingRSVPs.insert({ _id, rsvp: 'undecided' })
            }
        }
    });
}
