const firebaseConfig = {
    apiKey: "AIzaSyC8Dq9Z16z2cB3Z8ptghEXJmMimWEsEC14",
    authDomain: "senkick-5b737.firebaseapp.com",
    projectId: "senkick-5b737",
    databaseURL: "https://senkick-5b737-default-rtdb.asia-southeast1.firebasedatabase.app/",
    storageBucket: "senkick-5b737.firebasestorage.app",
    messagingSenderId: "53226913836",
    appId: "1:53226913836:web:7a37a9f4b1df37503cd189"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

window.SNOENERGY_DB = firebase.database();
