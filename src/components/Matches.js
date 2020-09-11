import React, { Component } from 'react';
import {logoUrlRoot, wincolor, losscolor, bgcolor, lsMatchesUpdate } from '../globalconst';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Image, Container } from 'react-bootstrap';
import HLTV from 'hltv';
import ls from 'local-storage';
const myHLTV = HLTV.createInstance({hltvUrl: 'https://cors-anywhere.herokuapp.com/https://www.hltv.org'});

export default class Matches extends Component{
  constructor(props){
    super(props);
    this.state = {
      matches: [],
      friends: props.friends,
    };
  }
  
  componentDidMount(){   
    var savedmatches = ls.get('savedmatches');
    var lastupdate = ls.get(lsMatchesUpdate);

    if(Number.isNaN(lastupdate)){
      lastupdate = 100;
    }
    console.log('datenow-lastupdate', (Date.now()-lastupdate)/1000, 'seconds');
    if(Date.now() > lastupdate+1000*60*5 || typeof savedmatches === 'undefined'){
      var a = [];
      var b = [];
      myHLTV.getMatches({}).then((response)=>{
        a = response.filter((el)=>{
          try{
            if(Number(el.event.id) === Number(this.props.myeventid)){
              return el;
            }
            return "";
          }catch(error){ return "" }
        });
        a.forEach(element => {if(!element.hasOwnProperty('result')){ element.result = " - ";}});
        this.setState({
          matches: [
            ...a,
            ...b,
          ]
        });
        const savematches ={matches: this.state.matches};
        ls.set(lsMatchesUpdate,Date.now());
        ls.set('savedmatches', savematches);
        this.props.handler(savematches);
        console.log('upcoming matches retrieved from hltv', a, 'results:',b);
        return "";
      });
      myHLTV.getResults({eventID:this.props.myeventid}).then((response)=>{
        b = response;
        this.setState({matches: [
          ...a,
          ...b,  
        ]});
        const savematches ={matches: this.state.matches};
        ls.set(lsMatchesUpdate,Date.now());
        ls.set('savedmatches', savematches);
        this.props.handler(savematches);
        console.log('results retrieved from hltv', a, 'results:',b);
      });
    } else {
      console.log('matches retrieved from ls');
      this.setState({matches: savedmatches.matches});
      this.props.handler(savedmatches);
    }
  }
  
  componentDidUpdate(newprops){
    if(newprops.friends !== this.state.friends){
      this.setState({friends: newprops.friends});
    }
  }
  
  
  render(){
    return(
      <Container className="bg-dark pl-3 pr-3" fluid >
        <div className="mytitle"> Matches </div>
        <div className="ml-3 mr-3 pb-2 bg-dark" >
          {Remtch(this.state)}
        </div>
      </Container>
    );
  }
}
function Remtch(states) {
  var mtches = states.matches;
  var friends = states.friends;
  var mymtches =[] 
  try {
    mtches.sort((a,b)=>(a.id < b.id)? 1 : -1).forEach(match => {
      var result = match.result.split(" - ");
      match.team1.color = bgcolor; match.team2.color = bgcolor;
      if (Number(result[0])>Number(result[1])) {
        match.team1.color=wincolor; match.team2.color=losscolor;
      } else if(Number(result[0])<Number(result[1])) {
        match.team1.color=losscolor; match.team2.color=wincolor;
      }
      mymtches.push(Match(match,friends));
    });
    return mymtches;  
  } catch (error) {
    return JSON.stringify(mtches);
  }
}
  
function Match(match,friends){
  const pick1=[];const pick2=[];
  // loop through friends add if picked
  for(let [key,  friend] of Object.entries(friends)){
    if( friend.advance.includes(match.team1.id) || Number(friend.threeO) === Number(match.team1.id) || Number(friend.othree) === Number(match.team2.id) ){
      pick1.push(
        <Image key={match.id + key + match.team1.id} width='20%' src={friend.avatar}/>
      );
    }
    if(friend.advance.includes(match.team2.id) || friend.threeO === match.team2.id || friend.othree === match.team1.id ){
      pick2.push(
        <Image key={match.id + key + match.team2.id} width='20%' src={friend.avatar}/>
      );
    }    
  };
  return(
    <Row className="matchRow" noGutters key={match.id}> 
        <Col className="match picked" style={{backgroundColor: match.team1.color}} > 
          {pick1}
        </Col>
        <Col className="match team1" style={{backgroundColor: match.team1.color, }}>
          <Image src={logoUrlRoot + match.team1.id} alt={match.team1.id} width='60%'/>
        </Col>
        <Col className="match score"> {match.result} </Col>
        <Col className="match team2" style={{backgroundColor: match.team2.color}}>
          <Image src={logoUrlRoot + match.team2.id} alt={match.team2.id} width='60%' />
        </Col>
        <Col className="match picked" style={{backgroundColor: match.team2.color,}}>
          {pick2} 
        </Col>
    </Row>
  )
}
