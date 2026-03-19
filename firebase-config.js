import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
    get,
    getDatabase,
    onValue,
    orderByChild,
    push,
    query,
    ref,
    set
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyC8Dq9Z16z2cB3Z8ptghEXJmMimWEsEC14",
    authDomain: "senkick-5b737.firebaseapp.com",
    projectId: "senkick-5b737",
    databaseURL: "https://senkick-5b737-default-rtdb.asia-southeast1.firebasedatabase.app/",
    storageBucket: "senkick-5b737.firebasestorage.app",
    messagingSenderId: "53226913836",
    appId: "1:53226913836:web:7a37a9f4b1df37503cd189"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export {
    db,
    get,
    onValue,
    orderByChild,
    push,
    query,
    ref,
    set
};
