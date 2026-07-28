const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });
}

document.querySelectorAll('[data-year]').forEach((node) => {
  node.textContent = new Date().getFullYear();
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach((node) => observer.observe(node));

document.querySelectorAll('.track button').forEach((button) => {
  button.addEventListener('click', () => {
    const wasPlaying = button.textContent === 'Ⅱ';
    document.querySelectorAll('.track button').forEach((item) => {
      item.textContent = '▶';
      item.setAttribute('aria-label', 'Play preview');
    });
    if (!wasPlaying) {
      button.textContent = 'Ⅱ';
      button.setAttribute('aria-label', 'Pause preview');
    }
  });
});
