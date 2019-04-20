# liri-node-app

## LIRI
LIRI is a command line node application which returns information on songs, movies, and concerts.

## commands
### concert-this
`node liri.js concert-this "[Artist]"` will return any upcoming concerts by the requested artist using the Bandsintown API.

### spotify-this-song
`node liri.js spotify-this-song "[Song Name]"` will return any occurance of the song requested from the spotify API, as well as the artist, album, and a preview url of the song.

### movie-this
`node liri.js movie-this "[Movie Title]"` will return data on the movie requested using the OMDB API.

## Logs
All data requested from LIRI is logged in log.txt, including the comman used and data returned by the command.


## In use
Here's a video of LIRI in use: https://raw.githubusercontent.com/Slowpossum/liri-node-app/master/movie/liri-in-use.webm
