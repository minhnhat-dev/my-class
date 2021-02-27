import React, { useRef, useState } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { login } from '../../actions/auth';

const Login = ({ login, isAuthenticated }) => {
    const emailRef = useRef();
    const passwordRef = useRef();

    if (isAuthenticated) {
        return <Redirect to="/" />;
    }

    function handleSubmit(e) {
        e.preventDefault();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        login(email, password);
    }

    return (
        <>
            <Row className="justify-content-md-center mt-50">
                <Col xs lg="5">
                    <Card>
                        <Card.Body>
                            <h2 className="text-center mb-4">Log In</h2>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group id="email">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" ref={emailRef} required />
                                </Form.Group>
                                <Form.Group id="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" ref={passwordRef} required />
                                </Form.Group>
                                <Button className="w-100" type="submit">
                                    Log In
                                </Button>
                            </Form>
                            <div className="w-100 text-center mt-3">
                                <Link to="/forgot-password">Forgot Password?</Link>
                            </div>
                        </Card.Body>
                    </Card>
                    <div className="w-100 text-center mt-2">
                        Need an account?
                        {' '}
                        <Link to="/signup">Sign Up</Link>
                    </div>
                </Col>

            </Row>
        </>
    );
};

Login.propTypes = {

};

const mapStateToProps = (state) => {
    const { isAuthenticated, loading } = state.auth;
    return {
        loading,
        isAuthenticated
    };
};

export default connect(mapStateToProps, { login })(Login);
