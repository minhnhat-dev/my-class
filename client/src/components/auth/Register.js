import React, { useRef, useState } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register } from '../../actions/auth';

const Register = ({ register, isAuthenticated }) => {
    const emailRef = useRef();
    const nameRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();

    if (isAuthenticated) {
        return <Redirect to="/" />;
    }

    function handleSubmit(e) {
        e.preventDefault();
        const name = nameRef.current.value;
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const passwordConfirm = passwordConfirmRef.current.value;
        const data = {
            name,
            email,
            password,
            passwordConfirm
        };
        register(data);
    }

    return (
        <>
            <Row className="justify-content-md-center mt-50">
                <Col xs lg="5">
                    <Card>
                        <Card.Body>
                            <h2 className="text-center mb-4">Sign Up</h2>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group id="name">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" ref={nameRef} required />
                                </Form.Group>
                                <Form.Group id="email">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" ref={emailRef} required />
                                </Form.Group>
                                <Form.Group id="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" ref={passwordRef} required />
                                </Form.Group>
                                <Form.Group id="password-confirm">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control type="password" ref={passwordConfirmRef} required />
                                </Form.Group>
                                <Button className="w-100" type="submit">
                                    Register
                                </Button>
                            </Form>
                            <p className="my-1">
                                Already have an account?
                                {' '}
                                <Link to="/login">Sign In</Link>
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

Register.propTypes = {
    loading: PropTypes.func,
    isAuthenticated: PropTypes.bool
};

const mapStateToProps = (state) => {
    const { isAuthenticated, loading } = state.auth;
    return {
        loading,
        isAuthenticated
    };
};

export default connect(mapStateToProps, { register })(Register);
