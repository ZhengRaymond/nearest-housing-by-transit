import React from 'react';
import styled from 'styled-components';
import { LinearProgress, Slider, Avatar } from 'material-ui';
import { SpeedDial, BubbleList, BubbleListItem } from 'react-speed-dial';
import FontIcon from 'material-ui/FontIcon';

class MapUI extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: false, distance: 30, distanceMenuOpen: false };
    this.distanceMenuToggle = this.distanceMenuToggle.bind(this);
  }

  distanceMenuToggle(distance) {
    if (distance === undefined) {
      this.setState({ ...this.state, distanceMenuOpen: !this.state.distanceMenuOpen });
    }
    else {
      this.setState({ ...this.state, distance,  distanceMenuOpen: false });
    }
  }

  render() {
    return (
      <Container>
        <Bottom style={{ display: this.props.loading ? 'block' : 'none' }}>
          <div style={{ padding: '10px' }}> Loading... </div>
          <LinearProgress
            mode="indeterminate"
            style={{
              height: '5px', backgroundColor: 'rgba(255, 255, 255, 0.8)'
            }}
            color="#5eca85"
          />
        </Bottom>
        <SpeedDial
          isOpen={this.state.distanceMenuOpen}
          onChange={() => this.distanceMenuToggle()}
          hasBackdrop={false}
          positionV="top"
          positionH="right"
          styleButtonWrap={{ marginTop: '60px' }}
          closeOnSecondClick={true}
          icon={<div>{"\u00A0" + this.state.distance + " min"}</div>}
        >
          <BubbleList direction='left'>
            {
              [30, 20, 10].map((distance) => (
                <BubbleListItem
                  key={distance}
                  onClick={() => this.distanceMenuToggle(distance)}
                  leftAvatar={<NumberIcon backgroundColor="#00bcd4">{distance}</NumberIcon>}
                  styleText={{display:"none"}}
                />
              ))
            }
          </BubbleList>
        </SpeedDial>
      </Container>
    );
  }
}

export default MapUI;

const NumberIcon = styled(Avatar)`
  &:hover {
    transform: scale(1.05);
  }
`;

const TopLeft = styled.div`
  z-index: 3;
  position: absolute;
  top: 0;
  left: 0;
  margin: 70px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0px 5px 10px #999;
`;

const TopRight = styled.div`
  z-index: 3;
  position: absolute;
  top: 0;
  right: 0;
  margin: 70px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0px 5px 10px #999;
`;

const Bottom = styled.div`
  z-index: 3;
  position: absolute;
  bottom: 0%;
  margin: 30%;
  margin-bottom: 12%;
  width: 40%;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0px 5px 10px #999;
`;

const Container = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`;
