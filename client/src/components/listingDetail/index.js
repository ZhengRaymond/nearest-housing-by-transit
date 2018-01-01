import React from 'react';
import { connect } from 'react-redux';
import { getListingDetails } from '../../actions';
import styled from 'styled-components';
import _ from 'lodash';
import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import Slider from 'react-slick';

import './hotload.css';

class ListingDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.data || this.props.data.url !== nextProps.data.url) {
      this.props.getListingDetails(nextProps.data);
    }
  }

  render() {
    if (!this.props.data || this.props.loading === true) {
      return (
        <Loading/>
      )
    }

    const { title, price, url } = this.props.data;
    const { address, description, images } = this.props;
    let items = {
      "Original Posting": <a target="_blank" href={url}>{url}</a>,
      Price: <b>{'$' + price}</b>
    }
    console.log("ADDRESS:", address);
    if (address && address.url) items.Location = <a target="_blank" href={address.url}>{address.label}</a>;

    return (
      <Container>
        <ImageSlider images={images} />
        <h3>{title}</h3>
        <em>"...{description}..."</em>
        <Details items={items}/>
      </Container>
    )
  }
}


// const mapStateToProps = ({ listingDetails }) => (listingDetails);
const mapStateToProps = (response) => {
  return response.listingDetails;
};

export default connect(mapStateToProps, { getListingDetails })(ListingDetail);

////////////////////////////////////////////////////////////////////////////////
/* ListingDetail Components */ // possible colors: #3bba7a, d0e5df
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 20px;
  padding-top: 5px;
  box-sizing: border-box;
  color: black;
  background-color: white;

  & h3 {
    margin: 5px 0;
    font-size: 1em;
    color: #079a56;
    font-family: Montserrat;
    font-weight: 700;
  }

  & em {
    margin-bottom: 10px;
    padding: 10px 20px;
    font-size: 0.9em;
    color: #777;
    font-weight: bold;
    font-family: Palatino;
    background-color: #eee;
    border-radius: 5px;
    max-height: 150px;
    overflow-y: scroll;
    &:after {
      content: '';
      width: 100%;
      height: 0;
      position:absolute;
      left: 0;
      bottom: 0;
      background:linear-gradient(rgba(0, 0, 0, 0), #000);
    }
  }
`;

////////////////////////////////////////////////////////////////////////////////
/* ImageSlider Components */
const ImageSlider = (props) => {
  if (props.images && props.images.length > 0) {
    const images = _.uniq(props.images).map(
      // (imageURL) => (<Image key={imageURL}><img src={imageURL}/></Image>)
      (imageURL) => (<Image key={imageURL}><img src={imageURL}/></Image>)
    );
    const settings = {
      dots: true,
      arrows: true,
      infinite: true,
      pauseOnHover: true,
      speed: 500,
      autoplay: true,
      autoplaySpeed: 4000,
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
        <div style={{width: "100%", maxHeight: "275px", overflow: "hidden"}}>
          <Slider {...settings}>
            { images }
          </Slider>
        </div>
      </SliderContainer>
    )
  }

  return (
    <SliderContainer>
      <NoImages>No Images</NoImages>
    </SliderContainer>
  );
}

const Image = styled.div`
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
  display: flex;
  align-items: center;
  justify-content: center;
  height: 275px;
  border-radius: 5px;
  background-color: #000;
  color: white;
`;

const NoImages = styled.div`
  display: flex;
  justifyContent: center;
  alignItems: center;
`;

////////////////////////////////////////////////////////////////////////////////
/* Details Components */
const Details = (props) => {
  if (!props.items) {
    return <div>Loading...</div>
  };

  return (
    <List>
      {
        _.map(props.items, (value, key) => (
          <Item key={key+value}>
            <label>{key}</label>
            <p>{value}</p>
          </Item>
        ))
      }
    </List>
  );
}

const Loading = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '30%', fontSize: '24px' }}>
    Loading...
  </div>
)

const List = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const Item = styled.li`
  & label {
    font-weight: bold;
    font-size: 1.1em;
    color: #5f7760;
  }

  & p {
    padding: 0 0 10px 5px;
    margin: 0;
    font-weight: light;
    font-size: 0.65em;
    color: #666;

    & a {
      color: #00bb68;
      &:visited {
        color: #4d8259;
      }
    }
  }
`;




//TODO:
// 1. detail list pane (click on item in list, show full panel details, with back button to go back to SAVED scroll location)
// 2. plot stuff on the google maps
// 3. filtering real time
// 4. more sources with pagination --> airbnb, craigslist, homeaway, kijiji
// 5. add features like crime maps, restaurants (from yelp) etc.
