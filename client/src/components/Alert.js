import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Alert } from 'react-bootstrap';

const AlertComponent = ({ alerts = [] }) => (
  <>
    {alerts.length ? alerts.map((error, index) => (
      <Alert key={index} variant="danger">
        {error.message}
      </Alert>
    )) : null }
  </>
);

Alert.propTypes = {
  alerts: PropTypes.array,
};

const mapStateToProps = (state) => ({
  alerts: state.alert,
});
export default connect(mapStateToProps)(AlertComponent);
