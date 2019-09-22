export const WeddingRSVPs = new Mongo.Collection("WeddingRSVPs");

if (Meteor.isServer) {
    function addToHowMany(id, num) {
        const rsvp = WeddingRSVPs.findOne(id)

        if (!rsvp) return
        if (num < 0 && rsvp.howMany === 0) return

        let howMany = rsvp.howMany + num
        if (howMany < 0) howMany = 0

        WeddingRSVPs.upsert(id, { $set: { howMany } });

        console.log('howMany set: ', WeddingRSVPs.findOne(id))
    }

    Meteor.methods({
        rsvpToWedding(rsvp, id) {
            if (WeddingRSVPs.findOne(id) && ['yes', 'no', 'undecided'].includes(rsvp))
                WeddingRSVPs.upsert(id, { $set: { rsvp } });

            console.log('rsvp clicked: ', WeddingRSVPs.findOne(id))
        },

        incrementHowMany(id) {
            addToHowMany(id, 1)
        },

        decrementHowMany(id) {
            addToHowMany(id, -1)
        },
    });

    Meteor.publish('WeddingRSVPs', function () {
        return WeddingRSVPs.find({});
    });

    Meteor.startup(() => {
        WeddingRSVPs.remove({})

        if (!WeddingRSVPs.find({}).count()) {
            for (const name of people) {
                while (true) {
                    const _id = ('' + Math.floor(Math.random() * 9999999)).padStart(7, '0')

                    if (WeddingRSVPs.findOne(_id)) continue

                    console.log(' ----------------- rsvp for', _id, name)
                    WeddingRSVPs.insert({
                        _id,
                        rsvp: 'undecided',
                        howMany: 0,
                    })

                    break
                }  
            }
        }
    });
}

const people = [
    'Rosana Pea',
    'Leroy Pea',
    'Raquel Pea',
    'Sarah Pea',
    'Jenny Pea',
    'Lisa Sweeney',
    'Trenton Pea',
    'Branden Pea',
    'Corrina Serna',
    'Tía Nelly',
    'Roberto Mulder',
    'Mauricio Mulder',
    //
    'Emma and Solaris',
    'Clyde Brown',
    'Beatriz',
    'Yazmin Guerrero',
    'Cesar Zuniga',
    'Yagiz Mungan',
    "Brianna O'Rourke",
    'Nathan Muldrow',
    'Arnel Comiso',
    'Kyle McGill',
    'Matthew Sewel',
    'Bianca Giusto',
    'Sungmin Gan',
    'Carlos Moreno',
    //
    'Marina Vedernikova',
    //
    'Lilianna Esplino',
    'Eugenia Shermergorn',
    'Irina Mayorova',
    'Dina Beylis',
    'Karina Santos',
]
