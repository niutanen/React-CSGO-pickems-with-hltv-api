import React from 'react';
import StartState from './startstate';
import {Container, Image, Button, Collapse} from 'react-bootstrap';
import DragDropContainer from './DragDropContainer';
import DropTarget from './DropTarget';
import { lsTeams, lsLastTeamUpdate  } from '../globalconst';
import { HLTV } from 'hltv';
import ls from 'local-storage';


/* create cookies that save teams
  must have a update time
  if timenow > updatetime + 2 days
    make teams request
      save teams received
 */

const myHLTV = HLTV.createInstance(
  {
    hltvUrl: 'https://cors-anywhere.herokuapp.com/https://www.hltv.org',
    // no clue wtf is going on with this loadPage: (url) => fetch(url),
  }
);

class ChooseTeams extends React.Component {
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {users:{0:{teams:[],closed:false}}};
    this.addFriend = this.addFriend.bind(this);
    this.removeFriend = this.removeFriend.bind(this);
    this.collapseHandle = this.collapseHandle.bind(this);
  }

  recievedTeams(res){
    if(this.mounted){
      var newstate = StartState(res);
      let savedfriends = this.props.savedfriends;
      Object.keys(savedfriends).forEach((e)=> {
        newstate.users[e]=JSON.parse(JSON.stringify(newstate.users[0]))
        newstate.users[e].userlogo=savedfriends[e].avatar;
        
      });
      for(let [key] of Object.entries(newstate.users)){
        try {
          newstate.users[key].teams.forEach((team)=>{
            if(savedfriends[key].advance.includes(team.id)){
              team.category='advance';
              
              newstate.users[key].teams.some((e)=>{
                if (Number(e.id) <0 && e.category==="advance" ){e.category = "available";return true;} 
                return false;
              });
            } else if (Number(team.id)===Number(savedfriends[key].threeO)) {
              team.category="threeO";
              newstate.users[key].teams.some((e)=>{
                if (Number(e.id) < 0 && e.category==="threeO" ){e.category = "available"; return true;}; 
                return false;
              });
            } else if (Number(team.id)===Number(savedfriends[key].othree)) {
              team.category="othree";
              newstate.users[key].teams.some((e)=>{
                if (Number(e.id) < 0 && e.category==="othree"){e.category = "available"; return true};
                return false;
              });
            }
          })
        } catch (error) {
          
        }
      }
      this.setState({});
      this.setState(newstate);
    }
  }
  
  componentDidMount(){
    this.mounted = true;
    var lastupdate = ls.get(lsLastTeamUpdate);
    var teamdata = ls.get(lsTeams);
    if(Date.now() > lastupdate+1000*60*10 || typeof teamdata === 'undefined'){
      this._asyncRequest =myHLTV.getEvent({id:this.props.myeventid}).then(res=>{
        this.recievedTeams(res);
        ls.set(lsTeams, res);
        ls.set(lsLastTeamUpdate, Date.now());
        console.log('event loaded from hltv', res);
      });
    }else{
      this.recievedTeams(teamdata);
      console.log('event loaded from ls');
    }
  }
  componentWillUnmount(){
    this.mounted = false;
    window.removeEventListener('onDrop',this.onDrop,false);
    window.removeEventListener('onDagStart',this.onDragStart,false);
    window.removeEventListener('onDragOver',this.onDragOver,false);
    window.removeEventListener('onHit',this.onHit,false);
  }
  
  onDragStart = (ev,team) => {
    this.setState({dragdata: {team}});
  }
  onDragOver = (ev) => {ev.preventDefault();}

  handleChange(currentUser,e){ 
    var a = this.state;
    if(e.target.value.length<2) {a.users[currentUser].userlogo="https://img.icons8.com/android/2x/user.png"}
    else {a.users[currentUser].userlogo=e.target.value;}
    this.setState(a);
    this.sendUserUpdate(currentUser);
  }

  onDrop = (ev, oldchoice) => {
    let uid = this.state.dragdata.team.userid;
    let oldcat = oldchoice.category;
    let newchoice = this.state.dragdata.team;
    let newcat = this.state.dragdata.team.category;
    let oldteams = [...this.state.users[uid].teams];
    let teams = oldteams.filter((team) => {
        if (team.id === oldchoice.id){team.category = newcat;}
        if (team.id === newchoice.id) {team.category = oldcat;}
        return team;
      }
    ); 
    var newstate = {...this.state};
    newstate.users[uid].teams=teams;
    this.setState(newstate);     
    this.sendUserUpdate(uid);
  }

  sendUserUpdate(uid){
    var adv = []; var othree = []; var threeO = []; var user = {}
    try{
      this.state.users[uid].teams.filter((team) => {if(team.category === "advance") {return team};return ""}).forEach(team=> {if(team.id >0) adv.push(team.id)});
      this.state.users[uid].teams.filter((team) => {if(team.category === "threeO") {return team};return ""}).forEach(team=> {if(team.id>0) threeO = team.id});
      this.state.users[uid].teams.filter((team) => {if(team.category === "othree") {return team};return ""}).forEach(team=> {if(team.id>0) othree = team.id});
      user ={
        id: uid,
        avatar: this.state.users[uid].userlogo,
        advance: adv,
        threeO: threeO,
        othree: othree,
      } 
    }catch(error){
      user={id:uid,}
    }
    this.props.handler(user);
  }

  addFriend(){
    var newState = {...this.state};
    var userNum = Object.keys(newState.users).length;
    var prevUser =JSON.parse(JSON.stringify(this.state.users[userNum-1]));
    newState.users[userNum] = prevUser;
    this.setState(newState);
    this.sendUserUpdate(userNum);
  }
  removeFriend(){
    var newState = {...this.state};
    var userNum = Object.keys(newState.users).length-1;
    if(userNum>0){
      delete newState.users[userNum];
    }
    this.setState(newState);
    this.sendUserUpdate(userNum);
  }
  
  TeamDrop = (team) => {
    return(
    <td className= "pictureDrop" key={team.id}>
      <DropTarget targetKey={team.userid} onHit={(e)=>this.onDrop(e,team)} >
        <DragDropContainer targetKey={team.userid} onDragStart={(e)=> this.onDragStart(e,team)}>
          <Image src={team.logo} fluid/>
        </DragDropContainer>
      </DropTarget>
    </td>
    )
  }
  collapseHandle(uid,e){
    var a = {...this.state};
    try {
      a.users[uid].closed = !this.state.users[uid].closed
    } catch (error) {
      a.users[uid] = {closed:false};
    }
    this.setState(a);
  }

  UserPicks(currentUser){
    var teams = {available: [], advance: [],
      threeO: [], othree: [],
    }
    var stalestate = {...this.state};
    stalestate.users[currentUser].teams.forEach((team)=> {
      team.userid=currentUser;
      teams[team.category].push(this.TeamDrop(team));
    }); 
    return(
       <div key={currentUser}>
        <Container fluid className='pl-0 pr-0'>
          <span>
            <input className="bg-dark text-white urlInput" type="url" 
              onChange={this.handleChange.bind(null,currentUser)}
              placeholder="Your icon url:"
            />   
            <Image className="userlogo" src={this.state.users[currentUser].userlogo} /> 
            <Button variant="secondary" size="sm"
              onClick={this.collapseHandle.bind(null,currentUser)}
              aria-controls="example-collapse-text" 
              > 
              {this.state.users[currentUser].closed ? '▼' : '▲' } 
            </Button>
          </span>
        </Container>
        <Collapse in={!this.state.users[currentUser].closed}>
          <Container fluid id="example-collapse-text" >
            <table>
              <tbody>
                <tr className="mr-1">
                  <th > <div className="header1">3-0 </div></th>
                  <th colSpan="9" ><div className="header1">Advance </div></th>
                  <th><div className="header1">0-3 </div></th>
                </tr>
                <tr>
                  {teams.threeO} 
                  <td width='3vw'></td>
                  {teams.advance} 
                  <td width="3vw"></td>
                  {teams.othree}      
                </tr>
              </tbody>
            </table>
            <div className="header2"> The options </div>
            <Container fluid className="pl-4 pr-4">
              <table>
                <tbody>
                  <tr className="availableTeams">
                    {teams.available}  
                  </tr>
                </tbody>
              </table>
            </Container>
          </Container>
        </Collapse>
      </div>
    )
  }
  
  render(){
    var userpicks=[]
    for(let [key] of Object.entries(this.state.users)){
      userpicks.push(this.UserPicks(key));
    }
    return(
      <div className="text-white ml-3 mr-3"> 
        <div className="mytitle"> Predictions</div>
        {userpicks}
        <div className="header2 ">
          < Button variant="secondary" size="sm" onClick={this.addFriend}> + </Button> 
          < Button variant="secondary" onClick ={this.removeFriend}> - </Button>
        </div>
      </div>
    )
  }
}
  
  
  export default ChooseTeams;  