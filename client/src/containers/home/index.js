import React from 'react';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { List, Map } from '../../components';
import styled from 'styled-components';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listings: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]
    }
  }

  render() {
    return (
      <Container>
        <List listings={this.state.listings}/>
        <Map listings={this.state.listings}/>
      </Container>
    );
  }
}

// <button onClick={() => props.changePage('about')}>Go to About page via redux</button>
// <button onClick={() => props.changePage('contact')}>Go to Contact page via redux</button>

const mapDispatchToProps = dispatch => bindActionCreators({
  changePage: (url) => push(url)
}, dispatch);

export default connect(
  null,
  mapDispatchToProps
)(Home);


const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
`;
