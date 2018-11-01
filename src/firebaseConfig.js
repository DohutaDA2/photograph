import Firebase from "firebase/app";
import "firebase/app";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyBzl6FcLr0BaxAL7wpw8B7zNQa9wlAYk6g",
  authDomain: "moneylover-8b808.firebaseapp.com",
  databaseURL: "https://moneylover-8b808.firebaseio.com",
  projectId: "moneylover-8b808",
  storageBucket: "moneylover-8b808.appspot.com",
  messagingSenderId: "407828220548"
};

const auth = {
  url:
    "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=AIzaSyBzl6FcLr0BaxAL7wpw8B7zNQa9wlAYk6g",
  signUpURL:
    "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyBzl6FcLr0BaxAL7wpw8B7zNQa9wlAYk6g",
  signInURL:
    "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyBzl6FcLr0BaxAL7wpw8B7zNQa9wlAYk6g"
};

const firebaseCore = Firebase.initializeApp(config);
const firestoreCore = firebaseCore.firestore();
firestoreCore.settings({ timestampsInSnapshots: true });

export default firebaseCore;
export { auth };
