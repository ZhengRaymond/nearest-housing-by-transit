import React from 'react';
import googleMapStyles from './googleMapStyles.json';
import styled from 'styled-components';
import './styles.css';
const google = window.google;

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = { transitStyle: true };
  }

  componentDidMount() {
    const options = {
      zoom: 4,
      center: { lat: 37.09024, lng: -95.712891 },
      // zoom: 13,
      // center: { lat: 40.795988, lng: -73.952248 },
      mapTypeControlOptions: {
        mapTypeIds: ['styled_map', 'roadmap'],
      }
    };
    const map = new google.maps.Map(this.refs.map, options);
    const transitLayer = new google.maps.TransitLayer();
    transitLayer.setMap(map);
    const styledMapType = new google.maps.StyledMapType(
      googleMapStyles.transit,
      { name: 'Transit' }
    );

    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');
    this.props.initializeMap(map);
  }

  render() {
    return (
      <MapContainer>
        <div style={{ flex: 1 }} ref="map">
          { google.maps && this.state.maps ? '': 'Loading...' }
        </div>
      </MapContainer>
    );
  }
}

export default Map;

const MapContainer = styled.div`
  flex: 3;
  display: flex;
`;
