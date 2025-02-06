import app from 'firebase/app';
import 'firebase/auth';
 
const config = {
    apiKey: "AIzaSyC6CDEqrGP2nF8foeovQHBp0PCj0yHM4Uc",
    authDomain: "feelrouk.firebaseapp.com",
    projectId: "feelrouk",
    storageBucket: "feelrouk.appspot.com",
    messagingSenderId: "900765357722",
    appId: "1:900765357722:web:897e309a9064a3e54db123",
    measurementId: "G-YRS47SG252",
};
 
class Firebase {
    constructor() {
        app.initializeApp( config );
        this.auth = app.auth();
    }
    // *** Auth API ***
    doCreateUserWithEmailAndPassword = ( email, password ) => this.auth.createUserWithEmailAndPassword( email, password );
    doSignInWithEmailAndPassword = ( email, password ) => this.auth.signInWithEmailAndPassword( email, password );
    doSignOut = () => this.auth.signOut();
    doPasswordReset = email => this.auth.sendPasswordResetEmail( email );
    doPasswordUpdate = password => this.auth.currentUser.updatePassword( password );
}
 
export default Firebase;
