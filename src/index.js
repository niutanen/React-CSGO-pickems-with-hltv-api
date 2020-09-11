import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Topbar from'./components/topbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import ChooseTeams from './components/ChooseTeams';
import Matches from './components/Matches';
import ls from 'local-storage';
import { Collapse } from 'react-bootstrap';
import Standings from "./components/Standings";
import {lsTeams, lsEventID, lsMatchesUpdate, lsFriends, lsLastTeamUpdate} from "./globalconst"

class Mypage extends Component{
  constructor(props){
    super(props)
    this.ChooseTeamsHandler = this.ChooseTeamsHandler.bind(this);
    this.matchHandler = this.matchHandler.bind(this);
    this.topbarHandler = this.topbarHandler.bind(this);
    this.eventChangeHandler = this.eventChangeHandler.bind(this);
    var savedfriends = ls.get(lsFriends);
    var savedteams = ls.get(lsTeams);
    var savedeventid = ls.get(lsEventID);
    var params = new URLSearchParams(window.location.search);
    var mydata = JSON.parse(decodeURIComponent(params.get('mydata')));
    try {
      if(typeof mydata[0].advance.dfd !== undefined){
        savedfriends = mydata;
        if(savedeventid !== params.get('eventid')){
          savedeventid = params.get('eventid');
          ls.set(lsLastTeamUpdate,0);
          ls.set(lsMatchesUpdate,0);
        }
      }
    } catch (error) {}
    if (Number(savedeventid)<100) { 
      savedeventid=5285;
    }
    /*
    if(typeof savedfriends === undefined){
      savedfriends = {0: {avatar: "", advance: [], threeO: 1, othree: 1,}}
    }
    */
    this.state = {
      myeventid: Number(savedeventid),
      friends: { ...savedfriends,},
      event: savedteams,
      matches: [{
          date: 158700000,
          event: { name: "ESL One: Road to Ri", id: 5277},
          format: "bo3",
          id: 2341146,
          map: undefined,
          result: "2 - 0",
          stars: 3,
          team1: {id: 6665, name: "Astralis"},
          team2: {id: 5995, name: "G2"},},],
      toggleChooseTeam:true, 
      toggleMatches:true,
      toggleComparison:true,
      sharetext:'?mydata='+encodeURIComponent(JSON.stringify(savedfriends))+'&eventid='+savedeventid,
    }
    console.log("initial state",this.state);
  }
  matchHandler (props) {
    this.setState({matches: props.matches}); 
  }
  eventChangeHandler(props){
    ls.set(lsEventID, props);
    this.setState({myeventid: Number(props)});
    ls.set(lsLastTeamUpdate,0);
    ls.set(lsMatchesUpdate,0);
    window.location.replace("/")
    return alert('Refresh page to effect event changes')
  }



  ChooseTeamsHandler (props) {
    var newfriends = this.state.friends;
    if(typeof props.advance !== "undefined"){
      newfriends[props.id] = props;
    } else{
      delete newfriends[props.id]
    }
    // update the sharetext 
    var newShareText = encodeURIComponent(JSON.stringify(newfriends))+"&eventid="+this.state.myeventid;
    this.setState({friends: newfriends, sharetext: "?mydata="+newShareText, }); 
    ls.set('savedfriends', this.state.friends, {path: '/'});
  }

  topbarHandler(text){
    switch (text) {
      case "predictions":
        this.setState({toggleChooseTeam:!this.state.toggleChooseTeam})
        break;
      case "matches":
        this.setState({toggleMatches:!this.state.toggleMatches})
        break;
      case "comparison":
        this.setState({toggleComparison:!this.state.toggleComparison})
        break;
      default:
        break;
    }
  }


  render(){
    return(
      <React.Fragment>
        <div id="page-container">
            <Topbar topclick={this.topbarHandler} eventchange={this.eventChangeHandler} myeventid={this.state.myeventid} sharebtn={this.state.sharetext} /> 
            <div id="content-wrapper">
              <Collapse className="bg-dark" in={this.state.toggleChooseTeam} aria-controls="example-collapse-text" >
                <div id="example-collapse-text">
                  <ChooseTeams savedfriends={this.state.friends} myeventid={this.state.myeventid} handler={this.ChooseTeamsHandler} /> 
                </div>
              </Collapse>
              <Collapse in={this.state.toggleMatches} myeventid={this.state.myeventid} aria-controls="example-collapse-text" >
                <div id="example-collapse-text">
                  <Matches friends={this.state.friends}  myeventid={this.state.myeventid} handler={this.matchHandler} />
                </div>
              </Collapse>
              <Collapse in={this.state.toggleComparison} aria-controls="expandable" >
                <div id="expandable" className="bg-dark">
                  {Standings(this.state.friends,this.state.matches, this.state.event)}
                </div>
              </Collapse>
              <div className="spacer"></div>
            </div>
          <footer id="myfooter"> © Knoopertroopers - 2020 </footer>
        </div>
      </React.Fragment> 
    );
  }
}


ReactDOM.render(
  <Mypage />,
  document.getElementById('root')
);

