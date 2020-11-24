import React from 'react';
import { Link } from 'react-router-dom';
import Alert from './Alert';

export default function Landing() {
  return (
    <>
      <section className="landing">
        <Alert />
        <div className="dark-overlay">
          <div className="landing-inner">
            <h1 className="x-large">Developer Connector</h1>
            <p className="lead">
              Create a developer profile/portfolio, share posts and get help from
              other developers
            </p>
            <div className="buttons">
              <Link className="btn btn-info" to="/register">Sign Up</Link>
              <Link className="btn btn-primary" to="/login">Login</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
