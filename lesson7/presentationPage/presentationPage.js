var presentationPage = {
    pageDOM: null,
    template: null,
    slides: [],
    slideNative: {w: 0, h: 0},
    currentSlide: 0,

	onPageLoad: function () {
		console.log('presentations');
	},

    init: function () {
        this.pageDOM = document.querySelector('#presentation.page');
        this.template = Handlebars.compile(document.querySelector('#slides-template').innerHTML);
        this.bindUIActions();
    },

    onPageLoad: function (params) {
        if(params.eventid === undefined) {
            router.navigate('events');
        }
        user.setCurrentEventId(params.eventid);
        connection.requestPresentation(params.eventid);
        utils.setHeader('Presentation');
    },

    slide: function (e) {
        var present = this.pageDOM.querySelector('.slide.present');
        var future = present.nextElementSibling;
        var past = present.previousElementSibling;
        var slides = this.pageDOM.querySelectorAll('.slide');
        for(var i = slides.length; --i >= 0;) {
                slides[i].classList.remove('present', 'past', 'future');
            if(i === this.currentSlide) {
                slides[i].classList.add('present');
            } else if (i < this.currentSlide) {
                slides[i].classList.add('past');
            } else {
                slides[i].classList.add('future');
            }
        }
    },

    onPresentationDataReceived: function (presentationData) {
        if(!presentationData) { return; }
        this.currentSlide = presentationData.currentSlide;
        this.slides = [];
        var img = null;
        var total = presentationData.slides.length;
        var self = this;
        var path = user.getSystemSettings().presentationsLocation + '/' + user.getCurrentEventId() + '/';
        for(var i = 0; i < presentationData.slides.length; i++) {
            img = new Image();
            img.onload = function () {
                total--;
                if(total === 0) {
                    self.slideNative.w = this.width;
                    self.slideNative.h = this.height;
                    self.slideNative.ratio = this.width / this.height;
                    self.buildSlides();
                }
            };
            img.src = path + presentationData.slides[i];
            this.slides.push({
                img: img
            });
        }
    },

    buildSlides: function () {
        var html = '';
        for(var i = 0; i < this.slides.length; i++) {
            html += this.template({
                order: i < this.currentSlide ? 'past': i > this.currentSlide ? 'future' : 'present',
                src: this.slides[i].img.src
            });
        }
        var slider = this.pageDOM.querySelector('.slider');
        slider.style.maxHeight = this.slideNative.h + 'px';
        slider.innerHTML = '';
        slider.insertAdjacentHTML('afterbegin', html);
        this.resizeHandler();
    },

    resizeHandler: function () {
        var slider = this.pageDOM.querySelector('.slider');
        var currentWidth = this.pageDOM.getBoundingClientRect().width;
        var currentHeight = this.pageDOM.getBoundingClientRect().height;
        var newWidth = Math.round(currentHeight * this.slideNative.ratio);
        var newHeight = Math.round(currentWidth / this.slideNative.ratio);
        var currentRatio = currentWidth / currentHeight;

        if(currentRatio > this.slideNative.ratio) {
            if(currentWidth < currentHeight) {
                slider.style.width = newWidth + 'px';
            }
            slider.style.height = '100%';
        } else {
            slider.style.width = '100%';
            if(currentWidth < this.slideNative.w) {
                slider.style.height = newHeight + 'px';
            } else {
                slider.style.height = '100%';
            }
        }

        slider.style.top = ((currentHeight * .5 - slider.getBoundingClientRect().height * .5) | 0) + 'px';
    },

    handleRemoteSlide: function (data) {
        if(user.getCurrentEventId() !== data.eventId) { return; }
        this.currentSlide = data.slideNumber;
        this.slide();
    },

    bindUIActions: function () {
        this.pageDOM.querySelector('.slide-btn.left').addEventListener(system.touchEvent, function (e) {
            if(presentationPage.currentSlide === 0) { return; }
            presentationPage.currentSlide--;
            presentationPage.slide(e, false);
            connection.sendCurrentSlide(presentationPage.currentSlide, user.getCurrentEventId());
        });
        this.pageDOM.querySelector('.slide-btn.right').addEventListener(system.touchEvent, function (e) {
            if(presentationPage.currentSlide === presentationPage.slides.length - 1) { return; }
            presentationPage.currentSlide++;
            presentationPage.slide(e, true);
            connection.sendCurrentSlide(presentationPage.currentSlide, user.getCurrentEventId());
        });
    }
};