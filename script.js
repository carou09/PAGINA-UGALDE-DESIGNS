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

const packageCatalog = {
  normal: [
    { value: 'standard', label: 'Standard', price: 300 },
    { value: 'platino', label: 'Platino', price: 400 },
    { value: 'diamante', label: 'Diamante', price: 550 },
  ],
  plus: [
    { value: 'standard-plus', label: 'Standard Plus', price: 350 },
    { value: 'platino-plus', label: 'Platino Plus', price: 450 },
    { value: 'diamante-plus', label: 'Diamante Plus', price: 600 },
  ],
};

const quoteForm = document.querySelector('#quote-form');
const packageOptions = document.querySelector('#package-options');
const packageFieldset = document.querySelector('#package-fieldset');
const totalOutput = document.querySelector('#quote-total');

const formatMoney = (amount) => `$${amount.toLocaleString('es-MX')} MXN`;

function renderPackages(type, selectedValue) {
  if (!packageOptions) return;
  if (type === 'clasica') {
    if (packageFieldset) packageFieldset.hidden = true;
    packageOptions.innerHTML = '';
    packageOptions.dataset.basePrice = '100';
    updateTotal();
    return;
  }

  if (packageFieldset) packageFieldset.hidden = false;
  packageOptions.dataset.basePrice = '0';
  const packages = packageCatalog[type];
  packageOptions.innerHTML = packages.map((plan, index) => `
    <label class="choice-card">
      <input type="radio" name="paquete" value="${plan.value}" data-price="${plan.price}" ${plan.value === selectedValue || (!selectedValue && index === 0) ? 'checked' : ''} />
      <span>${plan.label}<small>${formatMoney(plan.price)}</small></span>
    </label>
  `).join('');
  packageOptions.querySelectorAll('input').forEach((input) => input.addEventListener('change', updateTotal));
  updateTotal();
}

function updateTotal() {
  if (!quoteForm || !totalOutput) return;
  const plan = quoteForm.querySelector('input[name="paquete"]:checked');
  const extras = [...quoteForm.querySelectorAll('input[name="servicios"]:checked')];
  const basePrice = Number(plan?.dataset.price || packageOptions?.dataset.basePrice || 0);
  const total = basePrice + extras.reduce((sum, item) => sum + Number(item.dataset.price), 0);
  totalOutput.textContent = formatMoney(total);
}

quoteForm?.querySelectorAll('input[name="tipo"]').forEach((input) => input.addEventListener('change', () => {
  renderPackages(input.value);
}));

quoteForm?.querySelectorAll('input[name="servicios"]').forEach((input) => input.addEventListener('change', updateTotal));

document.querySelectorAll('.quote-button').forEach((button) => button.addEventListener('click', () => {
  const type = button.dataset.quoteType;
  const plan = button.dataset.quotePlan;
  if (!type || !quoteForm) return;
  const typeInput = quoteForm.querySelector(`input[name="tipo"][value="${type}"]`);
  if (typeInput) typeInput.checked = true;
  renderPackages(type, plan);
}));

quoteForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!quoteForm.reportValidity()) return;
  const data = new FormData(quoteForm);
  const planInput = quoteForm.querySelector('input[name="paquete"]:checked');
  const type = data.get('tipo');
  const plan = type === 'clasica'
    ? { label: 'Clásica', price: 100 }
    : packageCatalog[type].find((item) => item.value === planInput?.value);
  const extras = [...quoteForm.querySelectorAll('input[name="servicios"]:checked')].map((input) => {
    const label = input.closest('label')?.querySelector('span')?.firstChild?.textContent?.trim();
    return label || input.value;
  });
  const message = [
    'Hola, me gustaría contratar sus servicios.',
    '',
    '*DATOS DEL PEDIDO*',
    `Cliente: ${data.get('nombre')}`,
    `Número de telefono: ${data.get('telefono')}`,
    `Correo electrónico: ${data.get('correo')}`,
    `Tipo de invitación: ${plan?.label || ''}`,
    `Servicios adicionales: ${extras.length ? extras.join(', ') : 'Ninguno'}`,
    '',
    `*Total del pedido:* ${totalOutput?.textContent || ''}`,
  ].join('\n');
  window.open(`https://wa.me/5218126168533?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
});

renderPackages('normal', 'standard');