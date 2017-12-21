import React, { Component } from 'react';
import { Route } from 'react-router-dom'
import { connect } from 'react-redux';
import styled from 'styled-components';
import { getListings } from '../../actions';

import Nav from '../nav';
import Home from '../home';
import About from '../about';
import Contact from '../contact';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: null,
    };
    this.getListings = this.getListings.bind(this);
    this.initializeMap = (map) => this.setState({ ...this.state, map });
  }

  getListings(location, distance = 30) {
    if (this.props.getListings) {
      this.props.getListings(location, distance);
    }
    this.setState({ ...this.state, location });
  }

  render() {
    return (
      <Main className="app">
        <Nav className="nav" getListings={this.getListings} loading={this.props.loading} />
        {/*<button style={{position: 'absolute', zIndex: 2}} onClick={ () => console.log(this.props)}>SHOW PROPS </button>*/}
        <Body className="body">
          <Route exact path="/"
            render={(props) => (
              <Home
                data={this.props.data}
                initializeMap={this.initializeMap}
                loading={this.props.loading}
                map={this.state.map}
                location={this.state.location}
              />
            )}
          />
          <Route exact path="/about" component={About} />
          <Route exact path="/contact" component={Contact} />
        </Body>
      </Main>
    );
  }
}


const mapStateToProps = ({ properties }) => {
  if (properties.loading) {
    return {
      loading: true,
      data: {}
    }
  }

  if (properties.data) {
    return {
      loading: false,
      data: properties.data
    }
  }

  return {
    loading: false,
    data: {}
  }

};

const mapDispatchToProps = (dispatch) => {
  return {
    getListings: (location, distance) => dispatch(getListings(location, distance))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);


const Main = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  &.nav:focus-within .body {
    opacity: 0.3;
  }
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: spread;
  background-color: white;
`;
