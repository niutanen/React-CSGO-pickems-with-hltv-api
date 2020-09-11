import React from 'react';
import {ToggleButton, ToggleButtonGroup, Button} from 'react-bootstrap';
import Image from 'react-bootstrap/Image';

class Topbar extends React.Component{
  
  keyPressed(event) {
    if (event.key === "Enter") {
      this.props.eventchange(event.target.value);
    }
  }

  render(){
    return(
      <div id="header" className="bg-secondary" sticky="top">
        <Image id="headerlogo" src={'https://static.hltv.org/images/eventLogos/'+this.props.myeventid+'.png'} fluid />
        <ToggleButtonGroup id="headerbutton" type="checkbox" variant="dark" defaultValue={[1,2,3]} className="mb-2" >
          <ToggleButton value={1} onChange={this.props.topclick.bind(null,"predictions")} variant="secondary">Predictions</ToggleButton>
          <ToggleButton value={2} onChange={this.props.topclick.bind(null,"matches")} variant="secondary">Matches</ToggleButton>
          <ToggleButton value={3} onChange={this.props.topclick.bind(null,"comparison")} variant="secondary">Comparison</ToggleButton>
        </ToggleButtonGroup>
        <input id="headerinput" type="text"  onKeyPress={this.keyPressed.bind(this)} placeholder={"HLTVeventID: "+this.props.myeventid} ></input>
        <Button id="headershare" align="right" href={"/"+this.props.sharebtn}>Share</Button> 
      </div>
    )
  }
}
export default Topbar;
