var eventsPage = {
    template: null,
    eventsDOM: null,
    eventsList: null,

    init: function () {
        /*
         * @desc: in order to generate same html structures with variable content we use templating.
         *        Below we're using Handlebars library to create a template for event on our page.
         *        Handlebars accepts the html of template as an input and returns a template function.
         *        Then when we need an html for event with let's say name = "Event1", room = "room1", time ="20:30"
         *        passing those data to template function will get us an HTML string with our variables inside.
         *        Template itself is not used anywhere here but it will be in the future lessons.
         *        See more details on library page: http://handlebarsjs.com
         */
        this.template = Handlebars.compile(document.querySelector('#event-template').innerHTML);
        this.eventsDOM = document.querySelector('#events.page');
        this.eventsList = this.eventsDOM.querySelectorAll('.event');
        this.bindUIActions();
    },

    onPageLoad: function () {
        console.log('events');
    },

    _onSearch: function (e) {
        var regex = RegExp(e.currentTarget.value, 'i');
        for(var i = this.eventsList.length; --i >= 0;) {
            if(this.eventsList[i].dataset.name.match(regex)) {
                this.eventsList[i].classList.remove('hidden');
            } else {
                this.eventsList[i].classList.add('hidden');
            }
        }
    },

    bindUIActions: function () {
        var inputSearch = this.eventsDOM.querySelector('input');
        inputSearch.addEventListener('input', this._onSearch.bind(this));
    }
};