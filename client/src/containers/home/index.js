import React from 'react';
import { List, Map } from '../../components';
import styled from 'styled-components';

class Home extends React.Component {
  render() {
    return (
      <Container>
        <List listings={this.props.listings} loading={this.props.loading} />
        <Map listings={this.props.listings} initializeMap={this.props.initializeMap} location={this.props.location}/>
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
