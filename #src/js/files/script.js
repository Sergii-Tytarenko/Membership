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
