# GitSpector
GitSpector - The Sherlock Holmes of the Gitland.

## What's this?
GitSpector is a beautiful app, which interacts with chosen GitHub/GitLab Repositories and monitors it's informations, such as amount of stargazers. Aswell, it monitors the build status of your repository, it supports the major CI providers, such as AppVeyor and TravisCI.
It runs on Windows, OS X and Linux.

# Setup
```
git clone https://github.com/ioncodes/GitSpector.git
npm install
npm install electron -g
```
Now create two files: 'projects.json' and 'settings.json'.

projects.json stores the projects that you want to monitor.
You don't need to write your projects, just create the file. You can add them within the application.
```json
[{
    "url":"https://ci.appveyor.com/api/projects/ioncodes/dnpatch",
    "name":"dnpatch",
    "git":"https://api.github.com/repos/ioncodes/dnpatch"
},{
    "url":"https://ci.appveyor.com/api/projects/ioncodes/jodelapi",
    "name":"JodelAPI",
    "git":"https://api.github.com/repos/ioncodes/jodelapi"
},{
    "url":"https://ci.appveyor.com/api/projects/ioncodes/roguueliike",
    "name":"RoguueLiike",
    "git":"https://api.github.com/repos/ioncodes/roguueliike"
},{
    "url":"",
    "name":"NeptuneCI",
    "git":"https://api.github.com/repos/ioncodes/NeptuneCI"
}]
```
* url is the API url to the CI repo. If the project does not use any CI, leave it empty.
* name can be whatever you want, but be careful to not use anything rude, because your mother could be behind you ;) The most sense would make the repository name.
* git is the API url for git repo.

settings.json stores your authentication data for GitHub and other application settings.
You don't need to manually set them, just start up the application and click on the wrench at the top left corner.
```json
{"username":"your-username","password":"your-password"}
```
* username is your username on GitHub.
* password is your password on GitHub, if you have 2FA activated please create a new personal access token and use this as password.

Start GitSpector with ```electron .``` in the root folder.

# Picture time!
GIF of the tool:

![gif](http://i.imgur.com/CFUCuXV.gif)

It closes/minimizes into tray!

![png](http://i.imgur.com/a1GfCLp.png)

Add projects within the app!

![png](http://i.imgur.com/C0jnn4U.png)

Settings can be changed within the app!

![png](http://i.imgur.com/lhNlvTy.png)

# Features
- [x] GitHub integration
- [x] CI integration
- [x] Tray minimization
- [x] Good-looking UI
- [x] CI integration in UI
- [x] Click on head opens GitHub page
- [ ] GitLab integration
- [x] Auto refresh
- [ ] Add project without restart
- [x] Add project shortcut within application
- [x] Settings form within application
- [ ] Apply settings without restart
- [x] Easier/Automated setup
- [x] Desktop Notifications
- [ ] GitHub OAuth2

# Support
- [x] AppVeyor
- [ ] TravisCI
- [x] GitHub Public
- [ ] GitHub Private (never tried)
- [ ] GitLab

# Infos
* The update interval is set to 5 seconds (can be changed later)
* Toast notifications are only available on OS X, Linux and Windows 10

# How to
Make sure you have created the files projects.json and settings.json. Also make sure that you have added your GitHub credentials in settings.json as mentioned above.
Run it via ```electron .``` or download the release and start GitSpector.exe (not available yet).
To add a new project click on the plus (+) at the right top corner. There you can add the link to your GitHub repository and add a name. If used, you can add the CI link, but it's not needed.
The build status is marked with a tick or a cross at the right side of the project name.
To open the GitHub page, click on the name/header.
To set your credentials, click on the wrench at the top left corner, enter your username and password/token and hit save. Now restart the application.
