import React from 'react';
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroller';
import _ from 'lodash';

import Listing from '../listing';

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listingElements: [],
      lastLoaded: 0,
      // hasMore: true
    };
    this.loadMore = this.loadMore.bind(this);
  }

  loadMore(page) {
    var { listingElements, lastLoaded } = this.state;
    for (var i = lastLoaded; i < lastLoaded + 10; i++) {
      if (i >= this.props.listings.length) {
        // newState.hasMore = false;
        break;
      }
      const listing = this.props.listings[i];
      listingElements.push((
        <Listing key={listing.title} index={i} data={listing} />
      ))
    }
    lastLoaded = i;
    this.setState({
      lastLoaded,
      listingElements,
    });
  }

  render() {
    let messages;
    if (this.props.loading) {
      messages = [ "Loading..." ];
    }
    else if (this.props.listings.length === 0) {
      messages = [
        "No results.",
        "Enter a location to find nearby housing."
      ];
    }

    if (messages) {
      return (
        <Container>
          <Message>
            {
              messages.map((message) => (<div key={message} style={{marginTop: "15px"}}>{ message }</div>))
            }
          </Message>
        </Container>
      )
    }

    return (
      <Container>
        <InfiniteScroll
          pageStart={0}
          loadMore={this.loadMore}
          hasMore={true}
          useWindow={false}
          loader={<div className="loader">Loading ...</div>}
        >
          <ScrollingDiv>
            {this.state.listingElements}
          </ScrollingDiv>
        </InfiniteScroll>
      </Container>
    );
  }
}

// <ListPanel>
// {
//   this.props.listings.map((listing) => (
//     <Listing key={listing.title} data={listing} />
//   ))
// }
// </ListPanel>
export default List;


const Message = styled.div`
  margin: 30% 30px;
  font-weight: 900;
  color: #aaa;
  text-align: center;

`;

const ScrollingDiv = styled.div`
  overflow: scroll;
`;

const Container = styled.div`
  flex: 2;
  border-right: solid 1px #21ce99;
  overflow: scroll;
`;
