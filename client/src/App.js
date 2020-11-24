/* eslint-disable react/react-in-jsx-scope */
import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Provider } from 'react-redux';
import NavBar from './components/NavBar';
import Landing from './components/Landing';
import Footer from './components/Footer';
import Login from './components/Login';
import { Authentication } from './contexts/Auth';
import { loadUser } from './actions/auth';
import { LOGOUT } from './actions/types';
import Register from './components/Register';
// Redux
import store from './store';
import setAuthToken from './utils/setAuthToken';

function App() {
  useEffect(() => {
    // check for token in LS
    console.log('localStorage', localStorage);
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    store.dispatch(loadUser());
    // log user out from all tabs if they log out in one tab
    window.addEventListener('storage', () => {
      if (!localStorage.token) store.dispatch({ type: LOGOUT });
    });
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <NavBar />
          <Container>
            <Authentication>
              <Switch>
                <Route path="/" exact component={Landing} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
              </Switch>
            </Authentication>
          </Container>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
