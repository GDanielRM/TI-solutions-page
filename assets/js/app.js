'use strict';

const config = window.TI_CONFIG || {};
const whatsapp = /^\d{10,15}$/.test(config.whatsapp || '') ? config.whatsapp : '';
const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email || '') ? config.email : '';
const byId = (id) => document.getElementById(id);
const safeWebUrl = (value) => {
  try { const url = new URL(value); return url.protocol === 'https:' ? url.href : null; }
  catch { return null; }
};

byId('currentYear').textContent = new Date().getFullYear();

// El menú se cierra después de elegir una sección en pantallas pequeñas.
document.querySelectorAll('#menuPrincipal a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => {
    const menu = byId('menuPrincipal');
    if (menu.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(menu).hide();
  });
});

document.querySelectorAll('[data-service]').forEach((link) => {
  link.addEventListener('click', () => { byId('serviceSelect').value = link.dataset.service; });
});

if (whatsapp) {
  const link = byId('whatsappLink');
  const message = config.whatsappMessage || 'Hola, vi el sitio de TI Solutions y me gustaría recibir información para desarrollar mi proyecto.';
  link.href = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
  link.target = '_blank'; link.rel = 'noopener noreferrer'; link.hidden = false;
}
if (email) {
  const link = byId('emailLink');
  link.href = `mailto:${email}`; link.textContent = email; link.hidden = false;
}
[['facebook', 'Facebook'], ['instagram', 'Instagram']].forEach(([key, label]) => {
  const url = safeWebUrl(config[key]);
  const item = document.createElement(url ? 'a' : 'span');
  item.className = `social-icon${url ? '' : ' is-pending'}`;
  item.title = url ? label : `${label} · Próximamente`;
  item.setAttribute('aria-label', url ? label : `${label}, próximamente`);
  if (url) { item.href = url; item.target = '_blank'; item.rel = 'noopener noreferrer'; }
  else item.setAttribute('role', 'img');
  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  icon.classList.add('social-brand-icon'); icon.setAttribute('viewBox', '0 0 24 24'); icon.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', `#i-${key}`); icon.append(use); item.append(icon);
  byId('socialLinks').append(item);
});
if (!safeWebUrl(config.facebook) && !safeWebUrl(config.instagram)) {
  const notice = document.createElement('span'); notice.className = 'social-pending-label';
  notice.textContent = 'Próximamente'; byId('socialLinks').append(notice);
}

// Servicio externo compatible con GitHub Pages y cualquier hosting estático.
// Mantén el POST nativo sincronizado con el correo público configurado.
const projectForm = byId('projectForm');
const formSubmitUrl = email ? `https://formsubmit.co/${encodeURIComponent(email)}` : '';
if (formSubmitUrl) projectForm.action = formSubmitUrl;
let submitting = false;
projectForm.addEventListener('submit', async (event) => {
  // En navegadores sin estas APIs, utiliza el POST HTML normal de FormSubmit.
  if (typeof fetch !== 'function' || typeof AbortController !== 'function') return;
  event.preventDefault();
  if (submitting) return;
  const form = event.currentTarget;
  const status = byId('formStatus');
  const submit = byId('submitProject');
  const name = byId('clientName').value.trim();
  const visitorEmail = byId('clientEmail').value.trim();
  const details = byId('projectDetails').value.trim();
  byId('clientName').setCustomValidity(name ? '' : 'Escribe tu nombre.');
  byId('projectDetails').setCustomValidity(details.length >= 10 ? '' : 'Cuéntanos un poco más (al menos 10 caracteres).');
  if (!form.reportValidity()) return;
  status.hidden = false;
  status.className = 'form-status';
  if (!email || byId('contactWebsite').value) {
    status.textContent = 'No pudimos procesar la consulta. Puedes escribirnos por WhatsApp o correo.';
    status.classList.add('is-error'); return;
  }
  const payload = {
    name, email: visitorEmail,
    telefono: byId('clientPhone').value.trim() || 'No indicado',
    negocio: byId('businessName').value.trim() || 'No indicado',
    servicio: byId('serviceSelect').value,
    message: details,
    _subject: `Nueva consulta · TI Solutions · ${byId('serviceSelect').value}`,
    _template: 'table', _honey: ''
  };
  const submitLabel = submit.innerHTML;
  submitting = true; submit.disabled = true; form.setAttribute('aria-busy', 'true');
  submit.textContent = 'Enviando…'; status.textContent = 'Estamos enviando tu consulta.';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(email)}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload), signal: controller.signal
    });
    const result = await response.json();
    const activation = /activat|confirm.*email|verify.*email/i.test(String(result.message || ''));
    // El proveedor puede devolver "false" como texto: nunca tratarlo como éxito.
    if (activation || !response.ok || !(result.success === true || result.success === 'true')) {
      const error = new Error('Submission rejected');
      error.activation = activation;
      throw error;
    }
    status.classList.add('is-success');
    status.textContent = 'Tu consulta fue recibida para su envío por correo. Te responderemos con los datos de contacto que compartiste.';
    form.reset();
  } catch (error) {
    status.classList.add('is-error');
    status.textContent = error.activation
      ? 'El formulario está pendiente de habilitación. Puedes contactarnos por WhatsApp o correo.'
      : 'No pudimos confirmar el envío. Conservamos lo que escribiste; puedes intentarlo de nuevo o contactarnos por WhatsApp o correo.';
  } finally {
    clearTimeout(timeout); submitting = false; submit.disabled = false;
    submit.innerHTML = submitLabel; form.removeAttribute('aria-busy');
  }
});
['clientName', 'projectDetails'].forEach((id) => byId(id).addEventListener('input', () => byId(id).setCustomValidity('')));

/* El formulario envía a través de FormSubmit; el botón de WhatsApp es independiente.
   La primera recepción requiere activar el destino desde el correo del propietario. */

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.filter((entry) => entry.isIntersecting).forEach((entry) => {
      document.querySelectorAll('.nav-link').forEach((link) => {
        if (link.getAttribute('href') === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -65% 0px' });
  document.querySelectorAll('main section[id]').forEach((section) => observer.observe(section));
}
