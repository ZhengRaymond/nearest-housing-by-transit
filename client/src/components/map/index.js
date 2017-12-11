import React from 'react';
import styled from 'styled-components';
import './styles.css';
const google = window.google;

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    setTimeout(() => {
      const options = {
        zoom: 15,
        center: {lat: -34.397, lng: 150.644}
      };
      const map = new google.maps.Map(this.refs.map, options);
      this.setState({ map });
    }, 1000);
  }

  render() {
    return (
      <div className="map-container" ref="map">
        { google.maps && this.state.maps ? '': 'Loading...' }
      </div>
    );
  }
}

export default Map;
