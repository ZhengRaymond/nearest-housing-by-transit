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
      searchStyle: initialStyle,
      dropdownOpen: true,
    };
    this.onSearchChange = this.onSearchChange.bind(this);
    this.tabClick = this.tabClick.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onError = this.onError.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
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

  toggleDropdown() {
    this.setState({ ...this.state, dropdownOpen: !this.state.dropdownOpen });
  }

  render() {
    const { activeTab } = this.state;
    return (
      <Container>
        <Header dropdownOpen={this.state.dropdownOpen}>
          <MenuButton>
            <input type="checkbox" onClick={this.toggleDropdown} value={!this.state.dropdownOpen}/>
            <span/>
            <span/>
            <span/>
          </MenuButton>
          <SubHeader>
            <SubHeaderItem onClick={this.tabClick} selected={'Home' === activeTab} to="/">Home</SubHeaderItem>
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
            <SubHeaderItem onClick={this.tabClick} selected={'About' === activeTab} to="/about">About</SubHeaderItem>
            <SubHeaderItem onClick={this.tabClick} selected={'Contact' === activeTab} to="/contact">Contact</SubHeaderItem>
          </SubHeader>
        </Header>
        <DropdownMenu className={this.state.dropdownOpen ? 'active' : ''}>
          <MenuItem onClick={this.tabClick} to="/">Home</MenuItem>
          <MenuItem onClick={this.tabClick} to="/about">About</MenuItem>
          <MenuItem onClick={this.tabClick} to="/contact">Contact</MenuItem>
        </DropdownMenu>
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

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  width: 100%;
  margin: 0;
  top: 0px;
  z-index: 2;

  box-shadow: ${props => props.dropdownOpen ? '0 1px 10px rgba(0, 0, 0, 0.5)' : 'none' };
  background-color: white;
`;

const SubHeader = styled.div`
  display: flex;
  margin-top: 4px;
  display: visible;

  @media(max-width: 850px) {
    display: none;
  }
`;

const SubHeaderItem = styled(Link).attrs({
  color: props => props.selected ? '#26ffbd' : '#666',
  border: props => props.selected ? '#26ffbd' : 'transparent'
})`
  padding: 12px 20px;
  text-decoration: none;
  color: ${props => props.color};
  border-bottom: solid 4px ${props => props.border };
  transition: 0.4s ease;
  font-weight: 900;
  font-size: 18px;

  &:hover {
    transition: 0.4s ease;
    color: #26ffbd;
  }
`;

// margin-left: 21px;
const MenuButton = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  background-color: transparent;
  border: none;
  width: 70px;
  height: 55px;

  @media(min-width: 851px) {
    display: none;
  }

  & input {
    position: absolute;
    top: 12px;
    left: 20px;
    width: 30px;
    height: 30px;
    margin: 0;

    cursor: pointer;
    opacity: 0;
    z-index: 2;
    background-color: red;
  }

  & span {
    display: block;
    width: 31px;
    height: 4px;
    margin: 2px 0;
    border-radius: 3px;
    background-color: #555;
    transform-origin: 4px 0px;
    transition: transform 0.5s cubic-bezier(0.77,0.2,0.05,1.0),
                background 0.5s cubic-bezier(0.77,0.2,0.05,1.0),
                opacity 0.55s ease;
  }

  &:hover span {
    background-color: #26ffbd;
  }

  & span:nth-child(2) {
    transform-origin: 0% 0%;
  }

  & span:nth-child(4) {
    transform-origin: 0% 100%;
  }

  & input:checked ~ span:nth-child(2) {
    transform: rotate(45deg) translate(-3px, -4px);
  }

  & input:checked ~ span:nth-child(3) {
    opacity: 0;
    transform: rotate(0deg) scale(0.2, 0.2);
  }

  & input:checked ~ span:nth-child(4) {
    transform: rotate(-45deg);
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 55px;
  z-index: 1;
  width: 100%;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  align-items: stretch;
  background-color: white;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.5);

  transition: 0.5s ease;
  &.active {
    top: -120px;
    transition: 0.5s ease;
  }
`;

const MenuItem = styled(Link)`
  padding: 15px 20px;
  border: 0;
  margin: 0;
  cursor: pointer;
  transition: 0.3s ease;

  background-color: white;
  color: #555;
  text-decoration: none;
  font-weight: 900;
  font-size: 18px;

  &:hover {
    color: #21ce99;
    transition: 0.3s ease;
  }

  &:active {
    color: #26ffbd;
    transition: 0s;
  }

  &:focus {
    outline: none;
  }
`;

const SearchInput = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  margin: 6px 20px;
  @media(max-width: 850px) {
    margin-left: 0;
  }
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

const SearchIcon = styled(SearchIconFA)`
  color: #888;
  margin: auto 10px;
  position: absolute;
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
