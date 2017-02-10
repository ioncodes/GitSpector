# GitSpector
GitSpector - The Sherlock Holmes of the Gitland.

## What's this?
GitSpector is a beautiful app, which interacts with chosen GitHub/GitLab Repositories and monitors it's informations, such as amount of stargazers. Aswell, it monitors the build status of your repository, it supports the major CI providers, such as AppVeyor and TravisCI.

# Setup
```
git clone https://github.com/ioncodes/GitSpector.git
npm install
npm install electron -g
cd src/
mkdir data
cd data
```
Now create two files: 'projects.json' and 'settings.json'.

projects.json stores the projects that you want to monitor.
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
```json
{"username":"your-username","password":"your-password"}
```
* username is your username on GitHub.
* password is your password on GitHub, if you have 2FA activated please create a new personal access token and use this as password.

Start GitSpector and have fun :)

# Picture time!
GIF of the tool:
![gif](http://i.imgur.com/zZ6aXmz.gifv)

It closes/minimizes into tray!
![png](http://i.imgur.com/a1GfCLp.png)

# Features
- [x] GitHub integration
- [x] CI integration
- [x] Tray minimization
- [x] Good-looking UI
- [ ] CI integration in UI
- [ ] GitLab integration
- [ ] Auto refresh
- [ ] Add project shortcut within application
- [ ] Settings form within application
- [ ] Easier/Automated setup
- [ ] Desktop Notifications
- [ ] GitHub OAuth2
