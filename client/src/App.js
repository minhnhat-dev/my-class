/* eslint-disable react/react-in-jsx-scope */
import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import NavBar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Footer from './components/layout/Footer';
import Routes from './components/routing/Routes';
import { loadUser } from './actions/auth';
import { LOGOUT } from './actions/types';
// Redux
import store from './store';
import setAuthToken from './utils/setAuthToken';

function App() {
    useEffect(() => {
    // check for token in LS
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
                    <Switch>
                        <Route path="/" exact component={Landing} />
                        <Route component={Routes} />
                    </Switch>
                    <Footer />
                </div>
            </Router>
        </Provider>
    );
}

export default App;
