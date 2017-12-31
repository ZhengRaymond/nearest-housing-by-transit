import React from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import Slider from 'react-slick';

import './hotload.css';

class Listing extends React.Component {
  render() {
    const listing = this.props.data;
    if (!listing) {
      return ( <div> Loading... </div> )
    }
    const location = `(${listing.lat},${listing.lng})`;
    // const price = "$" + parseInt(listing.price).toLocaleString('en');
    const url = <a target="_blank" href={listing.url}>{listing.url}</a>;
    return (
      <Container>
        {/*}<ImageSlider images={listing.images} />*/}
        <Text>
          <Title>{ listing.title }</Title>
          <Details>
            <div>Location: </div><div>{location}</div>
          </Details>
          <Details>
            <div>Original Posting: </div><em>{url}</em>
          </Details>
          <Details>
            <div>Price: </div><em>${listing.price}</em>
          </Details>
        </Text>
      </Container>
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
        <div style={{maxHeight: "40%", width: "100%", overflow: "hidden"}}>
          <Slider {...settings}>
            { images }
          </Slider>
        </div>
      </SliderContainer>
    )
  }

  return (
    <SliderContainer>
      <div style={{ height: "40%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        No Images
      </div>
    </SliderContainer>
  );
}

export default Listing;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 20px;
  padding-top: 5px;
  box-sizing: border-box;
  color: black;
  background-color: white;
`;
// possible colors: #3bba7a, d0e5df

const ImageContainer = styled.div`
  flex:1;
  width: 100%;
  height: 100%;
  & img {
    object-fit: cover;
    width: 100%;
    height: 80%;
  }
`;

const SliderContainer = styled.div`
  overflow: hidden;
  box-sizing: border-box;
  min-height: 50px;
  border-radius: 5px;
  background-color: white;
  color: black;
`;

const PriceTag = styled.div`
  background-color: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 8px;
  font-size: 18px;
`;


const Text = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const Title = styled.div`
  margin: 5px 0;
  font-size: 0.9em;
  color: #079a56;
  font-family: Montserrat;
  font-weight: 700;
`;

const Details = styled.div`
  margin: 3px 25px;
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
    margin-left: -15px;
    font-weight: bold;
    font-size: 1.1em;
    color: #5f7760;
  }
`;

//TODO:
// 1. detail list pane (click on item in list, show full panel details, with back button to go back to SAVED scroll location)
// 2. plot stuff on the google maps
// 3. filtering real time
// 4. more sources with pagination --> airbnb, craigslist, homeaway, kijiji
// 5. add features like crime maps, restaurants (from yelp) etc.
