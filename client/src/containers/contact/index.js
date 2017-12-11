import React from 'react';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const Contact = props => (
  <div>
    <h1>Contact</h1>
  </div>
);

const mapDispatchToProps = dispatch => bindActionCreators({
  changePage: () => push('/about-us')
}, dispatch);

export default connect(
  null,
  mapDispatchToProps
)(Contact);
