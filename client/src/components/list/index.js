import React from 'react';
import styled from 'styled-components';

class List extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <ListContainer>
        <ListingContainer>
          {
            this.props.listings.map((listing) => (
              <Listing key={listing}>{listing}</Listing>
            ))
          }
        </ListingContainer>
      </ListContainer>
    );
  }
}

export default List;


const Listing = styled.div`
  width: 100%;
  padding: 30px 20px;
  box-sizing: border-box;
  border-bottom: solid 1px #c2d6cf;
`;

const ListingContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 100%;
  overflow: scroll;
`;

const ListContainer = styled.div`
  flex: 1;
  border-right: solid 1px #21ce99;
`;

const MapContainer = styled.div`
  flex: 2;
  padding: 0 10px;

`;
