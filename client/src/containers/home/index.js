import React from 'react';
import { List, Map } from '../../components';
import styled from 'styled-components';

class Home extends React.Component {
  render() {
    const { lat, lng, address, listings } = this.props.data;
    const { loading, initializeMap, location, map } = this.props;
    console.log('PROPS', this.props);
    return (
      <Container>
        <List listings={listings} loading={loading} />
        <Map address={{ lat, lng, address }} initializeMap={initializeMap} map={map} location={location}/>
      </Container>
    );
  }
}

export default Home;


const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
`;
