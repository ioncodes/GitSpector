const fs = require('fs-extra');
var request = require('then-request');
var json = fs.readJsonSync(__dirname + '/data/projects.json', {
    throws: true
});
var settings = fs.readJsonSync(__dirname + '/data/settings.json', {
    throws: true
});
var authHeader = 'Basic ' + new Buffer(settings.username + ':' + settings.password).toString('base64');

load();

function load() {
    var categoryWrap = document.createElement('div');
    categoryWrap.className = 'category-wrap';
    for (var i = 0; i < json.length; i++) {
        (function() {
            var url = json[i].url;
            var git = json[i].git;
            var name = json[i].name;
            var success;
            var head = document.createElement('div');
            head.className = 'head';
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
                        console.log(success);
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
                    var stars = body.stargazers_count;
                    var watchers = body.subscribers_count;
                    var forks = body.forks_count;
                    console.log(stars);
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
                            console.log(watchers);
                        } else if (j === 1) {
                            count.innerText = stars;
                            console.log(stars);
                        } else {
                            count.innerText = forks;
                            console.log(forks);
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
    //open popup
    $('.cd-popup-trigger').on('click', function(event) {
        event.preventDefault();
        $('.cd-popup').addClass('is-visible');
    });

    //close popup
    $('.cd-popup').on('click', function(event) {
        if ($(event.target).is('.cd-popup-close') || $(event.target).is('.cd-popup')) {
            event.preventDefault();
            $(this).removeClass('is-visible');
        }
    });
    //close popup when clicking the esc keyboard button
    $(document).keyup(function(event) {
        if (event.which == '27') {
            $('.cd-popup').removeClass('is-visible');
        }
    });
});
