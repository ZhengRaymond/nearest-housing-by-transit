import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import styled from 'styled-components';
import SearchIconFA from 'react-icons/lib/fa/search';
import PlacesAutocomplete from 'react-places-autocomplete';
import './styles.css';

class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'Home',
      search: '',
      searchStyle: initialStyle
    };
    this.onSearchChange = this.onSearchChange.bind(this);
    this.tabClick = this.tabClick.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onError = this.onError.bind(this);
  }

  onSearchChange(search) {
    var error = this.state.error || false;
    if (error === search) {
      error = false;
    }
    this.setState({ ...this.state, error, search });
  }

  tabClick(e) {
    this.setState({ ...this.state, activeTab: e.target.innerHTML });
  }

  onSelect(location) {
    this.setState({ ...this.state, search: location });
    this.props.getListings(location, this.state.distance);
  }

  onError() {
    var error = this.state.error;
    if (!error) {
      let s = this.state.search;
      error = s.substring(0, s.length - 1);
    }
    this.setState({ ...this.state, error });
  }

  render() {
    const { activeTab } = this.state;
    return (
      <Container>
        <Main>
          <Header>
            <SubHeader>
              <Link onClick={this.tabClick} style={{ borderColor: 'Home' === activeTab ? '#26ffbd' : 'transparent' }} to="/">Home</Link>
            </SubHeader>
            <SearchInput disabled={this.props.loading} className={this.state.error ? 'error' : ''}>
              <SearchIcon/>
              <PlacesAutocomplete
                inputProps={{
                  value: this.state.search,
                  onChange: this.onSearchChange,
                  placeholder: "e.g. Googleplex, Mountain View, CA",
                  autoFocus: true
                }}
                options={{
                  componentRestrictions: {
                    country: 'us'
                  }
                }}
                onError={this.onError}
                highlightFirstSuggestion={true}
                onSelect={this.onSelect}
                styles={ this.state.searchStyle }
              />
              { /* <Details className="details"/> */ }
            </SearchInput>
            <SubHeader>
              <Link onClick={this.tabClick} style={{ borderColor: 'About' === activeTab ? '#26ffbd' : 'transparent' }} to="/about">About</Link>
              <Link onClick={this.tabClick} style={{ borderColor: 'Contact' === activeTab ? '#26ffbd' : 'transparent' }} to="/contact">Contact</Link>
            </SubHeader>
          </Header>
        </Main>
      </Container>
    );
  }
}

export default Nav;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  max-height: 200px;
`;

const Main = styled.div`

`;

const Details = styled.div`
  position: absolute;
  left: 0%;
  top: 55px;
  z-index: 1;
  width: 100vw;
  height: 100px;
  max-height: 0px;

  border-bottom: solid 6px #888;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  background-color: rgba(255, 255, 255, 0.96);
  transition: 0.3s linear;
`;

const SearchIcon = styled(SearchIconFA)`
  color: #888;
  margin: auto 10px;
  position: absolute;
`;

const SearchInput = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  margin: 6px 20px;
  background-color: #eee;
  border-radius: 6px;
  border: solid 1px ${props => props.disabled ? '#bbb' : '#fff' };
  pointer-events: ${props => props.disabled ? 'none' : 'auto' };

  &:focus-within {
    border: solid 1px ${props => props.disabled ? '#bbb' : '#00d694' };

    &>.details {
      max-height: 100px;
    }

    &>svg {
      color: ${props => props.disabled ? '#bbb' : '#00d694' };
    }
  }

  &>svg {
    transition: 0.2 ease;
  }

  & input {
    vertical-align: middle;
    background-color: transparent;
    border: none;
    font-size: 18px;
    font-weight: 500;
    color: ${props => props.disabled ? '#bbb' : '#555' };

    &:focus {
      outline: none;
      &::placeholder {
        color: #8bb2a6;
      }
    }

    &::placeholder {
      color: #aaa;
      padding-left: 2px;
    }
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  width: 100%;
  margin: 0;
  top: 0px;

  background-color: white;
  border-bottom: solid 1px #c0eadd;

  & a {
    padding: 12px 20px;
    color: #21ce99;
    text-decoration: none;
    border-bottom: solid 4px transparent;
    transition: 0.4s ease;
    font-weight: 900;
    font-family: Montserrat;
    font-size: 18px;
  }

  & a:hover {
    transition: 0.4s ease;
    color: #26ffbd;
  }
`;

const SubHeader = styled.div`
  display: flex;
  margin-top: 4px;
`;

const initialStyle = {
  root: {
    flex: 1
  },
  input: {
    padding: '10px',
    paddingLeft: '40px',
    textOverflow: 'ellipsis',
    width: '88%'
  },
  autocompleteContainer: {
    display: 'visible',
    zIndex: 1,
    position: 'absolute',
    top: '100%',
    backgroundColor: 'white',
    borderRadius: "6px",
    padding: "6px 0",
    width: '100%',
    border: "solid 1px #c0eadd"
  },
  autocompleteItem: {
    backgroundColor: 'white',
    padding: '10px',
    color: '#555555',
    cursor: 'pointer',
  },
  autocompleteItemActive: {
    backgroundColor: '#dedede'
  },
  googleLogoContainer: {
    marginTop: "2px",
    backgroundColor: 'white'
  },
};
