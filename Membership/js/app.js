// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),when(breakpoint),position(digi),type (min, max)"
// e.x. data-da="item,767,last,max"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle

class DynamicAdapt {
	// массив объектов
	elementsArray = [];
	daClassname = '_dynamic_adapt_';

	constructor(type) {
		this.type = type;
	}

	init() {
		// массив DOM-элементов
		this.elements = [...document.querySelectorAll('[data-da]')];

		// наполнение elementsArray объктами
		this.elements.forEach((element) => {
			const data = element.dataset.da.trim();
			if (data !== '') {
				const dataArray = data.split(',');

				const oElement = {};
				oElement.element = element;
				oElement.parent = element.parentNode;
				oElement.destination = document.querySelector(`.${dataArray[0].trim()}`);
				oElement.breakpoint = dataArray[1] ? dataArray[1].trim() : '767';
				oElement.place = dataArray[2] ? dataArray[2].trim() : 'last';

				oElement.index = this.indexInParent(
					oElement.parent, oElement.element,
				);

				this.elementsArray.push(oElement);
			}
		});

		this.arraySort(this.elementsArray);

		// массив уникальных медиа-запросов
		this.mediaArray = this.elementsArray
			.map(({ breakpoint }) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)
			.filter((item, index, self) => self.indexOf(item) === index);

		// навешивание слушателя на медиа-запрос
		// и вызов обработчика при первом запуске
		this.mediaArray.forEach((media) => {
			const mediaSplit = media.split(',');
			const mediaQuerie = window.matchMedia(mediaSplit[0]);
			const mediaBreakpoint = mediaSplit[1];

			// массив объектов с подходящим брейкпоинтом
			const elementsFilter = this.elementsArray.filter(
				({ breakpoint }) => breakpoint === mediaBreakpoint
			);
			mediaQuerie.addEventListener('change', () => {
				this.mediaHandler(mediaQuerie, elementsFilter);
			});
			this.mediaHandler(mediaQuerie, elementsFilter);
		});
	}

	// Основная функция
	mediaHandler(mediaQuerie, elementsFilter) {
		if (mediaQuerie.matches) {
			elementsFilter.forEach((oElement) => {
				// получение индекса внутри родителя
				oElement.index = this.indexInParent(
					oElement.parent, oElement.element,
				);
				this.moveTo(oElement.place, oElement.element, oElement.destination);
			});
		} else {
			elementsFilter.forEach(({ parent, element, index }) => {
				if (element.classList.contains(this.daClassname)) {
					this.moveBack(parent, element, index);
				}
			});
		}
	}

	// Функция перемещения
	moveTo(place, element, destination) {
		element.classList.add(this.daClassname);
		if (place === 'last' || place >= destination.children.length) {
			destination.append(element);
			return;
		}
		if (place === 'first') {
			destination.prepend(element);
			return;
		}
		destination.children[place].before(element);
	}

	// Функция возврата
	moveBack(parent, element, index) {
		element.classList.remove(this.daClassname);
		if (parent.children[index] !== undefined) {
			parent.children[index].before(element);
		} else {
			parent.append(element);
		}
	}

	// Функция получения индекса внутри родителя
	indexInParent(parent, element) {
		return [...parent.children].indexOf(element);
	}

	// Функция сортировки массива по breakpoint и place 
	// по возрастанию для this.type = min
	// по убыванию для this.type = max
	arraySort(arr) {
		if (this.type === 'min') {
			arr.sort((a, b) => {
				if (a.breakpoint === b.breakpoint) {
					if (a.place === b.place) {
						return 0;
					}
					if (a.place === 'first' || b.place === 'last') {
						return -1;
					}
					if (a.place === 'last' || b.place === 'first') {
						return 1;
					}
					return a.place - b.place;
				}
				return a.breakpoint - b.breakpoint;
			});
		} else {
			arr.sort((a, b) => {
				if (a.breakpoint === b.breakpoint) {
					if (a.place === b.place) {
						return 0;
					}
					if (a.place === 'first' || b.place === 'last') {
						return 1;
					}
					if (a.place === 'last' || b.place === 'first') {
						return -1;
					}
					return b.place - a.place;
				}
				return b.breakpoint - a.breakpoint;
			});
			return;
		}
	}
}

const da = new DynamicAdapt('max');
da.init();;
/* Smoth scroll
-----------------------------------------------------------------------------*/
const smoothLinks = document.querySelectorAll('._smooth');

for (let smoothLink of smoothLinks) {
    smoothLink.addEventListener('click', function (e) {
        e.preventDefault();
        const id = smoothLink.getAttribute('href');

        document.querySelector(id).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
};

const body = document.querySelector('body');
let introWrap = document.querySelector('.intro__wrap');
const mainHeader = document.querySelector('.main-header');
const burger = document.querySelector('.burger');
let burgerNav = document.querySelector('.burger-nav');
const closeNav = document.querySelector('.burger-nav__close');

/* Intro parallax
-----------------------------------------------------------------------------*/
function parallax () {
    let moveHeight =  window.pageYOffset;
    let movePosition = moveHeight * .25;

    if (movePosition >= 0 && movePosition <= 250) {
        if (window.innerWidth > 767) {
            introWrap.style.transform = `translateY(-${movePosition}px)`;
        };
        mainHeader.style.transform = `translateY(-${movePosition}px)`;
    }
}

if (introWrap) {
    window.addEventListener('scroll', parallax);
}


/* Main Header show
-----------------------------------------------------------------------------*/ 
window.addEventListener('scroll', headScroll);

function headScroll() {
    let src_value = pageYOffset;
   
    if (mainHeader) {
        if (src_value > 250) {
            mainHeader.classList.add('scroll');
		} else {
			mainHeader.classList.remove('scroll');
		}
    }
}


/* Burger active
   Show burger nav
-----------------------------------------------------------------------------*/
burger.addEventListener('click', function () {
    if (burger) {
        burger.classList.toggle('active');
    }
    if ( burger.classList.contains('active') ) {
        showBurgerNav ();
    } else {
        closeBurgerNav ();
    }
});

closeNav.addEventListener('click', function(){
    closeBurgerNav ();
});


/* Close menu when links is active
-----------------------------------------------------------------------------*/
let burgerNavLink = burgerNav.querySelectorAll("a");

for (let i = 0; i < burgerNavLink.length; i++) {
	 let navLink = burgerNavLink[i];

	navLink.addEventListener("click", function() {
        closeBurgerNav ();
	});
}

document.addEventListener("click", function (e) {
    if ( (e.target.classList.contains('nav-header__link') 
        || e.target.classList.contains('main-header__container') ) 
        && burgerNav.classList.contains('active')) {
        closeBurgerNav ();
    }
});


/* Functions of burger nav
-----------------------------------------------------------------------------*/
function showBurgerNav () {
    burgerNav.classList.add('active');
    mainHeader.classList.add('active');
    body_lock(0);
}

function closeBurgerNav () {
    burger.classList.remove('active');
    burgerNav.classList.remove('active');
    mainHeader.classList.remove('active');
    if (!overlay.classList.contains('modal-show')) {
        body_lock(0);
    }
}


/* Counter sliders
-----------------------------------------------------------------------------*/
const counterSliders = document.querySelectorAll('.counter__body');

counterSliders.forEach(el => {
    let mySwiper;
    function mobileSlider() {
        if (window.innerWidth <= 1024 && el.dataset.mobile == 'false') {
            mySwiper = new Swiper(el, {
                slidesPerView: 1,
                observer: true,
                observeParents: true,
                pagination: {
                    el: '.counter__pagination',
                    type: 'bullets',
                },
                breakpoints: {
                    530: {
                        slidesPerView: 1.7,
                      },
                    850: {
                      slidesPerView: 2.5,
                    }
                  }
            });
    
            el.dataset.mobile = 'true';
        }
    
        if (window.innerWidth > 1024) {
            el.dataset.mobile = 'false';
            if (el.classList.contains('swiper-container-initialized')) {
                mySwiper.destroy();
                
            }
        }
    }
    
    mobileSlider()
    
    window.addEventListener('resize', () => {
        mobileSlider();
    });
      
});


/* Partners sliders 
-----------------------------------------------------------------------------*/
const partnersLabels = new Swiper('.partners__icons', {
    slidesPerView: 5,
    initialSlide: 3,
    centeredSlides: true,
    observer: true,
    observeParents: true,
    spaceBetween: 40,
    slideClass: 'icon-partners__slide',
    wrapperClass: 'icon-partners__list',
    autoplay: {
        delay: 2000,
        disableOnInteraction: true,
    },
    loop: true,
    speed: 1500,
    breakpoints: {
        // when window width is >= 320px
        320: {
            slidesPerView: 1.8,
            spaceBetween: 10
        },
        // when window width is >= 420px
        420: {
            slidesPerView: 2.5,
            spaceBetween: 20
        },
        // when window width is >= 575px
        575: {
            slidesPerView: 3.8,
            // spaceBetween: 30
        },
        // when window width is >= 768px
        920: {
            slidesPerView: 5,
            spaceBetween: 80
        }
      }
});


const partnersComment = new Swiper('.partners__main', {
    slidesPerView: 1,
    observer: true,
    observeParents: true,
    spaceBetween: 20,
    autoHeight: true,
    wrapperClass: 'main-slider__list',
    slideClass: 'main-slider__slide',
    navigation: {
        nextEl: '.partners__button-next',
        prevEl: '.partners__button-perv',
    }
});


/* Modal Windows
-----------------------------------------------------------------------------*/
let modalLinks = document.querySelectorAll('.modal-link');
const overlay = document.querySelector('.overlay');

if (modalLinks.length > 0) {
    for (let i = 0; i < modalLinks.length; i++) {
        let modalLink = modalLinks[i];

        modalLink.addEventListener('click', () => {
            let linkTarget = modalLink.dataset.modal;
            let modalWindow = document.querySelector(`${linkTarget}`);

            modalActive(modalWindow);
        });
        
    }
}

function modalActive (target) {
    if (target) {
        modalShow (target);

        let closeBtn = target.querySelector('.modal__close');

        closeBtn.addEventListener('click', () => {
            modalClose (target);
        });

        overlay.addEventListener('click', () => {
            modalClose (target);
        });

        document.addEventListener('keydown', function (e) {
            if (e.code === 'Escape') {
                modalClose (target);
            }
        });
    }
}

function modalShow (target) {
    target.classList.add('modal-show');
    overlay.classList.add('modal-show');
    if (burgerNav.classList.contains('active')) {
        closeBurgerNav ();
    } else {
        body_lock(0);
    }
}

function modalClose (target) {
    target.classList.remove('modal-show');
    overlay.classList.remove('modal-show');
    body_lock(0);
}



/* Scroll animation
-----------------------------------------------------------------------------*/
let animBlocks = document.querySelectorAll('.anim-block');

if (animBlocks.length > 0) {
    window.addEventListener('scroll', animOnScroll);

    function animOnScroll() {
        for (animBlock of animBlocks) {
            let animBlcokHeight = animBlock.offsetHeight;
            let anaimBlockPosition = offset(animBlock).top;
            let animBlcokStart = 2;

            let animBlockPoint = window.innerHeight - animBlcokHeight / animBlcokStart;

            if (animBlcokHeight > window.innerHeight) {
                animBlcolPoint = window.innerHeight - window.innerHeight / animBlcokStart;
            }

            if ((pageYOffset > anaimBlockPosition - animBlockPoint) && pageYOffset < (anaimBlockPosition + animBlcokHeight)) {
                animBlock.classList.add('active');
            } else if (!animBlock.classList.contains('anim-no-hide')) {
                animBlock.classList.remove('active');
            }
        }
    };

    function offset(el) {
        let rect = el.getBoundingClientRect(),
            scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
    }
    
    
    setTimeout(() => {
        animOnScroll();
    }, 400);
}


/* Play button
---------------------------------------------------------------*/
const videoBtn = document.querySelector('.projects__play-btn'),
      video = document.querySelector('.projects__movie');
      
if (video) {
    videoBtn.addEventListener('click', () => {
        video.classList.add('active');
        video.play();
        video.controls = 'true';
    });
    
    video.addEventListener('ended', () => {
        video.classList.remove('active');
        video.controls = '';
    });
}
;
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
};