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
1) Download the "Info_Grabber-(version).exe" file from [Releases](https://github.com/AsoDesu/info-grabber/releases), and place it into any folder
2) Run the program and you'll notice than a "info.json" file and "data" folder is created
3) In the "info.json" file, change the player id's and song bsr code to the ones you need*
4) Everything will be downloaded and placed into the folder called "data"
##### *If you don't want one of the setting, just leave the field blank

## It Keeps crashing and not doing anything
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

### DevDependencies
- typescript
- ts-node
- nodemon
- nexe
#### Types
- @types/node
- @types/edit-json-file
