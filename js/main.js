/* ============================================
   JOE COL JOE — Main JavaScript
   GSAP + ScrollTrigger + Swiper + Interactions
   ============================================ */

(function () {
  'use strict';

  /* ---------- LOADER ---------- */
  window.addEventListener('load', function () {
    var loader = document.getElementById('loader');
    setTimeout(function () {
      loader.classList.add('is-hidden');
      initAnimations();
    }, 2200);
  });

  /* ---------- CUSTOM CURSOR ---------- */
  var dot = document.getElementById('cursorDot');
  var outline = document.getElementById('cursorOutline');

  if (window.matchMedia('(pointer: fine)').matches && dot && outline) {
    var mouseX = 0, mouseY = 0;
    var outlineX = 0, outlineY = 0;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    function animateOutline() {
      outlineX += (mouseX - outlineX) * 0.12;
      outlineY += (mouseY - outlineY) * 0.12;
      outline.style.left = outlineX + 'px';
      outline.style.top = outlineY + 'px';
      requestAnimationFrame(animateOutline);
    }
    animateOutline();

    // Enlarge on interactive elements
    document.querySelectorAll('a, button, .swiper-button-prev, .swiper-button-next').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        outline.style.width = '50px';
        outline.style.height = '50px';
        outline.style.borderColor = 'rgba(192,57,43,0.8)';
      });
      el.addEventListener('mouseleave', function () {
        outline.style.width = '36px';
        outline.style.height = '36px';
        outline.style.borderColor = 'rgba(192,57,43,0.5)';
      });
    });
  }

  /* ---------- FLASHLIGHT / SPOTLIGHT BACKGROUND ---------- */
  var bgOverlay = document.getElementById('bgOverlay');

  if (bgOverlay && window.matchMedia('(pointer: fine)').matches) {
    var spotX = 0, spotY = 0;
    var currentX = 0, currentY = 0;
    // ~40% of viewport width
    var spotRadius = Math.round(window.innerWidth * 0.38);

    window.addEventListener('resize', function () {
      spotRadius = Math.round(window.innerWidth * 0.38);
    });

    document.addEventListener('mousemove', function (e) {
      spotX = e.pageX;
      spotY = e.pageY;
    });

    function animateSpotlight() {
      currentX += (spotX - currentX) * 0.12;
      currentY += (spotY - currentY) * 0.12;

      bgOverlay.style.background =
        'radial-gradient(circle ' + spotRadius + 'px at ' + currentX + 'px ' + currentY + 'px, ' +
        'transparent 0%, ' +
        'rgba(0,0,0,0.15) 35%, ' +
        'rgba(0,0,0,0.5) 55%, ' +
        'rgba(0,0,0,0.82) 75%, ' +
        'rgba(0,0,0,0.92) 100%)';

      requestAnimationFrame(animateSpotlight);
    }
    animateSpotlight();
  }

  /* ---------- MOSAIC HEIGHT: fill entire page ---------- */
  var bgMosaic = document.getElementById('bgMosaic');
  var mosaicGrid = bgMosaic ? bgMosaic.querySelector('.bg-mosaic__grid') : null;

  function fillMosaic() {
    if (!bgMosaic || !mosaicGrid) return;
    var pageHeight = document.documentElement.scrollHeight;
    bgMosaic.style.height = pageHeight + 'px';
    // Clone tiles to fill the full page height
    var originalTiles = Array.from(mosaicGrid.querySelectorAll('.bg-tile:not(.bg-tile--clone)'));
    // Remove old clones
    mosaicGrid.querySelectorAll('.bg-tile--clone').forEach(function (c) { c.remove(); });
    var gridHeight = mosaicGrid.scrollHeight;
    while (gridHeight < pageHeight + 400) {
      originalTiles.forEach(function (tile) {
        var clone = tile.cloneNode(true);
        clone.classList.add('bg-tile--clone');
        mosaicGrid.appendChild(clone);
      });
      gridHeight = mosaicGrid.scrollHeight;
    }
  }

  window.addEventListener('load', function () { setTimeout(fillMosaic, 100); });
  window.addEventListener('resize', fillMosaic);

  /* ---------- HEADER SCROLL ---------- */
  var header = document.getElementById('header');
  var scrollThreshold = 50;

  window.addEventListener('scroll', function () {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  });

  /* ---------- HAMBURGER MENU ---------- */
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('is-active');
    mobileMenu.classList.toggle('is-open');
    document.body.style.overflow = mobileMenu.classList.contains('is-open') ? 'hidden' : '';
  });

  // Close on link click
  mobileMenu.querySelectorAll('.mobile-menu__link').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('is-active');
      mobileMenu.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });

  /* ---------- HERO SWIPER — 35mm film carousel ---------- */
  var totalSlides = document.querySelectorAll('.hero__swiper .swiper-slide').length;
  var heroSwiper = new Swiper('.hero__swiper', {
    loop: true,
    loopedSlides: totalSlides,
    initialSlide: 0,
    autoplay: {
      delay: 4500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    },
    speed: 800,
    centeredSlides: true,
    slidesPerView: 1.4,
    spaceBetween: 10,
    grabCursor: true,
    watchSlidesProgress: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    breakpoints: {
      600: {
        slidesPerView: 1.8,
        spaceBetween: 12
      },
      900: {
        slidesPerView: 2.6,
        spaceBetween: 14
      },
      1200: {
        slidesPerView: 3,
        spaceBetween: 16
      }
    }
  });

  /* ---------- DEFERRED YOUTUBE VIDEO ---------- */
  var videoPoster = document.getElementById('videoPoster');
  var videoPlayer = document.getElementById('videoPlayer');

  if (videoPoster && videoPlayer) {
    videoPoster.addEventListener('click', function () {
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/-fVkHK3H4ZI?autoplay=1&rel=0';
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('title', 'No Way Out - Joe Col Joe');
      videoPlayer.innerHTML = '';
      videoPlayer.appendChild(iframe);
    });
  }

  /* ---------- SMOOTH SCROLL ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 80;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ---------- GSAP ANIMATIONS ---------- */
  function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Fade-up elements
    document.querySelectorAll('[data-animate="fade-up"]').forEach(function (el) {
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true
          }
        }
      );
    });

    // Section titles
    document.querySelectorAll('.section-title').forEach(function (el) {
      gsap.fromTo(el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true
          }
        }
      );
    });

    // Quote clip-path reveal
    document.querySelectorAll('[data-animate="clip"]').forEach(function (el) {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 75%',
        once: true,
        onEnter: function () {
          el.classList.add('is-revealed');
          var author = el.parentElement.querySelector('.quote-section__author');
          if (author) author.classList.add('is-revealed');
        }
      });
    });

    // News cards stagger
    var newsCards = document.querySelectorAll('.news__card');
    if (newsCards.length) {
      gsap.fromTo(newsCards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.news__grid',
            start: 'top 80%',
            once: true
          }
        }
      );
    }

    // Shop cards stagger
    var shopCards = document.querySelectorAll('.shop__card');
    if (shopCards.length) {
      gsap.fromTo(shopCards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.shop__grid',
            start: 'top 80%',
            once: true
          }
        }
      );
    }

    // Concert items stagger
    var concertItems = document.querySelectorAll('.concerts__item');
    if (concertItems.length) {
      gsap.fromTo(concertItems,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.concerts__list',
            start: 'top 80%',
            once: true
          }
        }
      );
    }

    // Hero slide content animation
    heroSwiper.on('slideChangeTransitionStart', function () {
      var activeSlide = heroSwiper.slides[heroSwiper.activeIndex];
      if (!activeSlide) return;
      var content = activeSlide.querySelector('.hero__slide-content');
      if (content) {
        gsap.fromTo(content.children,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
        );
      }
    });

    // Parallax background glow
    gsap.to('body::before', {
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true
      }
    });

    // Newsletter section
    var newsletter = document.querySelector('.newsletter');
    if (newsletter) {
      gsap.fromTo(newsletter.querySelectorAll('.newsletter__title, .newsletter__text, .newsletter__form'),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: newsletter,
            start: 'top 80%',
            once: true
          }
        }
      );
    }

    // Featured video
    var videoWrapper = document.querySelector('.featured-video__wrapper');
    if (videoWrapper) {
      gsap.fromTo(videoWrapper,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: videoWrapper,
            start: 'top 80%',
            once: true
          }
        }
      );
    }
  }

})();
