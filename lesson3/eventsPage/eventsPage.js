var eventsPage = {
    template: null,
    eventsDOM: null,
    eventsList: null,

    init: function () {
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