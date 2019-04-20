require("dotenv").config();

var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");


var command = process.argv[2];

console.log("");

switch (command) {
    case "concert-this":
        concertThis(process.argv[3]);
        break;
    case "spotify-this-song":
        var Spotify = require('node-spotify-api');
        var spotify = new Spotify(keys.spotify);

        spotifyThis(process.argv[3]);
        break;
    case "movie-this":
        movieThis(process.argv[3]);
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    default:
        //wrong command, dipshit.
        break;
}


//
//
//  FUNCTIONS
//
//
function concertThis(artist) {
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    if (artist && !process.argv[4]) {
        axios
            .get(queryURL)
            .then(function (response) {
                if (response.data.length) {
                    for (var event of response.data) {
                        console.log("Venue: " + event.venue.name);
                        console.log("\t" + `${event.venue.city}, ${event.venue.country}`);
                        console.log("Date: " + moment(event.datetime).format("MM/DD/YYYY"));
                        console.log("-------------------------------------");
                    }
                } else {
                    console.log(`No events for ${artist} found.`);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    } else {
        console.log("Please enter an artist in the form: " + `node liri.js concert-this "artist name goes here"`);
    }

}

function spotifyThis(track) {
    if (track && !process.argv[4]) {
        spotify.search({
            type: "track",
            query: track
        }, function (err, data) {
            if (err) {
                return console.log("Error: " + err);
            }

            if (data.tracks.items.length) {
                for (var tracks of data.tracks.items) {
                    if (tracks.artists.length === 1) {
                        console.log("Artist: " + tracks.artists[0].name);
                    } else {
                        if (tracks.artists.length === 2) {
                            console.log(`Artists: ${tracks.artists[0].name} and ${tracks.artists[1].name}`)
                        } else {
                            process.stdout.write("Artists: ")

                            for (var n = 0; n < tracks.artists.length; n++) {
                                if (n !== tracks.artists.length - 1) {
                                    process.stdout.write(`${tracks.artists[n].name}, `);
                                } else {
                                    process.stdout.write(`and ${tracks.artists[n].name}\n`);
                                }
                            }
                        }
                    }

                    console.log("Album: " + tracks.album.name);
                    console.log("Song name: " + tracks.name);
                    console.log("Preview: " + tracks.preview_url);
                    console.log("");
                }
            } else {
                console.log(`No tracks found under the name "${track}."`);
            }
        });
    } else {
        console.log("Please enter a song in the form: " + `node liri.js spotify-this-song "song title goes here"`);
    }
}

function movieThis(title) {
    var queryURL = "http://www.omdbapi.com/?apikey=6e108ced&t=" + title;

    if (title && !process.argv[4]) {
        axios
            .get(queryURL)
            .then(function (response) {
                if (response.data.Response === "True") {
                    console.log(response.data.Title);
                    console.log("Released: " + response.data.Year);
                    for (var rating of response.data.Ratings) {
                        if (rating.Source === "Internet Movie Database") {
                            console.log("IMDB Rating: " + rating.Value);
                        } else if (rating.Source === "Rotten Tomatoes") {
                            console.log("Rotten Tomatoes rating: " + rating.Value);
                        }
                    }
                    console.log("Country/ies produced in: " + response.data.Country);
                    console.log("Language(s): " + response.data.Language);
                    console.log("Plot: " + response.data.Plot);
                    console.log("Actors: " + response.data.Actors);
                } else {
                    console.log(`No movie found for ${title}.`);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    } else {
        console.log("Please enter a movie in the form: " + `node liri.js movie-this "movie title goes here"`);
    }
}

function doWhatItSays() {
    
}