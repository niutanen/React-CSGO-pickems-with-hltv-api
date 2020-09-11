import React from 'react';
import {Table, Container, Image} from 'react-bootstrap';
import { wincolor, losscolor } from '../globalconst';

export default Standings 
function Standings(friends, matches,event){
    var eventdata = event;
    var frienddata = friends;
   
    let teamRows = []; var teamdata;
    try { 
        teamdata = eventdata.teams;
        teamdata.forEach(team => {
            team.friends = {
                advance:[], othree:[], threeO:[],
            };
            team.wins = 0;
            team.losses = 0;
            for(let [, friend] of Object.entries(frienddata)){
                let a = <Image key={team.id+"-"+friend.id} width='20px' src={friend.avatar}/>
                if(friend.advance.includes(team.id)){
                    team.friends.advance.push(a);
                } else if (friend.threeO === team.id){
                    team.friends.threeO.push(a);
                } else if (friend.othree === team.id){
                    team.friends.othree.push(a);
                } 
            }
            try{
                matches.forEach(match=> {
                    if(match.team1.id===team.id){
                        if(match.team1.color === wincolor){
                            team.wins=team.wins+1;
                        } else if (match.team1.color === losscolor){
                            team.losses=team.losses+1;
                        }
                    } else if(match.team2.id===team.id){
                        if(match.team2.color === wincolor){
                            team.wins=team.wins+1;
                        } else if (match.team2.color === losscolor){
                            team.losses=team.losses+1;
                        }
                    }
                })
            } catch (error){}
        });
    } catch (error) { }
    try {
        teamdata.sort(
            (a,b)=>{
                if(a.wins===b.wins){
                    if(a.losses<b.losses){
                        return -1
                    } else {
                        return 1}
                } else if(a.wins < b.wins){ 
                   return 1
                } else {
                        return -1
                } 
            }
            ).forEach(team => {teamRows.push(TeamRow(team));})
    } catch (error) {}

    return (        
        <Container className="bg-dark text-white" >
            <div className="mytitle">
                Standings
            </div>
            <Table striped bordered variant="dark" >
                <thead>
                    <tr>
                    <th md="auto" >Team</th>
                    <th>Wins</th>
                    <th>Losses</th>
                    <th >3-0</th>
                    <th>Advance</th>
                    <th>0-3</th>
                    </tr>
                </thead>
                <tbody>
                    {teamRows}
                </tbody>
            </Table>
            <div className="spacer">  </div>
        </Container>
    );
}
function bgColorSetter(team,condition){
    switch (condition) {
        case "threeO":
            if(team.losses>0){ return {background:'red'}}
            else if (team.wins>2){return {background: 'green'}}
            else{
                var threeOpercent = team.wins/3*100;
                var transparency = (team.losses+team.wins)/10
                return {'backgroundImage': 'linear-gradient(to right, rgba(0,255,0,'+transparency+') '+threeOpercent+'%, rgba(255,0,0,0) 0%)'}
            }
        case "advance":
            if(team.wins>2){ return {background: 'green'}}
            else if(team.losses>2){ return {background: 'red'}}
            else {
                var winpercent = team.wins/(team.losses+team.wins)*100;
                var advtransparency = (team.losses+team.wins)/20
                return {'backgroundImage': 'linear-gradient(to right, rgba(0,255,0,'+advtransparency+') '+winpercent+'%, rgba(255,0,0,'+advtransparency+') 0%)'}
            } 
        case "othree":
            if(team.wins>0){ return {background: 'red'} } 
            else if (team.losses>2) {return {background: 'green'}}
            else{
                var othreepercent = team.losses/3*100;
                var othreetransparency = (team.losses+team.wins)/10
                return {'backgroundImage': 'linear-gradient(to right, rgba(0,255,0,'+othreetransparency+') '+othreepercent+'%, rgba(255,0,0,0) 0%)'}
            }
        default:
            break;
    }
}

function TeamRow(team){
    if(!Array.isArray(team.friends.threeO)){team.friends.threeO= "-";}
    if(!Array.isArray(team.friends.advance)){team.friends.advance= "-";}
    if(!Array.isArray(team.friends.othree)){team.friends.othree= "-";}
    return(
    <tr key={team.name} >
        <td><Image className="thumbnail" src={team.logo} width='25px' /></td>
        <td >{team.wins} {team.rank}</td>
        <td >{team.losses} </td>
        <td style={bgColorSetter(team,"threeO")}>{team.friends.threeO}</td>
        <td style={bgColorSetter(team,"advance")}>{team.friends.advance}</td>
        <td style={bgColorSetter(team,"othree")}>{team.friends.othree}</td>
    </tr>
    )
}