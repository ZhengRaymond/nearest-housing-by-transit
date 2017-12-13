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

    // console.log(info)
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
      // (imageURL) => (<ImageContainer key={imageURL}><img src={imageURL}/></ImageContainer>)
      (imageURL) => (<ImageContainer key={imageURL}><img src={imageURL}/></ImageContainer>)
    );
    var settings = {
      dots: false,
      arrows: false,
      infinite: true,
      pauseOnHover: true,
      speed: 500,
      autoplay: true,
      autoplaySpeed: 8000,
      slidesToShow: 1,
      centerPadding: '0',
      lazyLoad: true
    };
    return (
      <SliderContainer>
        {/*<Slider {...settings}>
          { images }
        </Slider>*/}
        { images.length > 0 && images[0] }
      </SliderContainer>
    )
  }

  return (
    <SliderContainer>
      <div style={{ height: "150px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        No Images
      </div>
    </SliderContainer>
  );
}

export default Listing;


const SliderContainer = styled.div`
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  min-height: 50px;
  max-height: 200px;
  box-shadow: 0px 0px 6px #ddd;
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
  background-color: red
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
