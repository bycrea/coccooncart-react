import './css/App.css';
import './css/Cart.css';
import './css/Wallet.css';
import './css/Todo.css';
import './css/Wel-Log-Nav.css';

import React from 'react';
import App from './App';
import HttpsRedirect from 'react-https-redirect';
import { CookiesProvider } from 'react-cookie';
 
export default function Root() {
  return (
    <CookiesProvider>
      <HttpsRedirect>
        <App />
      </HttpsRedirect>
    </CookiesProvider>
  );
}