import React from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import Slider from 'react-slick';
const google = window.google;

// import { QueryStringToJSON } from '../../util';

class Listing extends React.Component {
  render() {
    const listing = this.props.data;
    const location = listing.address || (`(${listing.lat},${listing.lng})`);
    var secondDollar = listing.price.indexOf('$', 1);
    if (secondDollar === -1) secondDollar = listing.price.length;
    const price = listing.price.substring(0, secondDollar)
    const url = <a target="_blank" href={listing.url}>{listing.url}</a>;
    return (
      <ListingContainer even={this.props.index % 2 === 0}>
        <ImageSlider images={listing.images} />
        <Text>
          <Title>{ listing.title }</Title>
          <Details>
            <div>Location: </div><div>{location}</div>
          </Details>
          <Details>
            <div>Original Posting: </div><em>{url}</em>
          </Details>
          <Details>
            <div>Price: </div><div>{price}</div>
          </Details>
        </Text>
      </ListingContainer>
    )
  }
}

const ImageSlider = (props) => {
  if (props.images && props.images.length > 0) {
    const images = _.uniq(props.images).map(
      // (imageURL) => (<ImageContainer key={imageURL}><img src={imageURL}/></ImageContainer>)
      (imageURL) => (<ImageContainer key={imageURL}><img src={imageURL}/></ImageContainer>)
    );
    const settings = {
      dots: true,
      arrows: true,
      infinite: true,
      pauseOnHover: true,
      speed: 500,
      autoplay: true,
      autoplaySpeed: 15000,
      slidesToShow: 1,
      centerPadding: '0',
      lazyLoad: true,
      responsive: [
        {
          breakpoint: 100,
          settigns: {
            arrows: true
          }
        }
      ]
    };
    return (
      <SliderContainer>
        { <Slider {...settings}>
          { images }
        </Slider> }
        { /* images.length > 0 && images[0] */ }
      </SliderContainer>
    )
  }

  return (
    <SliderContainer>
      <div style={{ height: "15099px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        No Images
      </div>
    </SliderContainer>
  );
}

export default Listing;


const SliderContainer = styled.div`
  width: 50%;
  overflow: hidden;
  box-sizing: border-box;
  min-height: 50px;
  box-shadow: 0px 0px 6px #ddd;
  border-radius: 5px;
  background-color: white;
  color: black;
`;

const Text = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  text-align: center;
  font-size: 0.9em;
  color: #079a56;
  margin: 5px;

  font-family: Montserrat;
  font-weight: 700;
`;

const Details = styled.div`
  margin: 5px;
  margin-left: 20px;
  font-weight: light;
  font-size: 0.65em;
  color: #777;

  & a {
    color: #00bb68;
    &:visited {
      color: #4d8259;
    }
  }

  & div:first-child {
    margin-left: -5px;
    font-weight: bold;
    font-size: 1.1em;
    color: #5f7760;
  }
`;

const ImageContainer = styled.div`
  flex:1
  width: 100%;
  height: 100%;
  & img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;

const ListingContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
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
