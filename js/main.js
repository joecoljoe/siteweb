/* ============================================
   JOE COL JOE — Main JavaScript
   GSAP + ScrollTrigger + Swiper + Interactions
   ============================================ */

(function () {
  'use strict';

  /* ---------- LOADER — masque quand tout est charge (images incluses)
     Important : sur window.load (pas DOMContentLoaded) pour eviter le CLS
     qui apparait si le Swiper/images se positionnent apres que l'utilisateur
     voit deja la page. ---------- */
  window.addEventListener('load', function () {
    var loader = document.getElementById('loader');
    if (loader) loader.classList.add('is-hidden');
    initAnimations();
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
    // Triple securite pour eviter tout risque de boucle infinie sur mobile
    if (window.innerWidth < 900) return;
    try {
      if (getComputedStyle(bgMosaic).display === 'none') return;
    } catch (e) { return; }

    var pageHeight = document.documentElement.scrollHeight;
    bgMosaic.style.height = pageHeight + 'px';
    var originalTiles = Array.from(mosaicGrid.querySelectorAll('.bg-tile:not(.bg-tile--clone)'));
    mosaicGrid.querySelectorAll('.bg-tile--clone').forEach(function (c) { c.remove(); });

    var gridHeight = mosaicGrid.scrollHeight;
    var safety = 30;
    while (gridHeight < pageHeight + 400 && safety > 0) {
      originalTiles.forEach(function (tile) {
        var clone = tile.cloneNode(true);
        clone.classList.add('bg-tile--clone');
        mosaicGrid.appendChild(clone);
      });
      var newHeight = mosaicGrid.scrollHeight;
      if (newHeight === gridHeight) break;
      gridHeight = newHeight;
      safety--;
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

  /* ---------- LAZY SPOTIFY EMBED (IntersectionObserver) ---------- */
  var spotifyPlayer = document.getElementById('spotifyPlayer');
  if (spotifyPlayer && 'IntersectionObserver' in window) {
    var spotifySrc = spotifyPlayer.getAttribute('data-spotify-src');
    var spotifyLoaded = false;
    var loadSpotify = function () {
      if (spotifyLoaded) return;
      spotifyLoaded = true;
      var iframe = document.createElement('iframe');
      iframe.setAttribute('data-testid', 'embed-iframe');
      iframe.setAttribute('src', spotifySrc);
      iframe.setAttribute('width', '100%');
      iframe.setAttribute('height', '352');
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('allow', 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture');
      iframe.setAttribute('loading', 'lazy');
      iframe.style.borderRadius = '12px';
      iframe.style.display = 'block';
      spotifyPlayer.innerHTML = '';
      spotifyPlayer.appendChild(iframe);
    };
    var spotifyObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          loadSpotify();
          spotifyObs.disconnect();
        }
      });
    }, { rootMargin: '200px 0px' });
    spotifyObs.observe(spotifyPlayer);
  } else if (spotifyPlayer) {
    // Fallback : si pas d'IntersectionObserver, chargement immediat
    var iframe = document.createElement('iframe');
    iframe.src = spotifyPlayer.getAttribute('data-spotify-src');
    iframe.width = '100%'; iframe.height = '352';
    iframe.frameBorder = '0';
    iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
    iframe.style.borderRadius = '12px';
    spotifyPlayer.innerHTML = '';
    spotifyPlayer.appendChild(iframe);
  }

  /* ---------- DEFERRED YOUTUBE VIDEO ---------- */
  var videoPoster = document.getElementById('videoPoster');
  var videoPlayer = document.getElementById('videoPlayer');

  if (videoPoster && videoPlayer) {
    videoPoster.addEventListener('click', function () {
      var videoId = videoPoster.getAttribute('data-video-id') || '';
      var videoTitle = videoPoster.getAttribute('data-video-title') || 'Joe Col Joe';
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0';
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('title', videoTitle);
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

  /* ---------- SCROLL ANIMATIONS (native IntersectionObserver, no GSAP) ---------- */
  function initAnimations() {
    if (!('IntersectionObserver' in window)) {
      // Fallback : revele tout directement pour vieux navigateurs
      document.querySelectorAll('[data-animate], .section-title, .news__card, .concerts__item')
        .forEach(function (el) { el.classList.add('is-revealed'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add('is-revealed');
        // Clip-path reveal + auteur pour les citations
        if (el.getAttribute('data-animate') === 'clip') {
          var author = el.parentElement && el.parentElement.querySelector('.quote-section__author');
          if (author) author.classList.add('is-revealed');
        }
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

    var selectors = [
      '[data-animate]',
      '.section-title',
      '.news__card',
      '.concerts__item'
    ];
    document.querySelectorAll(selectors.join(',')).forEach(function (el) {
      io.observe(el);
    });

    // Swiper slide content fade (toujours actif sur changement)
    if (typeof heroSwiper !== 'undefined' && heroSwiper.on) {
      heroSwiper.on('slideChangeTransitionStart', function () {
        var activeSlide = heroSwiper.slides[heroSwiper.activeIndex];
        if (!activeSlide) return;
        var content = activeSlide.querySelector('.hero__slide-content');
        if (content) content.classList.add('is-animating');
      });
    }
  }

})();
