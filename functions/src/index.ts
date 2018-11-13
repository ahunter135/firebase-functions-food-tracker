import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);


exports.sendNotification = functions.firestore
.document('chats/{chatID}')
.onCreate((snap, context) => {
    const newValue = snap.data();
    console.log(newValue);
    const payload = {
        notification: {
            title: newValue.sender.fullName,
            body: newValue.message,
            click_action:"FCM_PLUGIN_ACTIVITY"
        },
        data: {
            content: JSON.stringify({
                uid: newValue.sender.uid,
                avatar_image: newValue.sender.avatar_image,
                fullName: newValue.sender.fullName,
                token: newValue.sender.token,
                email: newValue.sender.email
            })
        }
    };
    admin.messaging().sendToDevice(newValue.receiver.token, payload)
    .then(function(success) {
        console.log(success);
    })
    .catch(err => {
        console.log(err);
    });
});

exports.sendConnectionNotification = functions.database.ref('connections/{userID}')
.onCreate(async (snap, context) => {
    const userID = snap.key;
    let accountInfo = await admin.database().ref('user-accounts/' + userID).once('value');
    console.log(accountInfo);
});



