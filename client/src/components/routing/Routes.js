import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Register from '../auth/Register';
import Login from '../auth/Login';
import AlertNotify from '../layout/Alert';
import Posts from '../posts/Posts';
import Post from '../post/Post';
import NotFound from '../layout/NotFound';
import PrivateRoute from './PrivateRoute';
import ProfileForm from '../profile-forms/ProfileForm';

const Routes = (props) => (
    <section className="container">
        <AlertNotify />
        <Switch>
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <PrivateRoute exact path="/users/:id/profile" component={ProfileForm} />
            <PrivateRoute exact path="/posts" component={Posts} />
            <PrivateRoute exact path="/posts/:id" component={Post} />
            <Route component={NotFound} />
        </Switch>
    </section>
);

export default Routes;
