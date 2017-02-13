const fs = require('fs-extra');
var request = require('then-request');
var projects = fs.readJsonSync(__dirname + '/data/projects.json', {
    throws: true
});
var settings = fs.readJsonSync(__dirname + '/data/settings.json', {
    throws: true
});
var authHeader = 'Basic ' + new Buffer(settings.username + ':' + settings.password).toString('base64');
var githubCache = []; // cache projectname and Last-Modified header here to not exceed the github api limits

load();

setInterval(reload, 5000);

function load() {
    var categoryWrap = document.createElement('div');
    categoryWrap.className = 'category-wrap';
    for (var i = 0; i < projects.length; i++) {
        (function() {
            var url = projects[i].url;
            var git = projects[i].git;
            var name = projects[i].name;
            var success;
            var head = document.createElement('div');
            head.className = 'head';
            head.setAttribute('onclick', 'openUrl("' + toGitHub(git) + '")');
            head.innerText = name;
            if (url !== "") {
                request('GET', url).done(function(res) {
                    var body = JSON.parse(res.body.toString('utf-8'));
                    process.nextTick(function() {
                        if (body.build.status === 'success') {
                            success = true;
                        } else {
                            success = false;
                        }
                        if (success) {
                            var checkmark = document.createElement('i');
                            checkmark.className = 'fa fa-check';
                            checkmark.setAttribute('aria-hidden', 'true');
                            head.appendChild(checkmark);
                        } else {
                            var cross = document.createElement('i');
                            cross.className = 'fa fa-times';
                            cross.setAttribute('aria-hidden', 'true');
                            head.appendChild(cross);
                        }
                    });
                });
            }

            request('GET', git, {
                headers: {
                    "User-Agent": "Electron",
                    "Authorization": authHeader
                }
            }).done(function(res) {
                var body = JSON.parse(res.body.toString('utf-8'));
                process.nextTick(function() {
                    var cache = {'name':name,'modified':res.headers['last-modified']};
                    githubCache.push(cache); // add cache object
                    var stars = body.stargazers_count;
                    var watchers = body.subscribers_count;
                    var forks = body.forks_count;
                    var category = document.createElement('div');
                    category.className = 'category';

                    var statisticWrap = document.createElement('div');
                    statisticWrap.className = 'statistic-wrap';

                    statisticWrap.appendChild(head);

                    for (var j = 0; j < 3; j++) {
                        var statistic = document.createElement('div');
                        statistic.className = 'statistic';

                        var count = document.createElement('div');
                        count.className = 'count';
                        if (j === 0) {
                            count.innerText = watchers;
                            count.id = name + '-watchers';
                        } else if (j === 1) {
                            count.innerText = stars;
                            count.id = name + '-stars';
                        } else {
                            count.innerText = forks;
                            count.id = name + '-forks';
                        }

                        var title = document.createElement('div');
                        title.className = 'title';
                        if (j === 0) {
                            title.innerText = 'Watchers';
                        } else if (j === 1) {
                            title.innerText = 'Stars';
                        } else {
                            title.innerText = 'Forks';
                        }

                        statistic.appendChild(count);
                        statistic.appendChild(title);

                        statisticWrap.appendChild(statistic);
                    }

                    category.appendChild(statisticWrap);
                    categoryWrap.appendChild(category);
                });
            });
        })();
    }

    var nano = document.createElement('div');
    nano.className = 'nano';

    var nanoContent = document.createElement('div');
    nanoContent.className = 'nano-content';
    nanoContent.appendChild(categoryWrap);
    nano.appendChild(nanoContent);

    document.getElementById('body').appendChild(nano);
}

jQuery(document).ready(function($) {
    $('.cd-popup-trigger-project').on('click', function(event) {
        event.preventDefault();
        $('.cd-popup-project').addClass('is-visible');
    });
    $('.cd-popup-trigger-settings').on('click', function(event) {
        event.preventDefault();
        $('.cd-popup-settings').addClass('is-visible');
    });
    $('.cd-popup').on('click', function(event) {
        if ($(event.target).is('.cd-popup-close') || $(event.target).is('.cd-popup')) {
            event.preventDefault();
            $(this).removeClass('is-visible');
        }
    });
    $(document).keyup(function(event) {
        if (event.which == '27') {
            $('.cd-popup').removeClass('is-visible');
        }
    });
});

function addProject() {
    var git = document.getElementById('github-link').value;
    var ci = document.getElementById('ci-link').value;
    var name = document.getElementById('project-name').value;
    var valid = true;
    var ciSet = false;
    if (git === '' || git === undefined) {
        document.getElementById('github-link').className = 'form form-error';
        valid = false;
    }
    if (name === '' || name === undefined) {
        document.getElementById('project-name').className = 'form form-error';
        valid = false;
    }
    if (ci !== '' && ci !== undefined) {
        ciSet = true;
    }
    if (!valid) {
        return;
    }

    git = convertGitHub(git);
    if (ciSet) {
        ci = convertAppVeyor(ci);
    }

    var json = {
        'url': ci,
        'name': name,
        'git': git
    };
    projects.push(json);

    fs.writeJsonSync(__dirname + '/data/projects.json', projects);

    closePopup();
}

function closePopup() {
    document.getElementsByClassName('cd-popup')[0].classList.remove('is-visible');
    document.getElementsByClassName('cd-popup')[1].classList.remove('is-visible');
}

function convertGitHub(url) {
    return url.replace('github.com/', 'api.github.com/repos/');
}

function convertAppVeyor(url) {
    return url.replace('appveyor.com/project/', 'appveyor.com/api/projects/');
}

function toGitHub(url) {
    return url.replace('api.github.com/repos/', 'github.com/');
}

function openUrl(url) {
    const {
        shell
    } = require('electron');
    shell.openExternal(url);
}

function setSettings() {
    var user = document.getElementById('github-user').value;
    var pass = document.getElementById('github-pass').value;
    if (user === '') {
        document.getElementById('github-user').className = 'form form-error';
        return;
    }
    if (pass === '') {
        document.getElementById('github-pass').className = 'form form-error';
        return;
    }
    settings.username = user;
    settings.password = pass;
    fs.writeJsonSync(__dirname + '/data/settings.json', settings);
}

function reload() {
    for(var i = 0; i < projects.length; i++) {
        (function() {
            var name = projects[i].name;
            for(var j = 0; j < githubCache.length; j++) {
                if(githubCache[j].name === name) {
                    request('GET', projects[i].git, {headers:{'User-Agent': 'Electron','If-Modified-Since':githubCache[j].modified}}).done(function(res) { //
                        process.nextTick(function() {
                            if(res.statusCode !== 304) {
                                // something changed
                                var body = JSON.parse(res.body.toString('utf-8'));
                                var starCount = body.stargazers_count;
                                var watchersCount = body.subscribers_count;
                                var forksCount = body.forks_count;
                                var stars = document.getElementById(name + '-stars');
                                var watchers = document.getElementById(name + '-watchers');
                                var forks = document.getElementById(name + '-forks');
                                stars.innerText = starCount;
                                watchers.innerText = watchersCount;
                                forks.innerText = forksCount;
                                // todo: update the modified cache
                                var newModified = res.headers['last-modified'];
                                githubCache[j].modified = newModified;
                            } else {
                                // this repo has no changes
                            }
                        });
                    });
                }
            }
        })();
    }
}
