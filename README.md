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
5) Open `http://localhost/?v=twitch1` and you will see a black screen
6) If you change the `twitch1` a value in info.json, the stream will refresh with the new twitch name
7) For the other stream, open `http://localhost/?v=twitch2` and change `twitch2`
**You can even do more than 2 streams if you add another `twitch(number)` value and change the url to `http://localhost/?v=twitch(number)`**

**If you don't want one of the setting, just leave the field blank*
**If you have any questions dm me on discord @Aso#0001**

### 

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
