(function () {
  'use strict';

  const copy = {
    en: { back: 'Back to home', title: 'Support Not A Translator', intro: 'Choose a one-time donation to support the project and its dictionary services.', amount: 'Amount in euros', range: 'From €1 to €500. No subscription.', continue: 'Continue to secure payment', loading: 'Loading payment options…', privacy: "Payment details are entered in Stripe’s secure form. This site does not receive your card number.", paypal: 'Prefer PayPal?', test: 'Test mode — no real payment will be taken.', unavailable: 'Stripe payments are not available yet. You can still use PayPal below.', invalid: 'Enter an amount from €1 to €500, with no more than two decimal places.', failed: 'The payment form could not be loaded. Please try again or use PayPal.', paid: 'Thank you! Your donation has been received.', pending: 'Your payment is being processed. Please check Stripe’s confirmation before trying again.', open: 'The payment was not completed. You can try again below.', checkFailed: 'We could not verify this payment. Please check your Stripe confirmation before starting another donation.' },
    fr: { back: 'Retour à l’accueil', title: 'Soutenir Not A Translator', intro: 'Choisissez un don ponctuel pour soutenir le projet et ses services de dictionnaire.', amount: 'Montant en euros', range: 'De 1 € à 500 €. Sans abonnement.', continue: 'Continuer vers le paiement sécurisé', loading: 'Chargement du paiement…', privacy: 'Les coordonnées de paiement sont saisies dans le formulaire sécurisé de Stripe. Ce site ne reçoit pas votre numéro de carte.', paypal: 'Vous préférez PayPal ?', test: 'Mode test — aucun paiement réel ne sera effectué.', unavailable: 'Le paiement Stripe n’est pas encore disponible. Vous pouvez utiliser PayPal ci-dessous.', invalid: 'Saisissez un montant entre 1 € et 500 €, avec deux décimales au maximum.', failed: 'Le formulaire de paiement n’a pas pu être chargé. Réessayez ou utilisez PayPal.', paid: 'Merci ! Votre don a bien été reçu.', pending: 'Votre paiement est en cours de traitement. Vérifiez la confirmation Stripe avant de réessayer.', open: 'Le paiement n’a pas été finalisé. Vous pouvez réessayer ci-dessous.', checkFailed: 'Nous n’avons pas pu vérifier ce paiement. Vérifiez votre confirmation Stripe avant de faire un autre don.' },
    de: { back: 'Zur Startseite', title: 'Not A Translator unterstützen', intro: 'Unterstützen Sie das Projekt und seine Wörterbuchdienste mit einer einmaligen Spende.', amount: 'Betrag in Euro', range: 'Von 1 € bis 500 €. Kein Abonnement.', continue: 'Weiter zur sicheren Zahlung', loading: 'Zahlungsmöglichkeiten werden geladen…', privacy: 'Ihre Zahlungsdaten werden im sicheren Stripe-Formular eingegeben. Diese Website erhält Ihre Kartennummer nicht.', paypal: 'Lieber PayPal?', test: 'Testmodus — es wird keine echte Zahlung durchgeführt.', unavailable: 'Stripe-Zahlungen sind noch nicht verfügbar. Sie können unten PayPal verwenden.', invalid: 'Geben Sie einen Betrag von 1 € bis 500 € mit höchstens zwei Dezimalstellen ein.', failed: 'Das Zahlungsformular konnte nicht geladen werden. Versuchen Sie es erneut oder verwenden Sie PayPal.', paid: 'Vielen Dank! Ihre Spende ist eingegangen.', pending: 'Ihre Zahlung wird bearbeitet. Prüfen Sie die Stripe-Bestätigung, bevor Sie es erneut versuchen.', open: 'Die Zahlung wurde nicht abgeschlossen. Sie können es unten erneut versuchen.', checkFailed: 'Die Zahlung konnte nicht überprüft werden. Prüfen Sie Ihre Stripe-Bestätigung vor einer weiteren Spende.' },
    es: { back: 'Volver al inicio', title: 'Apoyar Not A Translator', intro: 'Haz una donación puntual para apoyar el proyecto y sus servicios de diccionario.', amount: 'Importe en euros', range: 'De 1 € a 500 €. Sin suscripción.', continue: 'Continuar al pago seguro', loading: 'Cargando las opciones de pago…', privacy: 'Los datos de pago se introducen en el formulario seguro de Stripe. Este sitio no recibe el número de tu tarjeta.', paypal: '¿Prefieres PayPal?', test: 'Modo de prueba: no se realizará ningún pago real.', unavailable: 'Los pagos con Stripe aún no están disponibles. Puedes usar PayPal abajo.', invalid: 'Introduce un importe de 1 € a 500 €, con un máximo de dos decimales.', failed: 'No se ha podido cargar el formulario de pago. Inténtalo de nuevo o usa PayPal.', paid: '¡Gracias! Hemos recibido tu donación.', pending: 'Tu pago se está procesando. Comprueba la confirmación de Stripe antes de volver a intentarlo.', open: 'El pago no se ha completado. Puedes intentarlo de nuevo abajo.', checkFailed: 'No hemos podido verificar el pago. Comprueba la confirmación de Stripe antes de hacer otra donación.' },
    fi: { back: 'Takaisin etusivulle', title: 'Tue Not A Translatoria', intro: 'Tue projektia ja sen sanakirjapalveluja kertalahjoituksella.', amount: 'Summa euroina', range: '1–500 €. Ei tilausta.', continue: 'Jatka turvalliseen maksuun', loading: 'Ladataan maksutapoja…', privacy: 'Maksutiedot syötetään Stripen suojattuun lomakkeeseen. Tämä sivusto ei saa korttisi numeroa.', paypal: 'Haluatko käyttää PayPalia?', test: 'Testitila — oikeaa maksua ei veloiteta.', unavailable: 'Stripe-maksut eivät ole vielä käytettävissä. Voit käyttää alla olevaa PayPal-linkkiä.', invalid: 'Anna summa väliltä 1–500 €, enintään kahdella desimaalilla.', failed: 'Maksulomaketta ei voitu ladata. Yritä uudelleen tai käytä PayPalia.', paid: 'Kiitos! Lahjoituksesi on vastaanotettu.', pending: 'Maksuasi käsitellään. Tarkista Stripen vahvistus ennen uutta yritystä.', open: 'Maksua ei suoritettu loppuun. Voit yrittää uudelleen alla.', checkFailed: 'Maksua ei voitu vahvistaa. Tarkista Stripen vahvistus ennen uutta lahjoitusta.' }
  };
  const params = new URLSearchParams(location.search);
  const nameLabels = { en: ['First name (optional)', 'Last name (optional)'], fr: ['Prénom (facultatif)', 'Nom (facultatif)'], de: ['Vorname (optional)', 'Nachname (optional)'], es: ['Nombre (opcional)', 'Apellidos (opcional)'], fi: ['Etunimi (valinnainen)', 'Sukunimi (valinnainen)'] };
  Object.keys(copy).forEach(key => { [copy[key].firstName, copy[key].lastName] = nameLabels[key]; });
  const requested = params.get('lang') || (navigator.language || 'en').slice(0, 2);
  const lang = Object.hasOwn(copy, requested) ? requested : 'en';
  const text = copy[lang];
  document.documentElement.lang = lang;
  document.title = text.title;
  document.querySelectorAll('[data-copy]').forEach(el => { el.textContent = text[el.dataset.copy]; });
  document.querySelectorAll('a[href^="index.html"]').forEach(el => { el.href = 'index.html?lang=' + lang + '#top'; });
  const form = document.getElementById('donation-form');
  const button = document.getElementById('donation-submit');
  const amount = document.getElementById('donation-amount');
  const status = document.getElementById('donation-status');
  const testNotice = document.getElementById('test-notice');
  const apiBase = String(window.NOTATR_DONATIONS?.apiBase || '').replace(/\/$/, '');
  let config, checkout, attempt, busy = false;

  function show(message, focus = false) {
    status.textContent = message;
    if (focus) status.focus();
  }
  function amountInCents(value) {
    const normalized = value.trim().replace(',', '.');
    if (!/^\d{1,3}(?:\.\d{1,2})?$/.test(normalized)) return null;
    const [whole, fraction = ''] = normalized.split('.');
    const cents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
    return cents >= 100 && cents <= 50000 ? cents : null;
  }
  async function api(path, options = {}) {
    const response = await fetch(apiBase + path, { ...options, cache: 'no-store', credentials: 'omit', signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error('Payment service unavailable');
    return response.json();
  }
  function loadStripe() {
    return new Promise((resolve, reject) => {
      if (window.Stripe) { resolve(); return; }
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/dahlia/stripe.js';
      const timer = setTimeout(() => reject(new Error('Stripe loading timeout')), 15000);
      script.onload = () => { clearTimeout(timer); window.Stripe ? resolve() : reject(new Error('Stripe unavailable')); };
      script.onerror = () => { clearTimeout(timer); reject(new Error('Stripe unavailable')); };
      document.head.appendChild(script);
    });
  }
  async function checkReturn(sessionId) {
    form.hidden = true;
    try {
      const result = await api('/session?session_id=' + encodeURIComponent(sessionId));
      if (result.paymentStatus === 'paid') show(text.paid, true);
      else if (result.status === 'complete') show(text.pending, true);
      else { form.hidden = false; button.disabled = false; show(text.open, true); }
    } catch (_) { show(text.checkFailed, true); }
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy || !config) return;
    const cents = amountInCents(amount.value);
    if (cents === null) { show(text.invalid); amount.focus(); return; }
    const firstName = document.getElementById('donation-first-name').value.trim();
    const lastName = document.getElementById('donation-last-name').value.trim();
    if (!attempt || attempt.amount !== cents || attempt.firstName !== firstName || attempt.lastName !== lastName) attempt = { amount: cents, firstName, lastName, requestId: crypto.randomUUID() };
    busy = true;
    button.disabled = true;
    amount.disabled = true;
    show(text.loading);
    try {
      await loadStripe();
      const stripe = window.Stripe(config.publishableKey, { locale: lang });
      checkout = await stripe.createEmbeddedCheckoutPage({
        fetchClientSecret: async () => {
          const session = await api('/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...attempt, lang }) });
          if (typeof session.clientSecret !== 'string' || !session.clientSecret) throw new Error('Invalid session');
          return session.clientSecret;
        }
      });
      checkout.mount('#stripe-checkout');
      form.hidden = true;
      show('');
    } catch (_) {
      if (checkout) { checkout.destroy(); checkout = null; }
      button.disabled = false;
      amount.disabled = false;
      show(text.failed, true);
    } finally { busy = false; }
  });
  (async () => {
    try {
      const url = new URL(apiBase);
      if (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname))) throw new Error('Invalid API URL');
      config = await api('/config');
      if (!/^pk_(test|live)_/.test(config.publishableKey) || typeof config.testMode !== 'boolean') throw new Error('Invalid configuration');
      testNotice.hidden = !config.testMode;
      const sessionId = params.get('session_id');
      if (sessionId) await checkReturn(sessionId);
      else { button.disabled = false; show(''); }
    } catch (_) { config = null; show(params.has('session_id') ? text.checkFailed : text.unavailable); }
  })();
})();
