// migrated to a new collection called WeddingInvitations, so clear this one.
const WeddingRSVPs = new Mongo.Collection("WeddingRSVPs");
if (Meteor.isServer) Meteor.startup(() => WeddingRSVPs.remove({}))

export const WeddingInvitations = new Mongo.Collection("WeddingInvitations");

const RESET_WEDDING_INVITATIONS = false

if (Meteor.isServer) {
    function addToHowMany(id, num) {
        const rsvp = WeddingInvitations.findOne(id)

        if (!rsvp) return
        if (num < 0 && rsvp.howMany === 0) return

        let howMany = rsvp.howMany + num
        if (howMany < 0) howMany = 0

        WeddingInvitations.upsert(id, { $set: { howMany } });

        console.log('howMany set: ', WeddingInvitations.findOne(id))
    }

    Meteor.methods({
        rsvpToWedding(rsvp, id) {
            if (WeddingInvitations.findOne(id) && ['yes', 'no', 'undecided'].includes(rsvp))
                WeddingInvitations.upsert(id, { $set: { rsvp } });

            console.log('rsvp clicked: ', WeddingInvitations.findOne(id))
        },

        incrementHowMany(id) {
            addToHowMany(id, 1)
        },

        decrementHowMany(id) {
            addToHowMany(id, -1)
        },
    });

    Meteor.publish('WeddingInvitations', function () {
        return WeddingInvitations.find({});
    });

    Meteor.startup(() => {
        if (RESET_WEDDING_INVITATIONS) WeddingInvitations.remove({})

        for (const name of people) {
            if (!WeddingInvitations.findOne({name: {$eq: name}})) {
                while (true) {
                    const _id = ('' + Math.floor(Math.random() * 9999999)).padStart(7, '0')

                    if (WeddingInvitations.findOne(_id)) continue

                    console.log(' ----------------- rsvp for', _id, name)
                    WeddingInvitations.insert({
                        _id,
                        name,
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
    'Richard Pea',
    'Lisa Sweeney',
    'Trenton Pea',
    'Branden Pea',
    'Corrina Serna',
    'Tía Nelly',
    'Roberto Mulder',
    'Mauricio Mulder',
    'Pilar Orbegoso Puelles',
    'Ramon Orbegoso Puelles',
    'Isaac Pea',
    'Jessica Pea',
    'Terry Pea',
    'Yvonne Pea',
    //
    'Emma Hawk',
    'Clyde Brown',
    'Beatriz Marquez',
    'Yazmin Guerrero',
    'Cesar Zuniga',
    'Yagiz Mungan',
    'Elif Selin Baytok',
    "Brianna O'Rourke",
    'Nathan Muldrow',
    'Arnel Comiso',
    'Kyle McGill',
    'Matthew Sewel',
    'Bianca Giusto',
    'Sungmin Gan',
    'Carlos Moreno',
    'Shannie Chen',
    'Gloria Guerrero',
    //
    'Marina Vedernikova',
    'Anna Vedernikova',
    'Ivan Vedernikov',
    'Diana Vedernikova',
    //
    'Lilianna Esplino',
    'Eugenia Shermergorn',
    'Irina Mayorova',
    'Dina Beylis',
    'Karina Santos',
    "Randy'L Teton",
    'Lyndsi Holbrook',
    'Rafaella Pedroso',
    'Paula Maya',
    'Lynette Tolbert',
    'Margarita Dmitrieva',
]
