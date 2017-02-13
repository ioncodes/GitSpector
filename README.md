# GitSpector
GitSpector - The Sherlock Holmes of the Gitland.

## What's this?
GitSpector is a beautiful app, which interacts with chosen GitHub/GitLab Repositories and monitors it's informations, such as amount of stargazers. Aswell, it monitors the build status of your repository, it supports the major CI providers, such as AppVeyor and TravisCI.
It runs on Windows, OS X and Linux.

# Setup
Download the package for your system [here](https://github.com/ioncodes/GitSpector/releases). Unzip it and go into to the root folder where GitSpector.* resides.  
Start it and click on the wrench at the top left corner. Insert your GitHub username and your password, if you use 2FA please create a personal accesstoken on GitHub and use the token instead of the password. Make sure you set the public scope. Now, hit save.  
Click on the plus at the top right corner. Insert the link of the GitHub repository you'd like to monitor, for example: https://github.com/ioncodes/GitSpector.  
You can select any name you want, but it's recommended to use the repository's name.  
If it uses some sort of CI (see Support section first!), you can additionally add the url to the project, example: https://ci.appveyor.com/project/ioncodes/dnpatch.  
Now you can hit 'Add'.  
By minimizing the application, it will minimize into the tray.
You can click on the name of the project to open the GitHub page in your browser.

# Picture time!
GIF of the tool:

![gif](http://i.imgur.com/cWf2yNW.gif)

It closes/minimizes into tray!

![png](http://i.imgur.com/a1GfCLp.png)

Add projects within the app!

![png](http://i.imgur.com/88QRsxz.png)

Settings can be changed within the app!

![png](http://i.imgur.com/jdE2CAe.png)

While writing this readme someone starred Electron, I will tell you my spy tricks, I use GitSpector, which sends you toast notifications! ;)

![png](http://i.imgur.com/e5PwyXI.png)

# Features
- [x] GitHub integration
- [x] CI integration
- [x] Tray minimization
- [x] Good-looking UI
- [x] CI integration in UI
- [x] Click on head opens GitHub page
- [ ] GitLab integration
- [x] Auto refresh
- [x] Add project without restart
- [x] Add project shortcut within application
- [x] Settings form within application
- [x] Apply settings without restart
- [x] Easier/Automated setup
- [x] Desktop Notifications

# Support
- [x] AppVeyor
- [ ] TravisCI
- [x] GitHub Public
- [ ] GitHub Private (never tried)
- [ ] GitLab

# Infos
* The update interval is set to 5 seconds (can be changed later)
* Toast notifications are only available on OS X, Linux and Windows 10
* Your GitHub API rate limits shouldn't exceed, because I implemented GitHub's conditional requests.

# Setup from source
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
