(function(window) {
  'use strict';

  var $ = function(element) {
    var el = document.querySelector(element);

    el.addClass = addClass.bind(el);
    el.removeClass = removeClass.bind(el);
    el.toggleClass = toggleClass.bind(el);
    el.trigger = trigger.bind(el);
    el.hide = hide.bind(el);
    el.show = show.bind(el);

    return el;
  }

  function addClass(className) {
    if (this.classList) {
      this.classList.add(className);
    } else {
      this.className += ' ' + className;
    }
  }

  function removeClass(className) {
    if (this.classList)
      this.classList.remove(className);
    else
      this.className = this.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }

  function toggleClass(className) {
    var classes, existingIndex;

    if (this.classList) {
      this.classList.toggle(className);
    } else {
      classes = this.className.split(' ');
      existingIndex = classes.indexOf(className);

      if (existingIndex >= 0) {
        classes.splice(existingIndex, 1);
      } else {
        classes.push(className);
      }

      this.className = classes.join(' ');
    }
  }

  function trigger(eventName, data) {
    var event;
    if (window.CustomEvent) {
      event = new CustomEvent(eventName, data);
    } else {
      event = document.createEvent(eventName);
      event.initCustomEvent(eventName, true, true, data);
    }

    this.dispatchEvent(event);
  }

  function hide() {
    this.style.display = 'none';
  }
  function show() {
    this.style.display = 'block';
  }

  document.addEventListener('DOMContentLoaded', function(event) {

    var Uno;

    return window.Uno = Uno = {

      version: '2.5.7',
      search: {
        container: function() {
          return $('#results');
        },
        form: function(action) {
          return $('#search-container')[action]();
        }
      },
      loadingBar: function(action) {
        return $('.pace')[action]();
      },
      context: function() {
        var className;
        className = document.body.className.split(' ')[0].split('-')[0];
        if (className === '') {
          return 'error';
        } else {
          return className;
        }
      },

      app: (function() {
        return document.body;
      })(),

      is: function(property, value) {
        return this.app.dataset[property] === value;
      },

      readTime: function() {
        var DateInDays;
        DateInDays = function(selector, cb) {

          return Array.prototype.forEach.call($(selector), function() {

            var postDate, postDateInDays, postDateNow, element;

            element = $(this);
            postDate = element.innerHTML;
            postDateNow = new Date(Date.now());
            postDateInDays = Math.floor((postDateNow - new Date(postDate)) / 86400000);

            if (postDateInDays === 0) {

              postDateInDays = 'today';
            } else if (postDateInDays === 1) {

              postDateInDays = "yesterday";
            } else {

              postDateInDays = postDateInDays + " days ago";
            }

            element.innerHTML(postDateInDays);

            element.addEventListener('mouseover', function() {
              return element.innerHTML(postDate);
            });

            return element.addEventListener('mouseout', function() {
              return element.innerHTML(postDateInDays);
            });
          });
        };
        return DateInDays('.post.meta > time');
      },

      device: function() {
        var h, w;
        w = window.innerWidth;
        h = window.innerHeight;
        if (w <= 480) {
          return 'mobile';
        }
        if (w <= 1024) {
          return 'tablet';
        }
        return 'desktop';
      }
    };

    var _animate, _expand, isOpen;
    isOpen = location.hash === '#open';

    _animate = function() {
      return setTimeout(function() {
        return $('.cover').addClass('animated');
      }, 1000);
    };

    _expand = function(options) {
      $('main, .cover, .links > li, html').addClass('expanded');
      return Uno.search.form(options.form);
    };

    document.querySelectorAll('#menu-button').addEventListener('click', function() {
      return $('.cover, main, #menu-button, html').toggleClass('expanded');
    });

    $('.nav-blog > a, #avatar-link').addEventListener('click', function(event) {
      if (Uno.is('page', 'home')) {
        event.preventDefault();
        location.hash = location.hash === '' ? '#open' : '';
        if (!Uno.is('device', 'desktop')) {
          return $('#menu-button').trigger('click');
        }
        return _expand({
          form: 'toggle'
        });
      }
    });

    if (Uno.is('page', 'home')) {
      _animate();
      if (!isOpen) {
        return _expand({
          form: 'hide'
        });
      }
    }

    var el;
    el = Uno.app;
    el.dataset.page = Uno.context();
    el.dataset.device = Uno.device();
    Uno.readTime();
    if (!Uno.is('device', 'desktop')) {
      FastClick.attach(el);
    }
    if (window.profile_title) {
      $('#profile-title').textContent = window.profile_title;
    }
    if (window.profile_resume) {
      $('#profile-resume').textContent = window.profile_resume;
    }
    if (Uno.is('device', 'desktop')) {
      $('a, :not([href*="mailto:"])').addEventListener('click', function() {
        if (this.href.indexOf(location.hostname) === -1) {
          window.open($(this).getAttribute('href'));
          return false;
        }
      });
    }
    if (Uno.is('page', 'post')) {
      window.readingTime('main', {
        readingTimeTarget: '.post.reading-time > span'
      });
    }
    if (Uno.is('page', 'error')) {
      return $('#panic-button').addEventListener('click', function() {
        var s;
        s = document.createElement('script');
        s.setAttribute('src', 'https://nthitz.github.io/turndownforwhatjs/tdfw.js');
        return document.body.appendChild(s);
      });
    }

    var hideSearch, showSearch, content = $('.content');
    showSearch = function() {
      content.hide();
      return $('#search-results').addClass('active');
    };
    hideSearch = function() {
      content.show();
      return $('#search-results').removeClass('active');
    };
    return $("#search-field").ghostHunter({
      results: "#search-results",
      zeroResultsInfo: false,
      onKeyUp: true,
      displaySearchInfo: true,
      result_template: "<a class=\"result\" href='{{link}}'>\n  <h2>{{title}}</h2>\n  <h4>{{pubDate}}</h4>\n</a>",
      onComplete: function(query) {
        if (query.length > 0) {
          return showSearch();
        } else {
          return hideSearch();
        }
      }
    });

  });

}).call(this);
