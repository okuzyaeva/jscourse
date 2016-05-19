var eventsPage = {
    template: null,
    pageDOM: null,
    eventsList: null,
    eventsData: null,

    init: function () {
        /*
         * @desc: in order to generate same html structures with variable content we use templating.
         *        Below we're using Handlebars library to create a template for event on our page.
         *        Handlebars accepts the html of template as an input and returns a template function.
         *        HTML of the template itself is written in index.html file as a script with id="event-template".
         *        Then when we need an html for event with let's say name = "Event1", room = "room1", time ="20:30"
         *        passing those data to template function will get us an HTML string with our variables inside.
         *        Template itself is not used anywhere here but it will be in the future lessons.
         *        See more details on library page: http://handlebarsjs.com
         */
        this.template = Handlebars.compile(document.querySelector('#event-template').innerHTML);
        this.pageDOM = document.querySelector('#events.page');
        this.eventsList = this.pageDOM.querySelectorAll('.event');
        this.bindUIActions();
    },

    onPageLoad: function () {
        console.log('events');
        connection.requestEvents(); // only asks server for data nothing more
        utils.setHeader('Events');
    },

    _onSearch: function (e) {
        if(this.eventsList === null) { return; }
        var regex = RegExp(e.currentTarget.value, 'i');
        /*
         * @desc: Note how search below works.
         *        this.eventsList[i].dataset.name returns us a string containing name event.
         *        Strings in JavaScript has their own methods so we're using one of them.
         *        Method .match() accepts a regular expression as a parameter and returns
         *        all mathes it can find. Play around with it to get a sense how it works.
         */
        for(var i = this.eventsList.length; --i >= 0;) {
            if(this.eventsList[i].dataset.name.match(regex)) {
                this.eventsList[i].classList.remove('hidden');
            } else {
                this.eventsList[i].classList.add('hidden');
            }
        }
    },

    onIncomingEvents: function (events) {
        // now when server has sent us data because we've requested it onPageLoad, let's display it
        this.eventsData = events; // save events data so we always can rebuild HTML if needed
        this.buildEvents();
    },

    _onEventClick: function (e) {
        eventsPage.openEvent(e.currentTarget.id);
    },

    openEvent: function (id) {
        connection.markMyEvent(id); // say to server that we entered an event
        router.navigate('presentation/' + id);
    },

    removeEvents: function () {
        this._unbindEventsActions();
        this.pageDOM.querySelector('.events-list').innerHTML = '';
        this.eventsList = null;
    },

    buildEvents: function () {
        var html = '';
        for(var i = 0; i < this.eventsData.length; i++) {
            html += this.template(this.eventsData[i]);
        }
        this.removeEvents();
        this.pageDOM.querySelector('.events-list').insertAdjacentHTML('afterbegin', html);
        this.eventsList = this.pageDOM.querySelectorAll('.event');
        this._bindEventsActions();
    },

    _bindEventsActions: function () {
        for(var i = this.eventsList.length; --i >= 0;) {
            this.eventsList[i].addEventListener(system.touchEvent, this._onEventClick);
        }
    },

    _unbindEventsActions: function () {
        if(!this.eventsList) { return; }
        for(var i = this.eventsList.length; --i >= 0;) {
            this.eventsList[i].removeEventListener(system.touchEvent, this._onEventClick);
        }
    },

    bindUIActions: function () {
        this.pageDOM.querySelector('input').addEventListener('input', this._onSearch.bind(this));
    }
};