import './globals';
import './methods';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Firebase, { FirebaseContext } from './components/auth-component';

ReactDOM.render( <FirebaseContext.Provider value={ new Firebase() }>
    <App />
</FirebaseContext.Provider>, document.getElementById( 'app' ) );
