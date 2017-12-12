import React from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { QueryStringToJSON } from '../../util';

class Listing extends React.Component {
  render() {
    const listing = this.props.data;

    const info = { Url: listing.url };

    // const identifier = listing.charAt(0);
    const mapUrlRaw = listing.mapUrl;
    if (mapUrlRaw.indexOf('https://maps.google.com/maps/preview/@') !== -1) {
      const temp = mapUrlRaw.split('@')[1].split(',');
      [ info.lat, info.lng ] = temp;
    }
    else {
      const mapUrlQueryString = listing.mapUrl.substr(listing.mapUrl.indexOf('?') + 1);
      const urlParams = QueryStringToJSON(mapUrlQueryString);
      info.address = urlParams.q.replace(/\+/g, ' ').substr(5);
    }

    const { hostname, href } = listing.replyUrl;
    info.replyUrl = `https://${hostname}${href}`;

    console.log(info)
    return (
      <ListingContainer even={this.props.index % 2 === 0}>
        <ImageSlider images={listing.images} />
        <Title> { listing.title } </Title>

      </ListingContainer>
    )
  }
}

const ImageSlider = (props) => {
  if (props.images && props.images.length > 0) {
    const images = _.uniq(props.images).map(
      (imageURL) => (<ImageContainer key={imageURL}><img src={imageURL}/></ImageContainer>)
    );
    return (
      <SliderContainer className="slider">
        <Carousel
          autoPlay={true}
          infiniteLoop={true}
          interval={4000}
          showThumbs={false}
          showStatus={false}
          showArrows={false}
          showIndicators={false}
        >
          { images }
        </Carousel>
      </SliderContainer>
    )
  }

  return (
    <SliderContainer className="slider">
      No Images
    </SliderContainer>
  );
}

export default Listing;


const SliderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 750px;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  border-radius: 5px;
  background-color: white;
  color: black;
`;

const Title = styled.div`
  width: 100%;
  font-size: 14px;
  color: #555;
  margin: 20px;
  font-family: Montserrat;
  font-weight: 700;
`;

const ImageContainer = styled.div`
  background-color: white;
`;

const ListingContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  height: 182px;
  padding: 6px;
  box-sizing: border-box;
  background-color: ${props => props.even ? 'white' : '#efefef' };
  color: ${props => props.even ? 'black' : 'black'};
`;
// possible colors: #3bba7a, d0e5df

//TODO:
// 1. detail list pane (click on item in list, show full panel details, with back button to go back to SAVED scroll location)
// 2. plot stuff on the google maps
// 3. filtering real time
// 4. more sources with pagination --> airbnb, craigslist, homeaway, kijiji
// 5. add features like crime maps, restaurants (from yelp) etc.
