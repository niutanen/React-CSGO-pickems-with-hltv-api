# React-CSGO-pickems-with-hltv-api
## This is a personal project I worked on while bored during my 2020 layoff.
The project is a basic website that resizes with the viewwidth of the window.
The website that can be accessed at: https://road2rio-friendly-predictions.herokuapp.com/

The user can choose teams, which then update immediately in the match list and standings.
The teams, matches and results queried with https://github.com/gigobyte/HLTV unofficial api. this allows the event to be changed, but works best with events that have 16 teams.

The choices are saved in cookies, thus requiring nearly no backend for the app. 
The choices can be shared by copying the url after clicking the share button. This converts the cookies to json, which then is parsed when the website is loaded.
This is an unsafe avenue for handling inputs, as there is no sanitization.
