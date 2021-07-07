import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Alert } from 'react-bootstrap';

const AlertNotify = ({ alerts }) => (
    alerts && alerts.map((item, index) => (
        <Alert key={index} variant={item.variant}>
            {item.message}
        </Alert>
    ))
);

AlertNotify.propTypes = {
    alerts: PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
    alerts: state.alert
});

export default connect(mapStateToProps)(AlertNotify);
