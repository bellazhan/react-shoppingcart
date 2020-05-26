import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAJNFF9Z5pHBD-Z9uU6pQ7Jz4coIIOjxGI",
    authDomain: "shopping-cart-d8b92.firebaseapp.com",
    databaseURL: "https://shopping-cart-d8b92.firebaseio.com",
    projectId: "shopping-cart-d8b92",
    storageBucket: "shopping-cart-d8b92.appspot.com",
    messagingSenderId: "1094138937331",
    appId: "1:1094138937331:web:7a7f80419f69bbf5c69c86",
    measurementId: "G-HZ4B48J1GC"
};

firebase.initializeApp(firebaseConfig);

export default firebase;