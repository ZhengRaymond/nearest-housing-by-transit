import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom'
import styled from 'styled-components';

import Home from '../home';
import About from '../about';
import Contact from '../contact';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { activeTab: 'Home' };
    this.tabClick = (e) => this.setState({ activeTab: e.target.innerHTML });
  }

  render() {
    const { activeTab } = this.state;
    return (
      <div className="expand">
        <Header>
          <SubHeader>
            <Link onClick={this.tabClick} style={{ borderColor: 'Home' === activeTab ? '#26ffbd' : 'transparent' }} to="/">Home</Link>
          </SubHeader>
          <SubHeader>
            <Link onClick={this.tabClick} style={{ borderColor: 'About' === activeTab ? '#26ffbd' : 'transparent' }} to="/about">About</Link>
            <Link onClick={this.tabClick} style={{ borderColor: 'Contact' === activeTab ? '#26ffbd' : 'transparent' }} to="/contact">Contact</Link>
          </SubHeader>
        </Header>

        <Body className="expand">
          <Route exact path="/" component={Home} />
          <Route exact path="/about" component={About} />
          <Route exact path="/contact" component={Contact} />
        </Body>
      </div>
    );
  }
}

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 0;
  top: 0px;

  background-color: white;
  border-bottom: solid 1px #21ce99;

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
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: spread;
  background-color: white;
`

export default App;
