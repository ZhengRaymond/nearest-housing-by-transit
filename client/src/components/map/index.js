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

  componentDidUpdate(prevProps, prevState) {
    if (this.refs.map, this.props.map) {
      const { lat, lng } = this.props.address;
      if (prevProps.address.lat !== lat || prevProps.address.lng !== lng) {
        this.props.map.setCenter({ lat, lng });
        this.props.map.setZoom(12);
      }
    }

    // var marker = new google.maps.Marker({
    //   position: newPos,
    //   map: this.refs.map
    // });

    //setCenter
    //setZoom
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
  border-left: solid 1px #21ce99;
  @media (max-width: 850px) {
    flex: 2;
  }
  @media (max-width: 700px) {
    border: none;
    flex: 0;
  }
`;
