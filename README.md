# Info Grabber
Info Grabber is a "command line" tool to get info from BeatSaver and ScoreSaber

## What can Info Grabber Get?
Info Grabber can fetch players:
- Names
- Ranks
- Country Ranks
- Avatars

Info Grabber can fetch songs:
- Names
- Mappers
- Keys
- Covers

## What's the point?
Info Grabber can be used for getting information to be put on streams, like for the main tournament stream for example

## How do you use it?
##### Normal Mode
1) Download the `Info_Grabber-(version).exe` file from [Releases](https://github.com/AsoDesu/info-grabber/releases), and place it into any folder
2) Run the program and you'll notice than a `info.json` file and `data` folder is created
3) In the `info.json` file, change the player id's and song bsr code to the ones you need*
4) Run the exe again and everything will be downloaded and put in a folder called `data`

##### Watch Mode
1) Download the `Info_Grabber-(version).exe` file from [Releases](https://github.com/AsoDesu/info-grabber/releases), and place it into any folder
2) Run the program and you'll notice than an `info.json` file and `data` folder is created
3) In the `info.json` file, set `watch` to `true`
4) Everytime you change the values in the `info.json` file everything will be auto downloaded.

##### Stream Module
1) Complete all **watch mode** steps
2) Close `InfoGraber.exe`
3) Set `streams` in `info.json` to `true` and open `Info_Grabber-(version).exe`
4) Info Grabber will download a folder called `InfoGrabber_ext` inside is an `index.html` file
5) Open `http://localhost/?v=0` and you will see a black screen
6) In the `players` array, change the `twitch` value to the stream you want.
7) (Re)Open `http://localhost/?v=0` and you will the stream update
8) If you want to see another players stream simply replace the `0` at the end of the URL with the index of the player
###### See the example below for more details

**If you don't want one of the setting, just leave the field blank*
**If you have any questions dm me on discord @Aso#0001**

#### info.json
```
{
  "players": [
    {
      "id": "",
      "twitch": ""
    }
  ],
  "bsr": "",
  "watch": false,
  "streams": false
}
```

# Example
#### info.json
```
{
  "players": [
    {
      "id": "76561198272266872", // Aso's Scoresaber ID
      "twitch": "asodesu_" // Aso's Twitch
    },
    {
      "id": "76561198091128855", // Sirspam's Scoresaber ID
      "twitch": "sirspam_" // Sirspam's twitch
    },
    {
      "id": "76561198343533017", // Storm's Scoresaber
      "twitch": "st0rmpacer" // Storm's Twitch
    }
  ],
  "bsr": "",
  "watch": true,
  "streams": true
}
```
- If i want Aso's twitch the URL would be `http://localhost/?v=0`
- If i want Sirspam's twitch the URL would be `http://localhost/?v=1`
- If i want Storm's twitch the URL would be `http://localhost/?v=2`


#### `data` folder
![Data Folder](https://i.imgur.com/dlWdbAT.png)

### It Keeps crashing and not doing anything
If it keeps crashing, drag the exe file into Command Promt, and have a look to see if there is an error
![Drag the thing](https://i.imgur.com/nlmIhAD.png)

## What's planned for future features?
- Tournament Assistant Integration (Select a match from a TA Server and automaticly set the players and song)
- Web Panel (Have a web panel, where you can just put in all the info on a web page and it auto, changes)
- Discord Integration (Allow other people to do a command of a Discord Bot to set the player info)

## Contributing
If you would like to add anything to Info Grabber, or use it in one of your own projects, feel free

If you find any bugs or have a feature request, please [raise an issue](https://github.com/AsoDesu/info-grabber/issues)

### Dependencies
- got
- edit-json-file
- socket.io
- express

### DevDependencies
- typescript
- ts-node
- nodemon
- nexe

#### Types
- @types/node
- @types/edit-json-file
- @types/express
