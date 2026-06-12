/* ============================================
   Contact form — iframe submission
   Uses hidden iframe target to keep user on page.
   Endpoint email is base64-encoded in data attrs
   so it never appears in plain HTML.
   ============================================ */
(function () {
  'use strict';

  var form = document.getElementById('contactForm');
  if (!form) return;

  var submitBtn = document.getElementById('contactSubmit');
  var feedback = document.getElementById('contactFeedback');

  // Reconstruct endpoint on the fly — email stays obfuscated in source
  try {
    var base = atob(form.getAttribute('data-ep'));
    var to = atob(form.getAttribute('data-to'));
    form.setAttribute('action', base + to);
  } catch (err) {
    // If decoding fails, don't submit
    return;
  }

  form.addEventListener('submit', function () {
    // Honeypot — silently ignore if filled
    var honey = form.querySelector('input[name="_honey"]');
    if (honey && honey.value) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours...';
    feedback.className = 'contact__feedback';
    feedback.textContent = '';

    // The form POSTs into the hidden iframe; show success after a short delay
    setTimeout(function () {
      feedback.className = 'contact__feedback is-success';
      feedback.innerHTML = '<strong>Message envoye !</strong> Merci pour votre prise de contact. Nous vous repondrons rapidement.';
      form.reset();
      submitBtn.textContent = 'Envoyer';
      submitBtn.disabled = false;
    }, 900);
  });
})();
