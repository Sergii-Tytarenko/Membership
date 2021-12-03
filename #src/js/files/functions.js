/* Webp images
-----------------------------------------------------------------------------*/
function testWebP(callback) {
	var webP = new Image();
	webP.onload = webP.onerror = function () {
		callback(webP.height == 2);
	};
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}
testWebP(function (support) {
	if (support == true) {
		document.querySelector('body').classList.add('_webp');
	} else {
		document.querySelector('body').classList.add('_no-webp');
	}
});


/* SlideToggle
-----------------------------------------------------------------------------*/
let _slideUp = (target, duration = 500) => {
	target.style.transitionProperty = 'height, margin, padding';
	target.style.transitionDuration = duration + 'ms';
	target.style.height = target.offsetHeight + 'px';
	target.offsetHeight;
	target.style.overflow = 'hidden';
	target.style.height = 0;
	target.style.paddingTop = 0;
	target.style.paddingBottom = 0;
	target.style.marginTop = 0;
	target.style.marginBottom = 0;
	window.setTimeout(() => {
		target.style.display = 'none';
		target.style.removeProperty('height');
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		target.style.removeProperty('overflow');
		target.style.removeProperty('transition-duration');
		target.style.removeProperty('transition-property');
		target.classList.remove('_slide');
	}, duration);
}

let _slideDown = (target, duration = 500) => {
	target.style.removeProperty('display');
	let display = window.getComputedStyle(target).display;
	if (display === 'none')
		display = 'block';

	target.style.display = display;
	let height = target.offsetHeight;
	target.style.overflow = 'hidden';
	target.style.height = 0;
	target.style.paddingTop = 0;
	target.style.paddingBottom = 0;
	target.style.marginTop = 0;
	target.style.marginBottom = 0;
	target.offsetHeight;
	target.style.transitionProperty = "height, margin, padding";
	target.style.transitionDuration = duration + 'ms';
	target.style.height = height + 'px';
	target.style.removeProperty('padding-top');
	target.style.removeProperty('padding-bottom');
	target.style.removeProperty('margin-top');
	target.style.removeProperty('margin-bottom');
	window.setTimeout(() => {
		target.style.removeProperty('height');
		target.style.removeProperty('overflow');
		target.style.removeProperty('transition-duration');
		target.style.removeProperty('transition-property');
		target.classList.remove('_slide');
	}, duration);
}

let _slideToggle = (target, duration = 500) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		if (window.getComputedStyle(target).display === 'none') {
			return _slideDown(target, duration);
		} else {
			return _slideUp(target, duration);
		}
	}
}


/* Spollers
-----------------------------------------------------------------------------*/
let spollers = document.querySelectorAll("._spoller");
let spollersGo = true;

function spollerInit () {
	if (spollers.length > 0) {
		for (let index = 0; index < spollers.length; index++) {
			const spoller = spollers[index];
			spoller.addEventListener("click", function (e) {
				if (spollersGo) {
					spollersGo = false;
					if (spoller.classList.contains('_spoller-530') && window.innerWidth > 530) {
						return false;
					}

					spoller.classList.toggle('_active');
					_slideToggle(spoller.nextElementSibling);

					setTimeout(function () {
						spollersGo = true;
					}, 500);
				}
			});

			if (window.innerWidth > 530) {
				spoller.classList.remove('_active');
				spoller.nextElementSibling.style.display = 'block';
			} else if (window.innerWidth < 530 && spoller.classList.contains('_active')) {
				spoller.nextElementSibling.style.display = 'block';
			} else {
				spoller.nextElementSibling.style.display = '';
			}

		}
	}
}

spollerInit ();

window.addEventListener('resize', () => {
	spollerInit ();
	spollersGo = true;
});

/* BodyLock
-----------------------------------------------------------------------------*/
let  unlock = true;

function body_lock(delay) {
    let body = document.querySelector("body");
    if (body.classList.contains("_lock")) {
      body_lock_remove(delay);
    } else {
      body_lock_add(delay);
    }
  }
  function body_lock_remove(delay) {
    let body = document.querySelector("body");
    if (unlock) {
      let lock_padding = document.querySelectorAll("._lp");
      setTimeout(() => {
        for (let index = 0; index < lock_padding.length; index++) {
          const el = lock_padding[index];
          el.style.paddingRight = "0px";
        }
        body.style.paddingRight = "0px";
        body.classList.remove("_lock");
      }, delay);
  
      unlock = false;
      setTimeout(function () {
        unlock = true;
      }, delay);
    }
  }
  function body_lock_add(delay) {
    let body = document.querySelector("body");
    if (unlock) {
      let lock_padding = document.querySelectorAll("._lp");
      for (let index = 0; index < lock_padding.length; index++) {
        const el = lock_padding[index];
        el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
      }
      body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
      body.classList.add("_lock");
  
      unlock = false;
      setTimeout(function () {
        unlock = true;
      }, delay);
    }
  }