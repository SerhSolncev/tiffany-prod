document.addEventListener('DOMContentLoaded', (event) => {
  const getElement = (context, selector) => {
    if (!context && !selector) {
      return null;
    }

    return context.querySelector(selector);
  };

  document.body.classList.add('loading');

  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 500)

  // "modernizr" func"
  function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints;
  }

  if(!isTouchDevice()) {
    document.body.classList.add('desktop-device')
  }

  // lazy-load
  const observer = lozad('.lazy');
  observer.observe();

  const mutationObserver = new MutationObserver(() => {
    observer.observe(); // Проверяем новые lazy-элементы
  });

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

  gsap.registerPlugin(ScrollTrigger);

  const showElementYX = document.querySelectorAll('.js-light-show');

  showElementYX.forEach((element) => {
    const delay = parseFloat(element.dataset.delay) || 0;
    const duration = parseFloat(element.dataset.duration) || 0.5;
    const x = element.dataset.showX ? parseFloat(element.dataset.showX) || 0 : null;
    const y = element.dataset.showY ? parseFloat(element.dataset.showY) || 0 : null;
    const z = element.dataset.showZ ? parseFloat(element.dataset.showZ) || 0.9 : null;
    const start = element.dataset.start || 'top 105%';
    const end = element.dataset.end || 'top 50%';

    const from = { opacity: 0 };
    if (x !== null) from.x = x;
    if (y !== null) from.y = y;
    if (z !== null) from.scale = z;

    const to = { opacity: 1, x: 0, y: 0, scale: 1, duration: duration, delay: delay };

    gsap.fromTo(
      element,
      from,
      {
        ...to,
        scrollTrigger: {
          trigger: element,
          start: start,
          end: end,
          toggleActions: "play none none none",
        },
      }
    );
  });

  gsap.utils.toArray(".js-parallax-img picture").forEach(image => {
    gsap.to(image, {
      scale: 1.15,
      ease: "none",
      scrollTrigger: {
        trigger: image,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  });

  const header = document.querySelector('.js-header');
  const topBlock = document.querySelector('.js-top-block');
  let headerHeight = header.offsetHeight;

  function updateTopBlockHeight() {
    topBlock.style.height = `calc(100vh - ${header.offsetHeight}px)`;
  }

  if(topBlock) {
    updateTopBlockHeight();
  }


  window.addEventListener('resize', function () {
    if (topBlock) {
      updateTopBlockHeight();
    }
    updateBodyPadding();
  });

  window.addEventListener('scroll', () => {
    const header = document.querySelector('.js-header');
    const headerHeight = header.offsetHeight;

    if (window.scrollY > headerHeight) {
      header.classList.add('scroll');
    } else {
      header.classList.remove('scroll');
    }
  });

  function updateBodyPadding() {
    const header = document.querySelector('.js-header');
    if (header) {
      document.body.style.paddingTop = `${header.offsetHeight}px`;
    }
  }

  updateBodyPadding();

  if (window.scrollY > document.querySelector('.js-header').offsetHeight) {
    document.querySelector('.js-header').classList.add('scroll');
  } else {
    document.querySelector('.js-header').classList.remove('scroll');
  }

  // тідьки цифри в інпуті

  document.addEventListener('input', function(event) {
    if (event.target.classList.contains('js-input-number')) {
      event.target.value = event.target.value.replace(/[^0-9\s()+-]/g, '');
    }
  });


  // call-dropdowns
  let callTriggers = document.querySelectorAll('.js-trigger-drop');

  function showDropdown(dataId, triggerElement) {
    let callDropdown = document.querySelector(`.js-hover-dropdown[data-id="${dataId}"]`);
    let windowWidth = window.innerWidth;

    if (!callDropdown.closest('.js-hover-dropdown.show')) {
      closeAllDropdowns();
    }

    callDropdown.classList.add('show');
    triggerElement.classList.add('opened');

    if (windowWidth < 991) {
      document.body.style.overflow = 'hidden';
    }

    let callClose = callDropdown.querySelectorAll('.js-drop-close');
    callClose.forEach(close => {
      close.addEventListener('click', function() {
        hideParentDropdown(close);
      });
    });
  }

  function hideDropdown(element) {
    let callDropdown = element.closest('.js-hover-dropdown');
    if (callDropdown) {
      callDropdown.classList.remove('show');

      // Закрываем все вложенные dropdown'ы
      let nestedDropdowns = callDropdown.querySelectorAll('.js-hover-dropdown.show');
      nestedDropdowns.forEach(nested => nested.classList.remove('show'));
    }
  }

  function hideParentDropdown(element) {
    let parentDropdown = element.closest('.js-hover-dropdown');
    if (parentDropdown) {
      hideDropdown(parentDropdown);
    }
    document.body.style.overflow = 'initial';
  }

  function toggleDropdown(dataId, triggerElement) {
    let callDropdown = document.querySelector(`.js-hover-dropdown[data-id="${dataId}"]`);
    let isDropdownOpen = callDropdown.classList.contains('show');

    if (isDropdownOpen) {
      hideDropdown(callDropdown);
    } else {
      showDropdown(dataId, triggerElement);
    }
  }

  function closeAllDropdowns() {
    let allDropdowns = document.querySelectorAll('.js-hover-dropdown');
    let allTriggers = document.querySelectorAll('.js-trigger-drop');

    allDropdowns.forEach(dropdown => dropdown.classList.remove('show'));
    allTriggers.forEach(trigger => trigger.classList.remove('opened'));
    document.body.style.overflow = 'initial';
  }

  function setupDropdownBehavior() {
    callTriggers.forEach(trigger => {
      trigger.addEventListener('click', function(e) {
        e.preventDefault();
        let dataId = trigger.getAttribute('data-id');
        toggleDropdown(dataId, trigger);
      });
    });
  }

  setupDropdownBehavior();


  // choises для селект

  const selectElements = document.querySelectorAll('.js-custom-select');

  if (selectElements.length > 0) {
    selectElements.forEach(select => {
      const minLength = parseInt(select.getAttribute('data-min-length-search'), 10) || 0;
      const optionsCount = select.options.length;
      const searchEnabled = optionsCount >= minLength;

      const choices = new Choices(select, {
        searchEnabled: searchEnabled,
        searchChoices: searchEnabled,
        searchResultLimit: 10,
        searchFields: ['label', 'value'],
        removeItemButton: false,
        itemSelectText: '',
        shouldSort: false
      });

      if (searchEnabled) {
        select.addEventListener('search', event => {
          const searchValue = event.detail.value.toLowerCase();

          choices.setChoices(
            Array.from(select.options)
            .map(option => ({
              value: option.value,
              label: option.text,
              selected: option.selected,
              disabled: option.disabled
            }))
            .filter(choice => choice.label.toLowerCase().includes(searchValue)),
            'value',
            'label',
            true
          );
        });
      }
    });
  }

  // map
  document.querySelectorAll(".js-google-map").forEach(mapEl => {
    let markerData = mapEl.getAttribute("data-marker");
    let iconUrl = mapEl.getAttribute("data-icon") || null;
    let zoomLevel = parseInt(mapEl.getAttribute("data-zoom"), 10) || 6;

    if (markerData) {
      try {
        let coords = JSON.parse(markerData);

        function getLongitudeShift() {
          return window.innerWidth < 768 ? 0 : window.innerWidth * 0.0003;
        }

        let shiftLongitude = getLongitudeShift();
        let mapCenter = { lat: coords.lat, lng: coords.lng - shiftLongitude };

        let map = new google.maps.Map(mapEl, {
          center: mapCenter,
          zoom: zoomLevel,
          disableDefaultUI: true, // Убираем элементы управления
          styles: [
            { elementType: "geometry", stylers: [{ color: "#d9d9d9" }] }, // Светлый фон
            { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#4a4a4a" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#d9d9d9" }] },

            { featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{ color: "#7d7d7d" }] },
            { featureType: "poi", elementType: "geometry", stylers: [{ color: "#c8c8c8" }] },
            { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#5a5a5a" }] },
            { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#bdbdbd" }] },
            { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#5a5a5a" }] },

            { featureType: "road", elementType: "geometry", stylers: [{ color: "#222222" }] }, // Дороги темные
            { featureType: "road.arterial", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
            { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#333333" }] }, // Шоссе чуть светлее дорог
            { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#6d6d6d" }] },
            { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#7d7d7d" }] },

            { featureType: "transit.line", elementType: "geometry", stylers: [{ color: "#aaaaaa" }] },
            { featureType: "transit.station", elementType: "geometry", stylers: [{ color: "#b0b0b0" }] },

            { featureType: "water", elementType: "geometry", stylers: [{ color: "#9d9d9d" }] },
            { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#5e5e5e" }] }
          ]
        });

        new google.maps.Marker({
          position: coords,
          map: map,
          icon: iconUrl
        });

        // Обработчик для обновления карты при ресайзе
        window.addEventListener('resize', () => {
          let newShiftLongitude = getLongitudeShift();
          map.setCenter({ lat: coords.lat, lng: coords.lng - newShiftLongitude });
        });
      } catch (e) {
        console.error("Ошибка в JSON координатах маркера", e);
      }
    }
  });

  if (typeof MicroModal !== 'undefined') {
    MicroModal.init({
      disableScroll: true
    });
  }

  document.addEventListener('click', function (e) {
    let btn = e.target.closest('.js-video-btn');
    if (!btn) return;

    let videoSrc = btn.getAttribute('data-video');
    let videoElement = document.querySelector('.js-popup-video');

    if (videoElement) {
      videoElement.src = videoSrc;
      videoElement.play().catch(error => console.error('error play video', error));
    }

    MicroModal.show('video');
  });

  document.addEventListener('click', function (e) {
    if (e.target.hasAttribute('data-micromodal-close')) {
      let videoElement = document.querySelector('.js-popup-video');
      if (videoElement) {
        videoElement.pause();
        videoElement.src = '';
      }
    }
  });

})
