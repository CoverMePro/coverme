// import { initializeApp } from 'firebase/app';
// import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// import axios from 'utils/axios-intance';

// const firebaseConfig = {
//     apiKey: 'AIzaSyAWKeAFzmKcmcRz1si1NmmoSQCIxkO_90M',
//     authDomain: 'coverme-47dc7.firebaseapp.com',
//     projectId: 'coverme-47dc7',
//     storageBucket: 'coverme-47dc7.appspot.com',
//     messagingSenderId: '15415320328',
//     appId: '1:15415320328:web:e39295f287accb8285d6bd',
//     measurementId: 'G-7GEF1CWRVX',
// };

// // function requestPermission() {
// //     console.log('Requesting permission...');
// //     Notification.requestPermission().then((permission) => {
// //         if (permission === 'granted') {
// //             console.log('Notification permission granted.');
// //             // Initialize Firebase
// //             const app = initializeApp(firebaseConfig);

// //             // Initialize Firebase Cloud Messaging and get a reference to the service
// //             const messaging = getMessaging(app);

// //             getToken(messaging, {
// //                 vapidKey:
// //                     'BA2sDkdDEU6vq7TZB1ASOGnvepdcX_RXjZzrjlpL2QM7Cw9ICoZOmkhtgqI5AqY2shObyfnz5s7NTX120hiDCkc',
// //             }).then((currentToken) => {
// //                 if (currentToken) {
// //                     console.log('Current Token: ', currentToken);
// //                 } else {
// //                     console.log('Can not get current token');
// //                 }
// //             });

// //             onMessage(messaging, (payload) => {
// //                 console.log('Message received. ', payload);
// //                 // ...
// //                 console.log('TEST TEST TEST');

// //                 // const notificationTitle = payload.notification.title;
// //                 // const notificationOptions = {
// //                 //     icon: window.location.origin + '/cover-me-logo.png',
// //                 //     body: payload.notification.body,
// //                 // };
// //                 // const notification = new Notification(notificationTitle, notificationOptions);
// //                 // console.log(notification);
// //             });
// //         } else {
// //             console.log('Do not have permission!');
// //         }
// //     });
// // }

// console.log('Notification permission granted.');
// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Initialize Firebase Cloud Messaging and get a reference to the service
// const messaging = getMessaging(app);

// getToken(messaging, {
//     vapidKey:
//         'BA2sDkdDEU6vq7TZB1ASOGnvepdcX_RXjZzrjlpL2QM7Cw9ICoZOmkhtgqI5AqY2shObyfnz5s7NTX120hiDCkc',
// }).then((currentToken) => {
//     if (currentToken) {
//         console.log('Current Token: ', currentToken);
//     } else {
//         console.log('Can not get current token');
//     }
// });

// export const onMessageListener = () =>
//     new Promise((resolve) => {
//         onMessage(messaging, (payload) => {
//             resolve(payload);
//         });
//     });

// //requestPermission();
