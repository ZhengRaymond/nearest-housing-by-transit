import React from 'react';
import styled from 'styled-components';
import r360 from 'route360';
import moment from 'moment';
import MapUI from '../mapUI';
import $ from 'jquery';
import Drawer from 'material-ui/Drawer';
const L = window.L;
const R360_APIKEY = '44TE3U0CARMU58PTLWC1MHC';

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: false, drawerOpen: false };
    this.updatePolygons = this.updatePolygons.bind(this);
    this.markerClick = this.markerClick.bind(this);
  }

  markerClick(listing) {
    this.setState({ ...this.state, selectedListing: listing, drawerOpen: true });
  }

  updatePolygons(map, polygonLayer, source) {
    this.setState({ ...this.state, loading: true });
    // travel options:
    var travelOptions = r360.travelOptions();
    // add marker
    travelOptions.addSource(source);
    // add some travel time values
    travelOptions.setTravelTimes([600, 1200, 1800]);
    // travel type options
    travelOptions.setTravelType('transit');
    travelOptions.setTime(32400); // 9:00 AM (9 * 60 * 60);
    travelOptions.setDate(moment().startOf('week').add('day', 1).format('YYYYMMDD')); // this monday...
    // set api key
    travelOptions.setServiceKey(R360_APIKEY);
     // set the service url for your area
     travelOptions.setServiceUrl('https://service.route360.net/northamerica/');
    // call the service
    r360.PolygonService.getTravelTimePolygons(travelOptions, (polygons) => {
      polygonLayer.clearAndAddLayers(polygons, true);
      this.setState({ ...this.state, loading: false });
    });
  };

  componentDidMount() {
    const latlng = [ 40.758896, -73.985130 ]; // initially new york
    // const latlng = [ 52.51, 13.37]; // initially berlin

    const map = L.map('map').setView(latlng, 10);
    r360.basemap({ style: 'basic', apikey: R360_APIKEY }).addTo(map);

    const polygonLayer = r360.leafletPolygonLayer().addTo(map);
    polygonLayer.setColors([
      {
        time: 600, color: '#56ff89'
      },
      {
        time: 1200, color: '#ffd53f'
      },
      {
        time: 1800, color: '#ff9059'
      },
    ]);

    const source = L.marker(latlng, { draggable: true }).addTo(map)
    source.on('dragend', () => this.updatePolygons(map, polygonLayer, source));

    const targetLayer = L.featureGroup().addTo(map);

    this.setState({ ...this.state, map, polygonLayer, targetLayer });
    this.updatePolygons(map, polygonLayer, source);
  }

  componentDidUpdate(prevProps, prevState) {
    const { map, polygonLayer, source, targetLayer } = this.state;
    const { data } = this.props;
    if (map && polygonLayer && data) {
      const { lat, lng, listings } = data;
      if (lat && lng && lat !== prevProps.data.lat && lng !== prevProps.data.lng) {
        // set view and zoom
        const latlng = [ lat, lng ];
        map.setView(latlng, 12);
        // update Polygons
        const source = L.marker(latlng, { draggable: true }).addTo(map);
        source.on('dragend', () => this.updatePolygons(map, polygonLayer, source));

        this.setState({ ...this.state, source });
        this.updatePolygons(map, polygonLayer, source);
      }
      if (listings && (!prevProps.data.listings || listings.length !== prevProps.data.listings.length)) {
        targetLayer.clearLayers()
        listings.forEach((listing) => {
          if (listing.lat && listing.lng && listing.price) {
            const icon = L.divIcon({ html: "$" + listing.price })
            L.marker([listing.lat, listing.lng], { icon }).on({click: () => this.markerClick(listing)}).addTo(targetLayer); // icon: 'android-restaurant', markerColor: 'red' });
          }
        })
      }
    }
  }

  render() {
    return (
      <Container>
        <MapUI loading={this.state.loading || this.props.loading} />
        <div style={{ flex: 1, zIndex: 0 }} id="map" />
        <Drawer
          docked={false}
          width={400}
          open={this.state.drawerOpen}
          onRequestChange={(drawerOpen) => this.setState({...this.state, drawerOpen})}
        >
          <Details data={this.state.selectedListing}/>
        </Drawer>
      </Container>
    );
  }
}

const Details = (props) => (
  <div>
    <Title>{title}</Title>
    <Url>{url}</Url>
    <Detail>{price}</Detail>
  </div>
)

export default Map;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
`;
