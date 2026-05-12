(function () {
  'use strict';

  const SUPPORTED_LANGS = ['en', 'fr', 'es', 'de', 'fi'];
  const state = {
    lang: 'en',
    messages: null
  };

  const featureIcons = ['◍', '⇄', '🔊', '⌘', '∿', '⚙'];
  const updateAccents = ['Now', 'Improved', 'Mobile', 'Lookup'];
  const signalIcons = ['↗', '◌', '⚑'];
  const engineIcons = ['#', '≈', '↺', '◐', '⊕', '⤴'];

  function getPath(root, path) {
    return path.split('.').reduce((value, key) => {
      if (value && Object.prototype.hasOwnProperty.call(value, key)) return value[key];
      return undefined;
    }, root);
  }

  function decodeEntities(value) {
    if (value === undefined || value === null) return value;
    const str = String(value);
    if (str.indexOf('&') < 0) return str;
    const textarea = document.createElement('textarea');
    textarea.innerHTML = str;
    return textarea.value;
  }

  function setText(el, value) {
    if (!el || value === undefined || value === null) return;
    el.textContent = decodeEntities(value);
  }

  function pickInitialLanguage() {
    const urlLang = new URLSearchParams(window.location.search).get('lang');
    const browserLang = (navigator.language || 'en').slice(0, 2).toLowerCase();
    if (SUPPORTED_LANGS.indexOf(urlLang) >= 0) return urlLang;
    if (SUPPORTED_LANGS.indexOf(browserLang) >= 0) return browserLang;
    return 'en';
  }

  async function loadMessages(lang) {
    const safeLang = SUPPORTED_LANGS.indexOf(lang) >= 0 ? lang : 'en';
    const url = `locales/${safeLang}.json?v=${Date.now()}`;
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Cannot load locale ${safeLang}`);
    return response.json();
  }

  function makeEl(tag, className, textValue) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (textValue !== undefined && textValue !== null) el.textContent = decodeEntities(textValue);
    return el;
  }

  function makeFeatureCard(item, index) {
    const article = makeEl('article', 'feature-card');
    article.appendChild(makeEl('div', 'feature-icon', featureIcons[index % featureIcons.length])).setAttribute('aria-hidden', 'true');
    article.appendChild(makeEl('h3', '', item.title));
    article.appendChild(makeEl('p', '', item.body));
    return article;
  }

  function makeUpdateCard(item, index) {
    const article = makeEl('article', 'update-card');
    article.appendChild(makeEl('span', 'kicker', item.kicker || updateAccents[index % updateAccents.length]));
    article.appendChild(makeEl('h3', '', item.title));
    article.appendChild(makeEl('p', '', item.body));
    return article;
  }

  function makeSignalCard(item, index) {
    const article = makeEl('article', 'signal-card');
    const icon = makeEl('span', 'signal-icon', signalIcons[index % signalIcons.length]);
    icon.setAttribute('aria-hidden', 'true');
    article.appendChild(icon);
    article.appendChild(makeEl('strong', '', item.value));
    article.appendChild(makeEl('span', '', item.label));
    article.appendChild(makeEl('p', '', item.body));
    return article;
  }

  function makeManifestoCard(item) {
    const article = makeEl('article', 'manifesto-card');
    article.appendChild(makeEl('h3', '', item.title));
    article.appendChild(makeEl('p', '', item.body));
    return article;
  }

  function makeEngineCard(item, index) {
    const article = makeEl('article', 'engine-card');
    const icon = makeEl('span', 'engine-icon', engineIcons[index % engineIcons.length]);
    icon.setAttribute('aria-hidden', 'true');
    article.appendChild(icon);
    article.appendChild(makeEl('h3', '', item.title));
    article.appendChild(makeEl('p', '', item.body));
    return article;
  }

  function makeFaqCard(item) {
    const article = makeEl('article', 'faq-card');
    article.appendChild(makeEl('h3', '', item.q));
    article.appendChild(makeEl('p', '', item.a));
    return article;
  }

  function makeLi(textValue) {
    return makeEl('li', '', textValue);
  }

  function getDictionarySourceMeta(textValue) {
    if (/Merriam-Webster/i.test(textValue)) return { icon: 'https://www.merriam-webster.com/favicon.ico', alt: 'Merriam-Webster' };
    if (/Diccionario de la Lengua/i.test(textValue)) return { icon: 'https://dle.rae.es/favicon.ico', alt: 'RAE' };
    if (/Larousse/i.test(textValue)) return { icon: 'https://www.larousse.fr/favicon.ico', alt: 'Larousse' };
    if (/DWDS/i.test(textValue)) return { icon: 'https://www.dwds.de/favicon.ico', alt: 'DWDS' };
    if (/De Mauro|Internazionale/i.test(textValue)) return { icon: 'https://www.internazionale.it/favicon.ico', alt: 'Internazionale' };
    if (/Kielitoimiston sanakirja/i.test(textValue)) return { icon: 'https://kielitoimistonsanakirja.fi/favicon.ico', alt: 'Kielitoimiston sanakirja' };
    if (/Wiktionary/i.test(textValue)) return { icon: 'https://en.wiktionary.org/static/favicon/wiktionary/en.ico', alt: 'Wiktionary' };
    return null;
  }

  function makeDictionaryLi(textValue) {
    const li = makeEl('li', 'dictionary-item');
    const meta = getDictionarySourceMeta(textValue);
    if (meta) {
      const img = document.createElement('img');
      img.className = 'dictionary-source-icon';
      img.src = meta.icon;
      img.alt = meta.alt;
      img.loading = 'lazy';
      li.appendChild(img);
    } else {
      li.appendChild(makeEl('span', 'dictionary-source-badge', 'A'));
    }
    li.appendChild(makeEl('span', '', decodeEntities(textValue)));
    return li;
  }

  const renderers = {
    'li': makeLi,
    'feature-card': makeFeatureCard,
    'update-card': makeUpdateCard,
    'signal-card': makeSignalCard,
    'manifesto-card': makeManifestoCard,
    'engine-card': makeEngineCard,
    'faq-card': makeFaqCard,
    'dictionary-li': makeDictionaryLi
  };

  function renderList(target, items, rendererName) {
    const renderer = renderers[rendererName] || makeLi;
    if (!target || !Array.isArray(items)) return;
    target.replaceChildren();
    items.forEach((item, index) => target.appendChild(renderer(item, index)));
  }


  const legacyTextBindings = {
    brandTitle: 'shared.appName',
    brandTagline: 'site.brandTagline',
    navFeatures: 'site.nav.features',
    navUpdates: 'site.nav.updates',
    navEngine: 'site.nav.engine',
    navUsage: 'site.nav.usage',
    navFaq: 'site.nav.faq',
    langLabel: 'site.languageLabel',
    heroEyebrow: 'site.hero.eyebrow',
    heroTitle: 'site.hero.title',
    heroLeadBefore: 'site.hero.inlineDemo.before',
    heroLeadWord: 'site.hero.inlineDemo.word',
    heroLeadTooltipWord: 'site.hero.inlineDemo.word',
    heroLeadRotating: 'site.hero.inlineDemo.badge',
    heroLeadTooltipDefinition: 'site.hero.inlineDemo.definition',
    heroLeadAfter: 'site.hero.inlineDemo.after',
    heroPrimaryCta: 'site.hero.primaryCta',
    heroSecondaryCta: 'site.hero.secondaryCta',
    storeChromeKicker: 'site.hero.storeCtas.install',
    storeAndroidKicker: 'site.hero.storeCtas.install',
    storeFirefoxKicker: 'site.hero.storeCtas.install',
    storePaypalKicker: 'site.hero.storeCtas.paypal',
    storeChromeLabel: 'site.hero.storeCtas.chrome',
    storeAndroidLabel: 'site.hero.storeCtas.firefoxAndroid',
    storeFirefoxLabel: 'site.hero.storeCtas.firefox',
    storePaypalLabel: 'site.hero.storeCtas.paypalLabel',
    badgeRisk: 'shared.badges.risky',
    badgeMaybe: 'shared.badges.conditional',
    badgeOk: 'shared.badges.ok',
    demoWord: 'site.demo.word',
    demoTime: 'site.demo.time',
    demoDefinition: 'site.demo.definition',
    demoCopy: 'shared.console.copy',
    demoRemove: 'shared.console.remove',
    heroPanelNote: 'site.hero.panelNote',
    publishedKicker: 'site.hero.status.published.kicker',
    publishedTitle: 'site.hero.status.published.title',
    publishedBody: 'site.hero.status.published.body',
    fundingKicker: 'site.hero.status.funding.kicker',
    fundingTitle: 'site.hero.status.funding.title',
    fundingBody: 'site.hero.status.funding.body',
    fundingCta: 'site.hero.status.funding.cta',
    screensEyebrow: 'site.screenshots.eyebrow',
    screensTitle: 'site.screenshots.title',
    screensLead: 'site.screenshots.lead',
    screenDesktopTitle: 'site.screenshots.desktop.title',
    screenDesktopBody: 'site.screenshots.desktop.body',
    screenMobileTitle: 'site.screenshots.mobile.title',
    screenMobileBody: 'site.screenshots.mobile.body',
    manifestoEyebrow: 'site.manifesto.eyebrow',
    manifestoTitle: 'site.manifesto.title',
    manifestoLead: 'site.manifesto.lead',
    featuresEyebrow: 'site.features.eyebrow',
    featuresTitle: 'site.features.title',
    featuresLead: 'site.features.lead',
    updatesEyebrow: 'site.updates.eyebrow',
    updatesTitle: 'site.updates.title',
    updatesLead: 'site.updates.lead',
    engineEyebrow: 'site.engine.eyebrow',
    engineTitle: 'site.engine.title',
    engineLead: 'site.engine.lead',
    usageEyebrow: 'site.usage.eyebrow',
    usageTitle: 'site.usage.title',
    usageLead: 'site.usage.lead',
    platformsTitle: 'site.platforms.title',
    dictionariesTitle: 'site.dictionaries.title',
    faqEyebrow: 'site.faq.eyebrow',
    faqTitle: 'site.faq.title',
    footerLine: 'site.footer'
  };

  const legacyListBindings = {
    heroPoints: ['site.hero.points', 'li'],
    signalStrip: ['site.signals.items', 'signal-card'],
    manifestoGrid: ['site.manifesto.items', 'manifesto-card'],
    featureGrid: ['site.features.items', 'feature-card'],
    updateList: ['site.updates.items', 'update-card'],
    engineGrid: ['site.engine.items', 'engine-card'],
    usageSteps: ['site.usage.steps', 'li'],
    platformList: ['site.platforms.items', 'li'],
    dictionaryList: ['site.dictionaries.items', 'dictionary-li'],
    faqList: ['site.faq.items', 'faq-card']
  };

  function updateLegacyIdBindings(messages) {
    Object.entries(legacyTextBindings).forEach(([id, path]) => {
      setText(document.getElementById(id), getPath(messages, path));
    });

    Object.entries(legacyListBindings).forEach(([id, binding]) => {
      renderList(document.getElementById(id), getPath(messages, binding[0]), binding[1]);
    });
  }

  function updateStaticLabels(messages) {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      setText(el, getPath(messages, el.dataset.i18n));
    });

    document.querySelectorAll('[data-i18n-list]').forEach((el) => {
      renderList(el, getPath(messages, el.dataset.i18nList), el.dataset.i18nRender);
    });
  }

  function updateLanguageNames(messages) {
    const select = document.getElementById('languageSelect');
    if (!select || !messages.shared || !messages.shared.languages) return;
    const labels = messages.shared.languages;
    const names = {
      en: labels.english,
      fr: labels.french,
      es: labels.spanish,
      de: labels.german,
      fi: labels.finnish
    };
    Array.from(select.options).forEach((option) => {
      if (names[option.value]) option.textContent = decodeEntities(names[option.value]);
    });
  }

  function bindInlineTooltipDemo() {
    const root = document.getElementById('inlineTooltipDemo');
    const rotate = document.getElementById('inlineTooltipRotate');
    if (!root || !rotate || rotate.dataset.demoBound === '1') return;
    const positions = [
      'inline-tooltip-pos-bottom',
      'inline-tooltip-pos-right',
      'inline-tooltip-pos-top',
      'inline-tooltip-pos-left'
    ];
    let index = positions.findIndex((name) => root.classList.contains(name));
    if (index < 0) index = 0;

    rotate.addEventListener('click', function () {
      root.classList.remove(...positions);
      index = (index + 1) % positions.length;
      root.classList.add(positions[index]);
    });

    rotate.dataset.demoBound = '1';
  }

  function applyMessages(messages) {
    state.messages = messages;
    state.lang = messages.lang || state.lang;
    document.documentElement.lang = state.lang;

    if (messages.meta) {
      if (messages.meta.title) document.title = decodeEntities(messages.meta.title);
      const meta = document.querySelector('meta[name="description"]');
      if (meta && messages.meta.description) meta.setAttribute('content', decodeEntities(messages.meta.description));
    }

    updateStaticLabels(messages);
    updateLegacyIdBindings(messages);
    updateLanguageNames(messages);

    const select = document.getElementById('languageSelect');
    if (select && select.value !== state.lang) select.value = state.lang;

    bindInlineTooltipDemo();
  }

  async function setLanguage(lang) {
    const nextLang = SUPPORTED_LANGS.indexOf(lang) >= 0 ? lang : 'en';
    const messages = await loadMessages(nextLang);
    applyMessages(messages);
    const url = new URL(window.location.href);
    url.searchParams.set('lang', nextLang);
    history.replaceState(null, '', url.toString());
  }


  function clearBrowserInstallGlow() {
    document.querySelectorAll('.store-pill-browser-match').forEach((el) => {
      el.classList.remove('store-pill-browser-match');
      el.removeAttribute('aria-current');
    });
  }

  function detectInstallTarget() {
    const ua = navigator.userAgent || '';
    const isAndroid = /Android/i.test(ua);
    const isFirefox = /Firefox|FxiOS|Fennec/i.test(ua);
    const isEdge = /Edg|EdgiOS|EdgA/i.test(ua);
    const isChrome = /Chrome|CriOS|Chromium/i.test(ua) && !isFirefox;

    if (isAndroid && isFirefox) return document.getElementById('storeAndroidLink') || document.querySelector('.store-pill-android');
    if (isFirefox) return document.getElementById('storeFirefoxLink') || document.querySelector('.store-pill-firefox');
    if (isChrome || isEdge) return document.getElementById('storeChromeLink') || document.querySelector('.store-pill-chrome');
    return null;
  }

  function highlightDetectedInstallTarget(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const trigger = document.getElementById('browserDetectTrigger');
    const target = detectInstallTarget();
    clearBrowserInstallGlow();

    if (!target) {
      if (trigger) {
        trigger.classList.remove('brand-mark-browser-unknown');
        void trigger.offsetWidth;
        trigger.classList.add('brand-mark-browser-unknown');
      }
      return;
    }

    target.classList.add('store-pill-browser-match');
    target.setAttribute('aria-current', 'true');
    target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  function bindBrowserDetectTrigger() {
    const trigger = document.getElementById('browserDetectTrigger');
    if (!trigger || trigger.dataset.detectBound === '1') return;

    trigger.addEventListener('click', highlightDetectedInstallTarget);
    trigger.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') highlightDetectedInstallTarget(event);
    });

    trigger.dataset.detectBound = '1';
  }

  document.addEventListener('DOMContentLoaded', async function () {
    bindBrowserDetectTrigger();
    const select = document.getElementById('languageSelect');
    if (select) {
      select.addEventListener('change', function () {
        setLanguage(select.value).catch(console.error);
      });
    }
    try {
      await setLanguage(pickInitialLanguage());
    } catch (err) {
      console.error(err);
      bindInlineTooltipDemo();
    }
  });
})();
