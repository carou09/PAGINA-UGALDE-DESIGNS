const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.nav-links');

menuButton?.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', isOpen);
});

navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  navigation.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));

document.querySelector('.contact-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const note = event.currentTarget.querySelector('.form-note');
  note.textContent = '¡Gracias! Muy pronto nos pondremos en contacto contigo.';
  event.currentTarget.reset();
});
