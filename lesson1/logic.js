var COLOR = [];

function slide (forward) {
	var present = document.querySelector('.slide.present');
	var past = present.previousElementSibling;
	var future = present.nextElementSibling;

	if(forward) {
		if(future) {
			present.classList.remove('present');
			present.classList.add('past');
			future.classList.remove('future');
			future.classList.add('present');
		}
	} else {
		if(past) {
			present.classList.remove('present');
			present.classList.add('future');
			past.classList.remove('past');
			past.classList.add('present');
		}
	}
}

function generateSlides () {
	var html = '';
	var time = '';
	for(var i = 20; --i >= 0;) {
		if(i === 0) {
			time = 'present';
		} else {
			time = 'past';
		}
		html += '<div class="slide '+ time +'">'+ i +'</div>';
	}
	var slider = document.querySelector('.slider');
	slider.innerHTML = '';
	slider.insertAdjacentHTML('afterbegin', html);
}

function bindUIActions () {
	document.querySelector('.btn.prev').addEventListener('click', function () {
		slide(false);
	});

	document.querySelector('.btn.next').addEventListener('click', function () {
		slide(true);
	});

	window.addEventListener('keydown', function (e) {
		console.log(e.which);
		if(e.which === 39) {
			slide(true);
		} else if (e.which === 37) {
			slide(false);
		}
	});
}

window.onload = function () {
	console.log('hello');
	generateSlides();
	bindUIActions();
}