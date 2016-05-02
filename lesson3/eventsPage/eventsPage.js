var eventsPage = {
    dom: null,
    template: null,
    searchInput: null,
    eventsDom: null,

    init: function () {
        this.template = Handlebars.compile(document.querySelector('#event-template').innerHTML);
        this.dom = document.querySelector('#events.page');
        this.searchInput = this.dom.querySelector('input');
        this.eventsDom = this.dom.querySelectorAll('.event');
    },

	onPageLoad: function () {
        console.log(arguments);
		console.log('events');
        this.bindUIActions();
	},

    _onSearch: function (e) {
        var regexp = new RegExp(e.currentTarget.value, 'i');
        for(var i = this.eventsDom.length; --i >= 0;) {
            if(this.eventsDom[i].dataset.name.match(regexp)) {
                this.eventsDom[i].classList.remove('hidden');
            } else {
                this.eventsDom[i].classList.add('hidden');
            }
        }
    },

    bindUIActions: function () {
        this.searchInput.addEventListener('input', this._onSearch.bind(this));
    }
};