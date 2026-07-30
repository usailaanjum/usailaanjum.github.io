const galleryData = window.GALLERY_DATA;

if (galleryData) {
  const sizePattern = ['large', 'small', 'medium', 'large', 'small', 'wide', 'medium', 'small'];
  const offsetPattern = ['center', 'high', 'low', 'center', 'high', 'low', 'center', 'high'];

  const makeCarousel = (images, label) => {
    const carousel = document.createElement('div');
    carousel.className = 'art-carousel';

    const track = document.createElement('div');
    track.className = 'art-carousel-track';
    track.tabIndex = 0;
    track.setAttribute('role', 'region');
    track.setAttribute('aria-label', `${label} photo carousel`);

    images.forEach((src, index) => {
      const frame = document.createElement('div');
      frame.className = `art-frame size-${sizePattern[index % sizePattern.length]} offset-${offsetPattern[index % offsetPattern.length]}`;

      const image = document.createElement('img');
      image.src = src;
      image.alt = `${label} photograph ${index + 1}`;
      image.loading = 'lazy';
      image.decoding = 'async';

      frame.append(image);
      track.append(frame);
    });

    const controls = document.createElement('div');
    controls.className = 'carousel-controls';

    const position = document.createElement('span');
    position.className = 'carousel-position';
    position.textContent = `${String(images.length).padStart(2, '0')} ${images.length === 1 ? 'photograph' : 'photographs'}`;

    const buttons = document.createElement('div');
    buttons.className = 'carousel-buttons';

    const previous = document.createElement('button');
    previous.type = 'button';
    previous.setAttribute('aria-label', `Previous ${label} photographs`);
    previous.textContent = '←';

    const next = document.createElement('button');
    next.type = 'button';
    next.setAttribute('aria-label', `Next ${label} photographs`);
    next.textContent = '→';

    const updateButtons = () => {
      const end = track.scrollWidth - track.clientWidth;
      previous.disabled = track.scrollLeft < 2;
      next.disabled = track.scrollLeft >= end - 2;
    };

    previous.addEventListener('click', () => {
      track.scrollBy({ left: -track.clientWidth * 0.72, behavior: 'smooth' });
    });
    next.addEventListener('click', () => {
      track.scrollBy({ left: track.clientWidth * 0.72, behavior: 'smooth' });
    });
    track.addEventListener('scroll', updateButtons, { passive: true });
    window.addEventListener('resize', updateButtons);

    let dragging = false;
    let startX = 0;
    let startScroll = 0;
    track.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'touch') return;
      dragging = true;
      startX = event.clientX;
      startScroll = track.scrollLeft;
      track.classList.add('dragging');
      track.setPointerCapture(event.pointerId);
    });
    track.addEventListener('pointermove', (event) => {
      if (!dragging) return;
      track.scrollLeft = startScroll - (event.clientX - startX);
    });
    const stopDragging = () => {
      dragging = false;
      track.classList.remove('dragging');
    };
    track.addEventListener('pointerup', stopDragging);
    track.addEventListener('pointercancel', stopDragging);

    buttons.append(previous, next);
    controls.append(position, buttons);
    carousel.append(track, controls);
    requestAnimationFrame(updateButtons);
    return carousel;
  };

  document.querySelectorAll('[data-gallery]').forEach((container) => {
    const key = container.dataset.gallery;
    const images = galleryData[key] || [];
    if (images.length) {
      container.replaceChildren(makeCarousel(images, key === 'cat' ? 'Cat' : 'Plant'));
    }
  });

  const travelContainer = document.querySelector('[data-travel-gallery]');
  if (travelContainer) {
    const fragment = document.createDocumentFragment();

    galleryData.travel.forEach(({ year, locations }) => {
      const yearSection = document.createElement('section');
      yearSection.className = 'travel-year';

      const heading = document.createElement('div');
      heading.className = 'travel-year-heading';

      const title = document.createElement('h2');
      title.textContent = year;

      const total = locations.reduce((sum, location) => sum + location.images.length, 0);
      const count = document.createElement('span');
      count.textContent = `${total} photographs`;

      heading.append(title, count);
      yearSection.append(heading);

      locations.forEach(({ name, images }) => {
        const location = document.createElement('section');
        location.className = 'travel-location carousel-location';

        const meta = document.createElement('div');
        meta.className = 'location-meta';

        const locationName = document.createElement('h3');
        locationName.textContent = name;

        const locationCount = document.createElement('p');
        locationCount.textContent = `${images.length} ${images.length === 1 ? 'photograph' : 'photographs'}`;

        meta.append(locationName, locationCount);
        location.append(meta, makeCarousel(images, `${name} ${year}`));
        yearSection.append(location);
      });

      fragment.append(yearSection);
    });

    travelContainer.replaceChildren(fragment);
  }
}
