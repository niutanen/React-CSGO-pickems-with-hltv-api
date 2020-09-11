
import { logoUrlRoot } from '../globalconst';

function StartState(res) {
    var theState = {};
    theState.userlogo= 'https://img.icons8.com/android/2x/user.png';
    try {    
        var recievedTeams = [];
        res.teams.forEach(team => {
            team.logo=logoUrlRoot+team.id
            team.category="available";
            team.pWinn = 0.5;
            recievedTeams.push(team);
        });
        recievedTeams.push(
            {id: -1, category:"advance", logo: process.env.PUBLIC_URL+'/blank.svg', pWin: 0.5},
            {id: -2, category:"advance", logo: process.env.PUBLIC_URL+'/blank.svg', pWin: 0.5},
            {id: -3, category:"advance", logo: process.env.PUBLIC_URL+'/blank.svg', pWin: 0.5},
            {id: -4, category:"advance", logo: process.env.PUBLIC_URL+'/blank.svg', pWin: 0.5},
            {id: -5, category:"advance", logo: process.env.PUBLIC_URL+'/blank.svg', pWin: 0.5},
            {id: -6, category:"advance", logo: process.env.PUBLIC_URL+'/blank.svg', pWin: 0.5},
            {id: -7, category:"advance", logo: process.env.PUBLIC_URL+'/blank.svg', pWin: 0.5},
            {id: -8, category:"othree", logo: process.env.PUBLIC_URL+'/blank.svg', pWin: 0.5},
            {id: -9, category:"threeO", logo: process.env.PUBLIC_URL+'/blank.svg', pWin: 0.5},
            );       
        theState.teams= recievedTeams;
        theState.dragdata= {};
    } catch (error) {
        theState =  {
            teams: [
             
            ],
            dragdata: {},
            closed:false,
        }
    }
    var startState= {users:{0:{}}};
    startState.users[0]=theState;
    return startState;
};
export default StartState;