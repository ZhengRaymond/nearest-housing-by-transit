import React from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import Slider from 'react-slick';
const google = window.google;

// import { QueryStringToJSON } from '../../util';

class Listing extends React.Component {
  render() {
    const listing = this.props.data;
    const location = listing.address || (`(${listing.lat},${listing.lng})`);
    var secondDollar = listing.price.indexOf('$', 1);
    if (secondDollar === -1) secondDollar = listing.price.length;
    const price = parseInt(listing.price.substring(1, secondDollar)).toLocaleString('en');
    const url = <a target="_blank" href={listing.url}>{listing.url}</a>;
    return (
      <ListingContainer even={this.props.index % 2 === 0}>
        <ImageSlider images={listing.images} price={price} />
        <Text>
          <Title>{ listing.title }</Title>
          <Details>
            <div>Location: </div><div>{location}</div>
          </Details>
          <Details>
            <div>Original Posting: </div><em>{url}</em>
          </Details>
        </Text>
      </ListingContainer>
    )
  }
}

const ImageSlider = (props) => {
  console.log('image props', props);
  if (props.images && props.images.length > 0) {
    const images = _.uniq(props.images).map(
      (imageURL) => (<ImageContainer key={imageURL}><img alt={imageURL} src={imageURL}/></ImageContainer>)
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
        <Slider {...settings}>
          { images }
        </Slider>
        <PriceTag>
          { "$ " + props.price }
        </PriceTag>
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

const ListingContainer = styled.div`
  display: flex;
  flex-direction: row;
  max-height: 200px;
  @media (max-width: 1000px) {
    flex-direction: column;
    max-height: 500px;
  }
  align-items: stretch;
  padding: 20px;
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
  width: 45%;
  @media (max-width: 1000px) {
    width: 100%;
    box-shadow: 0 0 10px #000;
  }
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
  width: 55%;
  @media (max-width: 1000px) {
    width: 100%;
  }
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const Title = styled.div`
  margin: 3px 10px;
  @media (max-width: 1000px) {
    margin-left: 0px;
    margin-top: 6px;
  }
  font-size: 0.9em;
  color: #079a56;
  font-family: Montserrat;
  font-weight: 700;
`;

const Details = styled.div`
  margin: 3px 25px;
  @media (max-width: 1000px) {
    margin-left: 15px;
  }
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
