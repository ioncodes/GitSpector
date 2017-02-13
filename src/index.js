const fs = require('fs-extra');
const request = require('then-request');
const {
    shell
} = require('electron');
const notifier = require('node-notifier');
var projects = fs.readJsonSync(__dirname + '/data/projects.json', {
    throws: true
});
var settings = fs.readJsonSync(__dirname + '/data/settings.json', {
    throws: true
});
if (settings.username === '<username>' && settings.password === '<password-or-token>') {
    showMessage('Apply settings first!');
}
var authHeader = 'Basic ' + new Buffer(settings.username + ':' + settings.password).toString('base64');
var githubCache = []; // cache projectname and Last-Modified header here to not exceed the github api limits
const colors = ['#a8bf9a', '#ddca7e', '#d6877a', '#73748c', '#8a98a3'];
var colorCounter = 0;

if(projects.length > 0) {
    load();
    setInterval(reload, 5000);
}

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
                    var cache = {
                        'name': name,
                        'modified': res.headers['last-modified']
                    };
                    githubCache.push(cache); // add cache object
                    var stars = body.stargazers_count;
                    var watchers = body.subscribers_count;
                    var forks = body.forks_count;
                    var category = document.createElement('div');
                    category.className = 'category';
                    category.style = 'background: ' + colors[colorCounter] + ';';
                    if (colorCounter === 4) {
                        colorCounter = 0;
                    } else {
                        colorCounter++;
                    }

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

document.getElementById('github-link').onblur = function() {
    var git = document.getElementById('github-link').value;
    if (git === '' || !/http([s]?):\/\/github\.com\/.+?(?=\/).+?(?=(\/|$))/g.test(git)) {
        document.getElementById('github-link').className = document.getElementById('github-link').className.replace(/\ssuccess/g, '');
        document.getElementById('github-link').className += ' error';
    } else {
        document.getElementById('github-link').className = document.getElementById('github-link').className.replace(/\serror/g, '');
        document.getElementById('github-link').className += ' success';
    }
};

document.getElementById('project-name').onblur = function() {
    var name = document.getElementById('project-name').value;
    if (name === '') {
        document.getElementById('project-name').className = document.getElementById('project-name').className.replace(/\ssuccess/g, '');
        document.getElementById('project-name').className += ' error';
    } else {
        document.getElementById('project-name').className = document.getElementById('project-name').className.replace(/\serror/g, '');
        document.getElementById('project-name').className += ' success';
    }
};

function addProject() {
    var git = document.getElementById('github-link');
    var ci = document.getElementById('ci-link');
    var name = document.getElementById('project-name');
    var ciSet = false;

    if (git.className.indexOf(' success') === -1) {
        showMessage('Error!');
        return;
    }
    if (name.className.indexOf(' success') === -1) {
        showMessage('Error!');
        return;
    }
    if (ci.value !== '') {
        ciSet = true;
    }

    var gitUrl = convertGitHub(git.value);
    if(gitUrl.endsWith('/')) {
        gitUrl = gitUrl.substring(0, gitUrl.length - 1);
    }
    var ciUrl;
    if (ciSet) {
        ciUrl = convertAppVeyor(ci.value);
    } else {
        ciUrl = '';
    }

    var json = {
        'url': ciUrl,
        'name': name.value,
        'git': gitUrl
    };
    projects.push(json);

    fs.writeJsonSync(__dirname + '/data/projects.json', projects);

    closePopup();

    if(projects.length === 1) {
        load();
        setInterval(reload, 5000);
    } else {
        loadNewProject(name.value);
    }

    git.value = '';
    ci.value = '';
    name.value = '';

    showMessage('Project added!');
}

function closePopup() {
    document.getElementsByClassName('cd-popup')[0].classList.remove('is-visible');
    document.getElementsByClassName('cd-popup')[1].classList.remove('is-visible');

    // clear the input boxes and their states to avoid wrong modal data
    document.getElementById('github-pass').className = document.getElementById('github-pass').className.replace(/\ssuccess/g, '');
    document.getElementById('github-pass').className = document.getElementById('github-pass').className.replace(/\serror/g, '');
    document.getElementById('github-user').className = document.getElementById('github-user').className.replace(/\ssuccess/g, '');
    document.getElementById('github-user').className = document.getElementById('github-user').className.replace(/\serror/g, '');
    document.getElementById('project-name').className = document.getElementById('project-name').className.replace(/\ssuccess/g, '');
    document.getElementById('project-name').className = document.getElementById('project-name').className.replace(/\serror/g, '');
    document.getElementById('github-link').className = document.getElementById('github-link').className.replace(/\ssuccess/g, '');
    document.getElementById('github-link').className = document.getElementById('github-link').className.replace(/\serror/g, '');
    document.getElementById('github-pass').value = '';
    document.getElementById('github-user').value = '';
    document.getElementById('project-name').value = '';
    document.getElementById('github-link').value = '';
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
    shell.openExternal(url);
}

document.getElementById('github-user').onblur = function() {
    var name = document.getElementById('github-user').value;
    if (name === '') {
        document.getElementById('github-user').className = document.getElementById('github-user').className.replace(/\ssuccess/g, '');
        document.getElementById('github-user').className += ' error';
    } else {
        document.getElementById('github-user').className = document.getElementById('github-user').className.replace(/\serror/g, '');
        document.getElementById('github-user').className += ' success';
    }
};

document.getElementById('github-pass').onblur = function() {
    var pass = document.getElementById('github-pass').value;
    if (pass === '') {
        document.getElementById('github-pass').className = document.getElementById('github-pass').className.replace(/\ssuccess/g, '');
        document.getElementById('github-pass').className += ' error';
        valid = false;
    } else {
        document.getElementById('github-pass').className = document.getElementById('github-pass').className.replace(/\serror/g, '');
        document.getElementById('github-pass').className += ' success';
    }
}

function setSettings() {
    var user = document.getElementById('github-user');
    var pass = document.getElementById('github-pass');
    if (user.className.indexOf(' success') === -1) {
        showMessage('Error!');
        return;
    }
    if (pass.className.indexOf(' success') === -1) {
        showMessage('Error!')
        return;
    }
    settings.username = user.value;
    settings.password = pass.value;
    fs.writeJsonSync(__dirname + '/data/settings.json', settings);

    closePopup();

    user.value = '';
    pass.value = '';

    authHeader = 'Basic ' + new Buffer(settings.username + ':' + settings.password).toString('base64');
    showMessage('Saved settings!');

    if (projects.length === 0) {
        showMessage('You can add projects now!');
    }
}

function loadNewProject(name) {
    var categoryWrap = document.getElementsByClassName('category-wrap')[0];
    (function() {
        for (var i = 0; i < projects.length; i++) {
            if (projects[i].name === name) {
                var success;
                var git = projects[i].git;
                var url = projects[i].url;
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
                        var cache = {
                            'name': name,
                            'modified': res.headers['last-modified']
                        };
                        githubCache.push(cache); // add cache object
                        var stars = body.stargazers_count;
                        var watchers = body.subscribers_count;
                        var forks = body.forks_count;
                        var category = document.createElement('div');
                        category.className = 'category';
                        category.style = 'background: ' + colors[colorCounter] + ';';
                        if (colorCounter === 4) {
                            colorCounter = 0;
                        } else {
                            colorCounter++;
                        }

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
            }
        }
    })();
}


function reload() {
    for (var i = 0; i < projects.length; i++) {
        (function() {
            var name = projects[i].name;
            for (var j = 0; j < githubCache.length; j++) {
                if (githubCache[j].name === name) {
                    request('GET', projects[i].git, {
                        headers: {
                            'User-Agent': 'Electron',
                            'If-Modified-Since': githubCache[j].modified,
                            'Authorization': authHeader
                        }
                    }).done(function(res) {
                        process.nextTick(function() {
                            if (res.statusCode !== 304) {
                                // something changed
                                var body = JSON.parse(res.body.toString('utf-8'));
                                var starChanged = false;
                                var forksChanged = false;
                                var watchersChanged = false;
                                var starCount = body.stargazers_count;
                                var watchersCount = body.subscribers_count;
                                var forksCount = body.forks_count;
                                var stars = document.getElementById(name + '-stars');
                                if (starCount.toString() !== stars.innerText) {
                                    starChanged = true;
                                }
                                var watchers = document.getElementById(name + '-watchers');
                                if (watchersCount.toString() !== watchers.innerText) {
                                    watchersChanged = true;
                                }
                                var forks = document.getElementById(name + '-forks');
                                if (forksCount.toString() !== forks.innerText) {
                                    forksChanged = true;
                                }
                                stars.innerText = starCount;
                                watchers.innerText = watchersCount;
                                forks.innerText = forksCount;
                                if (starChanged) {
                                    notifier.notify({
                                        'title': 'GitSpector',
                                        'message': 'Someone has starred ' + name,
                                        'icon': __dirname + '/icons/star.png'
                                    });
                                }
                                if (watchersChanged) {
                                    notifier.notify({
                                        'title': 'GitSpector',
                                        'message': 'Someone is watching ' + name,
                                        'icon': __dirname + '/icons/watch.png'
                                    });
                                }
                                if (forksChanged) {
                                    notifier.notify({
                                        'title': 'GitSpector',
                                        'message': 'Someone has forked ' + name,
                                        'icon': __dirname + '/icons/fork.png'
                                    });
                                }
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

function showMessage(msg) {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");

    // Add the "show" class to DIV
    x.className = "show";
    x.innerText = msg;

    // After 3 seconds, remove the show class from DIV
    setTimeout(function() {
        x.className = x.className.replace("show", "");
    }, 3000);
}
