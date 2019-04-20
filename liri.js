require("dotenv").config();

var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");
var chalk = require("chalk");
var inquirer = require("inquirer");


var command = process.argv[2];
var fileCommands = {
    currIndex: 0,
    list: []
};

console.log("");

switch (command) {
    case "concert-this":
        concertThis(process.argv[3]);
        break;
    case "spotify-this-song":
        spotifyThis(process.argv[3]);
        break;
    case "movie-this":
        movieThis(process.argv[3]);
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    default:
        console.log(`No "${command}" command was found.`)
        break;
}


//
//
//  FUNCTIONS
//
//
function concertThis(artist) {
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    var sendToLog = [`node liri.js concert-this "${artist}"\r\n\r\n`];

    if (artist && !process.argv[4]) {
        axios
            .get(queryURL)
            .then(function (response) {
                if (response.data.length && response.data.indexOf("error") === -1) {
                    for (var event of response.data) {
                        console.log(chalk.green("Venue: ") + chalk.cyan(event.venue.name));
                        sendToLog.push(`Venue: ${event.venue.name}\r\n`);
                        console.log(chalk.cyan("\t" + `${event.venue.city}, ${event.venue.country}`));
                        sendToLog.push(`\t${event.venue.city}, ${event.venue.country}\r\n`);
                        console.log(chalk.green("Date: ") + chalk.yellow(moment(event.datetime).format("MM/DD/YYYY") + "\n"));
                        sendToLog.push(`Date: ${moment(event.datetime).format("MM/DD/YYYY")}\r\n\r\n\r\n`);
                        writeToLog(sendToLog);
                    }
                } else if (response.data.indexOf("error") !== -1) {
                    console.log(chalk.red(response.data) + "\n");
                    sendToLog.push(`${response.data}\r\n\r\n\r\n`);
                    writeToLog(sendToLog);
                } else {
                    console.log(chalk.red(`No events for ${artist} found.\n`));
                    sendToLog.push(`No events for ${artist} found.\r\n\r\n\r\n`);
                    writeToLog(sendToLog);
                }
            });
    } else {
        console.log(chalk.red("Please enter an artist in the form: " + `node liri.js concert-this "artist name goes here"\n`));
        sendToLog.push(`Please enter an artist in the form: node liri.js concert-this "artist name goes here"\r\n\r\n\r\n`);
        writeToLog(sendToLog);
    }
}

function spotifyThis(track) {
    var Spotify = require('node-spotify-api');
    var spotify = new Spotify(keys.spotify);

    var sendToLog = [`node liri.js spotify-this-song "${track}"\r\n\r\n`];

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
                        console.log(chalk.green("Artist: ") + chalk.cyan(tracks.artists[0].name));
                        sendToLog.push(`Artist: ${tracks.artists[0].name}\r\n`);
                    } else {
                        if (tracks.artists.length === 2) {
                            console.log(chalk.green("Artists: ") + chalk.cyan(tracks.artists[0].name) + " and " + chalk.cyan(tracks.artists[1].name));
                            sendToLog.push(`Artists: ${tracks.artists[0].name} and ${tracks.artists[1].name}\r\n`)
                        } else {
                            process.stdout.write(chalk.green("Artists: "));
                            sendToLog.push("Artists: ");

                            for (var n = 0; n < tracks.artists.length; n++) {
                                if (n !== tracks.artists.length - 1) {
                                    process.stdout.write(chalk.cyan(`${tracks.artists[n].name}, `));
                                    sendToLog.push(`${tracks.artists[n].name}, `);
                                } else {
                                    process.stdout.write("and " + chalk.cyan(tracks.artists[n].name) + "\n");
                                    sendToLog.push(`and ${tracks.artists[n].name}\r\n`);
                                }
                            }
                        }
                    }

                    console.log(chalk.green("Album: ") + chalk.cyan(tracks.album.name));
                    sendToLog.push(`Album: ${tracks.album.name}\r\n`);
                    console.log(chalk.green("Song name: ") + chalk.cyan(tracks.name));
                    sendToLog.push(`Song name: ${tracks.name}\r\n`);
                    console.log(chalk.green("Preview: ") + chalk.yellow(tracks.preview_url + "\n"));
                    sendToLog.push(`Preview: ${tracks.preview_url}\r\n\r\n`);
                }

                sendToLog.push("\r\n");
                writeToLog(sendToLog);
            } else {
                console.log(chalk.red(`No tracks found under the name "${track}."\n`));
                sendToLog.push(`No tracks found under the name "${track}".\r\n\r\n\r\n`);
                writeToLog(sendToLog);
            }
        });
    } else {
        console.log(chalk.red("Please enter a song in the form: " + `node liri.js spotify-this-song "song title goes here"\n`));
        sendToLog.push(`Please enter a song in the form: node liri.js spotify-this-song "song title goes here"\r\n\r\n\r\n`);
        writeToLog(sendToLog);
    }

}

function movieThis(title) {
    var queryURL = "http://www.omdbapi.com/?apikey=6e108ced&t=" + title;

    var sendToLog = [`node liri.js movie-this "${title}"\r\n\r\n`];

    if (title && !process.argv[4]) {
        axios
            .get(queryURL)
            .then(function (response) {
                if (response.data.Response === "True") {
                    console.log(chalk.magenta(response.data.Title));
                    sendToLog.push(`${response.data.Title}\r\n`);
                    console.log(chalk.green("Released: ") + chalk.cyan(response.data.Year));
                    sendToLog.push(`Released: ${response.data.Year}\r\n`);
                    for (var rating of response.data.Ratings) {
                        if (rating.Source === "Internet Movie Database") {
                            console.log(chalk.green("IMDB Rating: ") + chalk.cyan(rating.Value));
                            sendToLog.push(`IMDB Rating: ${rating.Value}\r\n`);
                        } else if (rating.Source === "Rotten Tomatoes") {
                            console.log(chalk.green("Rotten Tomatoes rating: ") + chalk.cyan(rating.Value));
                            sendToLog.push(`Rotten Tomatoes rating: ${rating.Value}\r\n`);
                        }
                    }
                    console.log(chalk.green("Country/ies produced in: ") + chalk.cyan(response.data.Country));
                    sendToLog.push(`Country/ies produced in: ${response.data.Country}\r\n`);
                    console.log(chalk.green("Language(s): ") + chalk.cyan(response.data.Language));
                    sendToLog.push(`Language(s): ${response.data.Language}\r\n`);
                    console.log(chalk.green("Plot: ") + chalk.cyan(response.data.Plot));
                    sendToLog.push(`Plot: ${response.data.Plot}\r\n`);
                    console.log(chalk.green("Actors: ") + chalk.cyan(response.data.Actors + "\n"));
                    sendToLog.push(`Actors: ${response.data.Actors}\r\n\r\n\r\n`);
                    writeToLog(sendToLog);
                } else {
                    console.log(chalk.red(`No movie found for ${title}.\n`));
                    sendToLog.push(`No movie found for ${title}.\r\n\r\n\r\n`);
                    writeToLog(sendToLog);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    } else {
        console.log(chalk.red("Please enter a movie in the form: " + `node liri.js movie-this "movie title goes here"\n`));
        sendToLog.push(`Please enter a movie in the form: node liri.js movie-this "movie title goes here"\r\n\r\n\r\n`);
        writeToLog(sendToLog);
    }
}

function doWhatItSays() {
    fs.readFile("./random.txt", "utf-8", function (err, data) {
        if (err) {
            return console.log("Error: " + err);
        }

        var lines = data.split("\r\n");

        for (var number of lines) {
            var holder = number.split(",");

            fileCommands.list.push({
                command: holder[0],
                data: holder[1].replace(/\"/g, "")
            });
        }

        processCommands();
    });
}

function inquirerPause() {


    inquirer.prompt([
        {
            type: "input",
            name: "none",
            message: "Press any key to continue."
        }
    ]).then(function (user) {
        console.log("");
        processCommands();
    });
}

function processCommands() {
    var currCommand = fileCommands.list[fileCommands.currIndex];

    switch (currCommand.command) {
        case "concert-this":
            concertThis(currCommand.data);
            break;
        case "spotify-this-song":
            spotifyThis(currCommand.data);
            break;
        case "movie-this":
            movieThis(currCommand.data);
            break;
        default:
            console.log(`No "${currCommand.command}" command was found.`)
            break;
    }

    if (fileCommands.currIndex < fileCommands.list.length - 1) {
        fileCommands.currIndex++;
        setTimeout(inquirerPause, 500);
    }
}

function writeToLog(data) {
    var joinedData = data.join("");

    fs.appendFile("./log.txt", joinedData, function (error) {
        if (error) {
            return console.log("Error: " + error);
        }
    });
}