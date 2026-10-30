
function getDomainThumbnail(url) {
  try {
    if (!url || url === '#') return '';
    const u = new URL(url);
    const full = u.href;

    // Google Play: use public Play Store image proxy pattern
    if (u.hostname.includes('play.google.com')) {
      const id = u.searchParams.get('id');
      if (id) return `https://play-lh.googleusercontent.com/?id=${encodeURIComponent(id)}`;
    }

    // App Store / normal websites: use favicon fallback
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(u.hostname)}&sz=256`;
  } catch (_) {
    return '';
  }
}


// ═══════════════════════════════════════════════════════
//  MBDTECH LTD — FRONTEND CONFIG
//  Single source of truth for all public contact details.
//  On Vercel: these are injected at build time via env vars.
//  To update: change values here only.
// ═══════════════════════════════════════════════════════
const MBDTECH = {
  email:     'mbdtechltd.uk@gmail.com',
  phone:     '+44 7462 059140',
  whatsapp:  'https://wa.me/447462059140',
  address:   'United Kingdom',
  social: {
    linkedin:  'https://linkedin.com/company/mbdtechltd',
    twitter:   'https://x.com/mbdtechltd',
    facebook:  'https://facebook.com/mbdtechltd',
    instagram: 'https://instagram.com/mbdtechltd',
    github:    'https://github.com/mbdtechltd',
    youtube:   'https://youtube.com/@mbdtechltd',
  },
  portal:    '/portal/login.html',
  chatbot:   true,
};

// ===== PAGE NAVIGATION =====
function pageToPath(name) {
  const routes = {
    home: '/',
    services: '/services',
    portfolio: '/portfolio',
    marketplace: '/marketplace',
    ai: '/ai-features',
    readylaunch: '/ready-to-launch',
    blog: '/blog',
    about: '/about',
    contact: '/contact',
    start: '/start-project'
  };
  return routes[name] || '/';
}

function pathToPage(path) {
  if (path.startsWith('/ready-to-launch/') && path.length > '/ready-to-launch/'.length) return 'listingdetail';
  const routes = {
    '/': 'home',
    '/services': 'services',
    '/portfolio': 'portfolio',
    '/marketplace': 'marketplace',
    '/ai-features': 'ai',
    '/ready-to-launch': 'readylaunch',
    '/blog': 'blog',
    '/about': 'about',
    '/contact': 'contact',
    '/start-project': 'start'
  };
  return routes[path] || 'home';
}

function showPage(name, skipUrlUpdate = false) {
  if (!skipUrlUpdate) {
    const path = pageToPath(name);
    if (window.location.pathname !== path) {
      history.pushState({ page: name }, '', path);
    }
  }
  // Always close mobile drawer first
  const drawer  = document.getElementById('mobDrawer');
  const overlay = document.getElementById('mobOverlay');
  const btn     = document.getElementById('mobMenuBtn');
  if (drawer && drawer.classList.contains('open')) {
    drawer.classList.remove('open');
    if (overlay) { overlay.classList.remove('visible'); setTimeout(() => { overlay.style.display = 'none'; }, 290); }
    if (btn) btn.classList.remove('open');
    document.body.style.overflow = '';
  }
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
  const page = document.getElementById('page-' + name);
  if (page) page.classList.add('active');
  const navLink = document.getElementById('nav-' + name);
  if (navLink) navLink.classList.add('active');
  window.scrollTo({top: 0, behavior: 'smooth'});
  observeFadeIns();
}

// ===== PORTFOLIO FILTER =====
function filterPortfolio(cat, btn) {
  document.querySelectorAll('#portfolioFilters .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#portfolioGrid .portfolio-card').forEach(card => {
    if (cat === 'all' || card.dataset.cat === cat) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

// ===== MULTI-STEP FORM =====
function nextStep(n) {
  document.querySelectorAll('.step-content').forEach(s => s.classList.remove('active'));
  const target = document.getElementById('step' + n) || document.getElementById('stepSuccess');
  if (target) target.classList.add('active');
  for (let i = 1; i <= 6; i++) {
    const dot = document.getElementById('sdot' + i);
    const line = document.getElementById('sline' + i);
    if (dot) {
      if (i < n) { dot.classList.add('done'); dot.classList.remove('active'); dot.innerHTML = '✓'; }
      else if (i === n) { dot.classList.add('active'); dot.classList.remove('done'); dot.innerHTML = i; }
      else { dot.classList.remove('active','done'); dot.innerHTML = i; }
    }
    if (line && i < n) line.classList.add('done');
    else if (line) line.classList.remove('done');
  }
}

function selectOption(el, stepId) {
  el.closest('.option-grid').querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}

function toggleCheck(el) {
  const cb = el.querySelector('.feature-checkbox');
  if (el.classList.contains('selected')) { cb.style.background = 'var(--blue)'; cb.style.borderColor = 'var(--blue)'; cb.style.color = 'white'; }
  else { cb.style.background = ''; cb.style.borderColor = ''; cb.style.color = ''; }
}

function submitProject() {
  document.querySelectorAll('.step-content').forEach(s => s.classList.remove('active'));
  document.getElementById('stepSuccess').classList.add('active');
  for (let i = 1; i <= 6; i++) {
    const dot = document.getElementById('sdot' + i);
    const line = document.getElementById('sline' + i);
    if (dot) { dot.classList.add('done'); dot.classList.remove('active'); dot.innerHTML = '✓'; }
    if (line) line.classList.add('done');
  }
}

// ===== AI CONSULTANT =====
let chatOpen = false;

function toggleChat() {
  chatOpen = !chatOpen;
  document.getElementById('chatPanel').classList.toggle('open', chatOpen);
}

// Professional conversation flows — business topics only
const FLOWS = {
  mobile: {
    steps: [
      "To scope your mobile application accurately, I have a few questions.\n\nFirst: what is the core purpose of the app? (e.g. e-commerce, booking, delivery, health, education, marketplace)",
      "Understood. Do you require an iOS app, an Android app, or both platforms?",
      "Which core features are required? For example: user authentication, payments, admin panel, push notifications, maps, in-app chat, or AI integration.",
      "What is your expected project timeline — and do you have a budget range in mind?\n\nTypical mobile projects range from £8,000 for an MVP to £40,000+ for a full-featured product.",
      "Thank you. Based on your requirements, our team can prepare a detailed proposal.\n\nYou can submit a full project brief via our Start Project page, or I can note your contact details for a direct follow-up from our team."
    ]
  },
  web: {
    steps: [
      "I can assist with scoping a website or web application.\n\nWhat type of product are you building? (e.g. marketing website, web app, SaaS platform, e-commerce, customer portal)",
      "Do you require a CMS for content management, a user-facing application with accounts and data, or both?",
      "Which features are essential? For example: authentication, payments, admin dashboard, API integrations, booking system, or AI-powered functionality.",
      "What is your expected timeline and budget range?\n\nWeb applications typically range from £5,000 for a straightforward site to £35,000+ for a full SaaS platform.",
      "Thank you. Our team will prepare a scoped proposal. Please visit the Start Project page to submit your full brief, or leave your contact details for a direct follow-up."
    ]
  },
  estimate: {
    steps: [
      "I can provide a preliminary cost indication.\n\nWhat type of product are you building — mobile app, web application, SaaS platform, AI tool, or website?",
      "Which platforms are required? (iOS, Android, Web, or multiple)",
      "List your 3–5 core features. For example: user login, payments, admin panel, maps, AI integration, booking system.",
      "What is your expected launch timeline? This helps calibrate the estimate accurately."
    ],
    result: "Based on the information provided, here is a preliminary estimate:\n\n— Cost Range: £8,000 – £45,000 (varies by scope and features)\n— Timeline: 8–16 weeks depending on complexity\n— Team: Project manager, UI/UX designer, 2–3 developers, QA\n\nFor a fixed-price proposal with full scope, please submit your project brief via the Start Project page. Our team will respond within 24 hours."
  },
  portfolio: "MBDTECH LTD has delivered 500+ projects across multiple sectors. Selected case studies:\n\n— ShopSmart (E-Commerce App) · React Native · 200K+ installs · 4.8★\n— MediBook (Healthcare SaaS) · Flutter · NHS partner deployment\n— AnalyticsPro (B2B SaaS) · Next.js · £40K ARR in Month 3\n— ContentGenius (AI SaaS) · OpenAI · 1,200 subscribers in 60 days\n\nYou can view the full portfolio on the Portfolio page. Would you like details on a specific sector?",
  contact: "To connect with the appropriate member of our team:\n\n— Email: mbdtechltd.uk@gmail.com\n— Phone: +44 (0) 20 0000 0000 (Mon–Fri, 9AM–6PM GMT)\n— Project Brief: Start Project page\n— WhatsApp: Available on the Contact page\n\nWe respond within 2 hours during business hours.",
  saas: {
    steps: [
      "MBDTECH LTD specialises in multi-tenant SaaS development built on Next.js, Node.js, and PostgreSQL — with Stripe billing and role management from day one.\n\nWhat type of SaaS product are you planning to build?",
      "Who is your target customer — businesses (B2B), consumers (B2C), or both?",
      "Which subscription model are you considering — per-seat, usage-based, or tiered plans?",
      "Thank you. Our team can prepare a detailed SaaS architecture proposal. Please visit the Start Project page to submit your brief."
    ]
  },
  ai: "MBDTECH LTD delivers custom AI solutions including:\n\n— GPT-4 / LangChain chatbots and virtual assistants\n— Recommendation and personalisation engines\n— Computer vision integration\n— AI-powered content generation tools\n— Intelligent workflow automation\n\nWhat AI capability are you looking to build into your product?",
  marketplace: "Our Marketplace offers production-ready products available for immediate licence:\n\n— E-Commerce App Kit · from £249\n— Doctor Booking App · from £349\n— SaaS Starter Pro · from £199\n— Food Delivery App Kit · from £449\n— Universal Admin Panel · from £129\n— Premium Mobile UI Kit · from £69\n\nAll products are customisable by our UK team. Would you like details on a specific product?",
  trending: "Current high-traction digital product categories based on market data:\n\n1. AI Resume Builder SaaS — Score: 96\n2. Food Delivery Platform — Score: 92\n3. Professional Booking System — Score: 88\n4. AI Fitness Coach App — Score: 84\n5. CRM Dashboard — Score: 81\n6. Mobile E-Commerce App — Score: 79\n\nWould you like to discuss building any of these? I can provide a preliminary estimate."
};

const REDIRECT = "I can only assist with MBDTECH LTD service enquiries — including app development, website development, SaaS products, AI solutions, project estimation, and portfolio information.\n\nPlease select one of the options below or describe your project requirement.";

let convTopic = null, convStep = 0;

function detectTopic(msg) {
  const m = msg.toLowerCase();
  if (/\b(mobile|app|ios|android|flutter|react native|hybrid)\b/.test(m)) return 'mobile';
  if (/\bsaas\b/.test(m)) return 'saas';
  if (/\b(website|web app|web application|portal|dashboard|next\.?js)\b/.test(m)) return 'web';
  if (/\b(cost|price|budget|estimate|how much|quote|rate|payment|pay)\b/.test(m)) return 'estimate';
  if (/\b(portfolio|case stud|past work|example|project you|built)\b/.test(m)) return 'portfolio';
  if (/\b(contact|team|human|speak|call|email|phone|whatsapp|talk to someone)\b/.test(m)) return 'contact';
  if (/\b(ai|artificial intelligence|machine learning|chatbot|gpt|openai|llm)\b/.test(m)) return 'ai';
  if (/\b(marketplace|ready.made|template|script|buy|purchase|kit|admin panel)\b/.test(m)) return 'marketplace';
  if (/\b(trending|trend|popular|what.*build|ideas|opportunities)\b/.test(m)) return 'trending';
  if (/\b(marketing|aso|ads|promote|monetis|monetiz|maintenance|support|update|bug)\b/.test(m)) return 'services';
  return null;
}

function hideQuickOpts() {
  const q = document.getElementById('chatQuickOpts');
  if (q) q.style.display = 'none';
}

function addMsg(text, type) {
  const c = document.getElementById('chatMessages');
  const d = document.createElement('div');
  d.className = 'chat-msg ' + type;
  if (type === 'bot') {
    const lbl = document.createElement('div');
    lbl.className = 'ai-label';
    lbl.textContent = 'AI CONSULTANT';
    d.appendChild(lbl);
  }
  const b = document.createElement('div');
  b.className = 'bubble';
  b.innerHTML = text.replace(/\n/g, '<br>');
  d.appendChild(b);
  c.appendChild(d);
  c.scrollTop = c.scrollHeight;
}

function showTyping() {
  const c = document.getElementById('chatMessages');
  const t = document.createElement('div');
  t.id = 'aiTyping'; t.className = 'ai-msg bot ai-typing-wrap';
  const lbl = document.createElement('div'); lbl.className = 'ai-label'; lbl.textContent = 'AI CONSULTANT';
  const d = document.createElement('div'); d.className = 'ai-typing';
  d.innerHTML = '<span></span><span></span><span></span>';
  t.appendChild(lbl); t.appendChild(d);
  c.appendChild(t); c.scrollTop = c.scrollHeight;
}

function hideTyping() {
  const t = document.getElementById('aiTyping');
  if (t) t.remove();
}

function sendQuick(topic) {
  hideQuickOpts();
  const labels = {
    mobile: 'Mobile App Development',
    web: 'Website or Web Application',
    estimate: 'Project Cost Estimation',
    portfolio: 'Portfolio & Case Studies',
    contact: 'Contact the Team'
  };
  addMsg(labels[topic] || topic, 'user');
  convTopic = topic; convStep = 0;
  showTyping();
  setTimeout(() => {
    hideTyping();
    const directReply = getDirectSupportReply(topic);
    if (directReply) { addMsg(directReply, 'bot'); convTopic = null; return; }

    const flow = FLOWS[topic];
    if (typeof flow === 'string') { addMsg(flow, 'bot'); convTopic = null; }
    else if (flow && flow.steps) { addMsg(flow.steps[0], 'bot'); convStep = 1; }
  }, 900);
}


function getDirectSupportReply(topic) {
  if (topic === 'marketplace') return `If you want to buy a ready-made app or digital product, please visit our Ready-to-Launch section:<br><br>
<a class="btn btn-primary" href="/ready-to-launch" style="text-decoration:none;margin:4px;">View Ready-to-Launch Apps</a><br><br>
For customisation, ownership transfer, deployment, or payment details, contact our support team:<br><br>
<a class="btn btn-outline" target="_blank" rel="noopener" href="https://wa.me/447462059140" style="text-decoration:none;margin:4px;">WhatsApp</a>
<a class="btn btn-outline" target="_blank" rel="noopener" href="https://t.me/Mbdtech_Ltd" style="text-decoration:none;margin:4px;">Telegram</a>
<a class="btn btn-outline" href="mailto:mbdtechltd.uk@gmail.com" style="text-decoration:none;margin:4px;">Email</a>`;
  if (topic === 'estimate') return `Project pricing depends on scope, features, platform, timeline, and support requirements.<br><br>To avoid giving inaccurate pricing, our support team will review your requirement and guide you directly.<br><br>For quick support, contact MBDTECH LTD directly:<br><br>
<a class="btn btn-primary" target="_blank" rel="noopener" href="https://wa.me/447462059140" style="text-decoration:none;margin:4px;">WhatsApp</a>
<a class="btn btn-outline" target="_blank" rel="noopener" href="https://t.me/Mbdtech_Ltd" style="text-decoration:none;margin:4px;">Telegram</a>
<a class="btn btn-outline" href="mailto:mbdtechltd.uk@gmail.com" style="text-decoration:none;margin:4px;">Email</a>`;
  if (['mobile','web','saas','ai','services','contact'].includes(topic)) return `Thanks for your interest in MBDTECH LTD services.<br><br>For app development, website development, SaaS, AI tools, maintenance, updates, or custom project work, please contact our support team directly:<br><br>For quick support, contact MBDTECH LTD directly:<br><br>
<a class="btn btn-primary" target="_blank" rel="noopener" href="https://wa.me/447462059140" style="text-decoration:none;margin:4px;">WhatsApp</a>
<a class="btn btn-outline" target="_blank" rel="noopener" href="https://t.me/Mbdtech_Ltd" style="text-decoration:none;margin:4px;">Telegram</a>
<a class="btn btn-outline" href="mailto:mbdtechltd.uk@gmail.com" style="text-decoration:none;margin:4px;">Email</a><br><br>If you prefer a ready-made app, you can also visit:<br><br><a class="btn btn-primary" href="/ready-to-launch" style="text-decoration:none;margin:4px;">Ready-to-Launch Apps</a>`;
  return null;
}

function sendChat() {
  const inp = document.getElementById('chatInput');
  const msg = inp.value.trim();
  if (!msg) return;
  inp.value = ''; inp.style.height = '';
  hideQuickOpts();
  addMsg(msg, 'user');

  showTyping();
  const delay = Math.min(600 + msg.length * 10, 1600);

  setTimeout(() => {
    hideTyping();

    // If no active conversation, detect topic
    if (!convTopic) {
      const topic = detectTopic(msg);
      if (!topic) { addMsg(REDIRECT, 'bot'); return; }
      const directReply = getDirectSupportReply(topic);
      if (directReply) { addMsg(directReply, 'bot'); convTopic = null; return; }

      convTopic = topic; convStep = 0;
      const flow = FLOWS[topic];
      if (typeof flow === 'string') { addMsg(flow, 'bot'); convTopic = null; }
      else if (flow && flow.steps) { addMsg(flow.steps[0], 'bot'); convStep = 1; }
      return;
    }

    // Active conversation — progress through steps
    const flow = FLOWS[convTopic];
    if (typeof flow === 'string') { addMsg(flow, 'bot'); convTopic = null; return; }

    if (flow && flow.steps && convStep < flow.steps.length) {
      addMsg(flow.steps[convStep], 'bot');
      convStep++;
    } else if (flow && flow.result) {
      addMsg(flow.result, 'bot');
      convTopic = null;
    } else {
      addMsg("Thank you for the detail. Our team will prepare a tailored proposal for your project.\n\nPlease visit the Start Project page to submit your full brief, or contact us at mbdtechltd.uk@gmail.com. We respond within 24 hours.", 'bot');
      convTopic = null;
    }
  }, delay);
}

// Auto-resize textarea
const aiInput = document.getElementById('chatInput');
if (aiInput) {
  aiInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 80) + 'px';
  });
}

// ===== SCROLL ANIMATIONS =====
function observeFadeIns() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in:not(.visible)').forEach(el => observer.observe(el));
}
observeFadeIns();
window.addEventListener('scroll', observeFadeIns);

// ===================================================================
// MARKETPLACE CATEGORY FILTER (fix)
// ===================================================================
function initMarketplaceFilters() {
  const filterBtns = document.querySelectorAll('.marketplace-filter-btn');
  const cards = document.querySelectorAll('.market-card[data-cat]');
  if (!filterBtns.length) return;
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const cat = this.dataset.cat;
      cards.forEach(card => {
        card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
      });
    });
  });
}

// ===================================================================
// BLOG CATEGORY FILTER (fix)
// ===================================================================
function initBlogFilters() {
  const filterBtns = document.querySelectorAll('.blog-filter-btn');
  const cards = document.querySelectorAll('.blog-card[data-cat]');
  if (!filterBtns.length) return;
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const cat = this.dataset.cat;
      cards.forEach(card => {
        card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
      });
    });
  });
}

// ===================================================================
// LIVE DEMO MODAL (Marketplace)
// ===================================================================
const DEMO_DATA = {
  'ecommerce-kit': {
    title: 'E-Commerce Starter Kit',
    category: 'Mobile App',
    description: 'A production-ready e-commerce app with full product catalogue, cart, Stripe payments, and admin dashboard. Available for iOS and Android.',
    features: ['Product catalogue with categories & search', 'Cart and wishlist management', 'Stripe & PayPal payment integration', 'Admin dashboard with order management', 'Push notifications', 'Analytics integration'],
    tech: 'React Native · Node.js · PostgreSQL · Stripe',
    demoUrl: 'https://demo.mbdtechltd.com/ecommerce'
  },
  'admin-dashboard': {
    title: 'Universal Admin Dashboard',
    category: 'Admin Panel',
    description: 'A comprehensive admin panel built with React and Tailwind CSS. Includes charts, user management, RBAC, and dark/light mode.',
    features: ['Charts & analytics widgets', 'User and role management (RBAC)', 'Data tables with search/sort/filter', 'Dark and light mode', 'REST API integration-ready', 'Responsive layout'],
    tech: 'React · Tailwind CSS · Recharts',
    demoUrl: 'https://demo.mbdtechltd.com/admin'
  },
  'saas-landing': {
    title: 'SaaS Landing Page Pro',
    category: 'Website Template',
    description: 'A high-converting SaaS marketing website built with Next.js and Tailwind CSS. Fully SEO-optimised with a CMS-ready blog.',
    features: ['SEO-optimised structure', 'CMS-ready blog (Sanity/Contentful)', 'Pricing section with toggle', 'Testimonials and social proof', 'Contact and lead capture forms', 'Fast Core Web Vitals scores'],
    tech: 'Next.js · Tailwind CSS · Sanity CMS',
    demoUrl: 'https://demo.mbdtechltd.com/saas-landing'
  },
  'doctor-booking': {
    title: 'Doctor Booking App',
    category: 'Mobile App',
    description: 'A healthcare mobile app with GP appointment booking, telemedicine, and patient health records. NHS-compatible data structure.',
    features: ['Doctor profiles & search', 'Appointment scheduling system', 'Video consultation (WebRTC)', 'Patient health records', 'Prescription management', 'Payment gateway integration'],
    tech: 'Flutter · Firebase · Twilio · Stripe',
    demoUrl: 'https://demo.mbdtechltd.com/medibook'
  },
  'saas-starter': {
    title: 'SaaS Starter Pro',
    category: 'SaaS Script',
    description: 'A complete SaaS boilerplate with auth, billing, teams, and multi-tenant architecture ready to deploy on Vercel.',
    features: ['NextAuth authentication + JWTs', 'Stripe subscription billing', 'Multi-tenant RBAC', 'Email via Resend API', 'Admin dashboard', 'Fully typed TypeScript codebase'],
    tech: 'Next.js · PostgreSQL · Stripe · Resend',
    demoUrl: 'https://demo.mbdtechltd.com/saas-starter'
  },
  'food-delivery': {
    title: 'Food Delivery App Kit',
    category: 'Mobile App',
    description: 'A complete food delivery platform with Customer App, Driver App, and Restaurant Dashboard. Real-time GPS tracking included.',
    features: ['Multi-restaurant support', 'Real-time GPS delivery tracking', 'Driver app included', 'Restaurant management dashboard', 'Order history and ratings', 'Stripe payment integration'],
    tech: 'React Native · Node.js · Google Maps · Stripe',
    demoUrl: 'https://demo.mbdtechltd.com/food-delivery'
  }
};

function openDemoModal(productKey) {
  const data = DEMO_DATA[productKey];
  if (!data) return;
  let modal = document.getElementById('demoModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'demoModal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;';
    modal.addEventListener('click', e => { if (e.target === modal) closeDemoModal(); });
    document.body.appendChild(modal);
  }
  modal.innerHTML = `
    <div style="background:#0B2351;border:1px solid rgba(37,99,235,.25);border-radius:18px;width:100%;max-width:560px;padding:32px;position:relative;max-height:90vh;overflow-y:auto">
      <button onclick="closeDemoModal()" style="position:absolute;top:14px;right:14px;background:rgba(255,255,255,.07);border:none;color:#94A3B8;width:28px;height:28px;border-radius:7px;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;font-family:inherit">&#x2715;</button>
      <div style="font-size:10.5px;font-weight:700;color:#3B82F6;letter-spacing:.8px;text-transform:uppercase;margin-bottom:6px">${data.category}</div>
      <h3 style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-.5px;margin-bottom:10px">${data.title}</h3>
      <p style="font-size:14px;color:#94A3B8;line-height:1.75;margin-bottom:20px">${data.description}</p>
      <div style="margin-bottom:20px">
        <div style="font-size:11px;font-weight:700;color:#64748B;letter-spacing:.6px;text-transform:uppercase;margin-bottom:10px">Key Features</div>
        <ul style="list-style:none;display:flex;flex-direction:column;gap:7px">
          ${data.features.map(f => `<li style="font-size:13.5px;color:#94A3B8;display:flex;align-items:center;gap:8px"><span style="width:5px;height:5px;border-radius:50%;background:#2563EB;flex-shrink:0"></span>${f}</li>`).join('')}
        </ul>
      </div>
      <div style="font-size:12px;color:#64748B;margin-bottom:20px">Tech Stack: <span style="color:#60A5FA">${data.tech}</span></div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <a href="${data.demoUrl}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;padding:11px 22px;background:#2563EB;color:#fff;border-radius:9px;font-weight:600;font-size:14px;text-decoration:none">View Live Demo</a>
        <button onclick="closeDemoModal();showPage('contact')" style="display:inline-flex;align-items:center;padding:11px 22px;background:rgba(255,255,255,.07);color:#fff;border:1px solid rgba(255,255,255,.1);border-radius:9px;font-weight:600;font-size:14px;cursor:pointer;font-family:inherit">Request Customisation</button>
      </div>
    </div>`;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}


function openListingDetailModal(listingId) {
  const item = (window.__MBD_LISTINGS__ || {})[listingId];
  if (!item) return openDemoModal(listingId);

  const platformMap = { ios: 'iOS App', android: 'Android App', ios_android: 'iOS + Android App', web: 'Web App' };
  const platformLabel = platformMap[item.platform] || 'Digital Product';
  const saleStatus = item.sale_status === 'sold_out' ? 'Sold Out' : 'Live';
  const statusColor = item.sale_status === 'sold_out' ? '#DC2626' : '#16A34A';
  if (item.sale_status === 'sold_out') {
    wrap.innerHTML = `
      <div style="background:white;border-radius:18px;padding:34px;box-shadow:0 10px 30px rgba(15,23,42,.08);text-align:center;">
        <h1 style="font-size:28px;margin-bottom:10px;">Sold Out</h1>
        <p style="color:#64748B;line-height:1.7;">This product has been sold and its details are locked.</p>
        <a href="/ready-to-launch" class="btn btn-primary" style="text-decoration:none;">Back to Ready-to-Launch</a>
      </div>
    `;
    return;
  }

  const currency = item.earning_currency || 'USD';
  const earning = item.monthly_earning ? `${currency} ${item.monthly_earning}/mo` : 'Available on request';
  const history = String(item.earning_history || '').split(',').map(v => Number(String(v).trim())).filter(v => !isNaN(v) && v > 0);
  const max = history.length ? Math.max(...history) : 0;
  const bars = history.length ? history.map((v, i) => `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;"><div style="width:100%;height:${Math.max(14, Math.round((v / max) * 90))}px;background:#2563EB;border-radius:8px 8px 3px 3px;"></div><span style="font-size:10px;color:#94A3B8">${v}</span></div>`).join('') : `<div style="font-size:13px;color:#94A3B8">Earning history will be shared with serious buyers.</div>`;
  const cleanCat = String(item.category || 'Listing').replace(/^Marketplace\s*—\s*/i, '').replace(/^Ready To Launch\s*—\s*/i, '');
  const image = item.image_url || '';
  const demo = item.demo_url || '#';

  let modal = document.getElementById('demoModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'demoModal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;';
    modal.addEventListener('click', e => { if (e.target === modal) closeDemoModal(); });
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div style="background:#0B2351;border:1px solid rgba(37,99,235,.25);border-radius:18px;width:100%;max-width:820px;position:relative;max-height:90vh;overflow-y:auto;color:#fff">
      <button onclick="closeDemoModal()" style="position:absolute;top:14px;right:14px;background:rgba(255,255,255,.09);border:none;color:#CBD5E1;width:30px;height:30px;border-radius:8px;cursor:pointer;font-size:16px;z-index:2">&#x2715;</button>
      ${image ? `<div style="height:230px;background-image:url('${image}');background-size:cover;background-position:center;border-radius:18px 18px 0 0;"></div>` : ''}
      <div style="padding:28px;">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:10px">
          <span style="font-size:11px;font-weight:800;color:#60A5FA;text-transform:uppercase;letter-spacing:.7px">${cleanCat} • ${platformLabel}</span>
          <span style="font-size:11px;font-weight:800;padding:4px 10px;border-radius:999px;background:${statusColor};color:#fff">${saleStatus}</span>
        </div>
        <h3 style="font-size:26px;font-weight:900;margin:0 0 10px">${item.title || 'Ready-to-Launch Product'}</h3>
        <p style="font-size:14px;color:#CBD5E1;line-height:1.75;margin:0 0 22px">${item.description || item.short_desc || 'Professional MBDTECH LTD digital product ready for deployment.'}</p>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px;margin-bottom:20px">
          <div style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:14px"><div style="font-size:11px;color:#94A3B8;font-weight:800;text-transform:uppercase">Monthly Earning</div><div style="font-size:18px;font-weight:900;margin-top:6px">${earning}</div></div>
          <div style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:14px"><div style="font-size:11px;color:#94A3B8;font-weight:800;text-transform:uppercase">Monetization</div><div style="font-size:14px;font-weight:700;margin-top:6px">${item.monetization || 'Available on request'}</div></div>
          <div style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:14px"><div style="font-size:11px;color:#94A3B8;font-weight:800;text-transform:uppercase">Payment</div><div style="font-size:14px;font-weight:700;margin-top:6px">${item.payment_methods || 'PayPal, Crypto, Bank Transfer'}</div></div>
        </div>

        <div style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:16px;margin-bottom:20px">
          <div style="font-size:12px;color:#94A3B8;font-weight:900;text-transform:uppercase;margin-bottom:14px">Earning Graph</div>
          <div style="height:125px;display:flex;align-items:flex-end;gap:8px">${bars}</div>
        </div>

        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px">
          <button type="button" disabled style="display:inline-flex;align-items:center;padding:11px 20px;background:#64748B;color:#fff;border-radius:9px;font-weight:800;font-size:14px;border:0;cursor:not-allowed;opacity:.75">Locked</button>
          <button onclick="closeDemoModal();showPage('contact')" style="display:inline-flex;align-items:center;padding:11px 20px;background:rgba(255,255,255,.08);color:#fff;border:1px solid rgba(255,255,255,.12);border-radius:9px;font-weight:800;font-size:14px;cursor:pointer">Contact Us</button>
        </div>
        <div style="font-size:12px;color:#94A3B8;line-height:1.8">
          ${item.contact_whatsapp ? `WhatsApp: ${item.contact_whatsapp}<br>` : ''}
          ${item.contact_telegram ? `Telegram: ${item.contact_telegram}<br>` : ''}
          ${item.contact_email ? `Email: ${item.contact_email}` : ''}
        </div>
      </div>
    </div>`;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeDemoModal() {
  const modal = document.getElementById('demoModal');
  if (modal) { modal.style.display = 'none'; document.body.style.overflow = ''; }
}

// ===================================================================
// FORMS — BACKEND-READY STUBS
// Environment variables required (set on Vercel/Netlify):
//   CONTACT_RECEIVER_EMAIL, SUPPORT_EMAIL, WHATSAPP_LINK
// Replace fetch URL with your API route or serverless function.
// ===================================================================
async function submitContactForm(formData) {
  try {
    // Replace with: fetch('/api/contact', { method:'POST', body: JSON.stringify(formData) })
    console.log('[Contact Form] Submission ready for API:', formData);
    return { ok: true };
  } catch (err) {
    console.error('[Contact Form] Error:', err);
    return { ok: false };
  }
}

async function submitProjectForm(formData) {
  try {
    // Replace with: fetch('/api/start-project', { method:'POST', body: JSON.stringify(formData) })
    console.log('[Project Form] Submission ready for API:', formData);
    return { ok: true };
  } catch (err) {
    console.error('[Project Form] Error:', err);
    return { ok: false };
  }
}

async function submitMarketplaceRequest(formData) {
  try {
    // Replace with: fetch('/api/marketplace-request', { method:'POST', body: JSON.stringify(formData) })
    console.log('[Marketplace Request] Submission ready for API:', formData);
    return { ok: true };
  } catch (err) {
    console.error('[Marketplace Request] Error:', err);
    return { ok: false };
  }
}

// ===================================================================
// DEEPSEEK AI CHATBOT — Backend-ready structure
// Set DEEPSEEK_API_KEY as environment variable on your server.
// The frontend calls your own API route which holds the key.
// This prevents key exposure in the browser.
// ===================================================================
async function callDeepSeekAPI(messages) {
  try {
    // Call your own server-side API route, NOT DeepSeek directly
    // Example Vercel route: /api/chat
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages })
    });
    if (!response.ok) throw new Error('API error');
    const data = await response.json();
    return data.content || null;
  } catch (err) {
    // Fallback to local demo responses if API not configured
    return null;
  }
}

// ===================================================================
// PWA — SERVICE WORKER REGISTRATION
// ===================================================================
/* PWA disabled temporarily to prevent old cached pages/flicker on refresh. */
/* Install prompt disabled temporarily. */


function showInstallBanner() {
  if (document.getElementById('pwaInstallBanner')) return;
  const banner = document.createElement('div');
  banner.id = 'pwaInstallBanner';
  banner.style.cssText = `
    position:fixed;bottom:80px;left:50%;transform:translateX(-50%);
    background:#0B2351;border:1px solid rgba(37,99,235,.3);
    border-radius:12px;padding:12px 20px;
    display:flex;align-items:center;gap:14px;
    box-shadow:0 8px 32px rgba(0,0,0,.5);
    z-index:990;font-family:var(--font-head,'Outfit',sans-serif);
    max-width:360px;width:calc(100vw - 40px);
  `;
  banner.innerHTML = `
    <div style="flex:1">
      <div style="font-size:13px;font-weight:700;color:#fff">Add to Home Screen</div>
      <div style="font-size:11.5px;color:#94A3B8;margin-top:2px">Install MBDTECH LTD for quick access</div>
    </div>
    <button onclick="triggerPWAInstall()" style="padding:8px 16px;background:#2563EB;color:#fff;border:none;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;font-family:inherit;white-space:nowrap">Install</button>
    <button onclick="dismissInstallBanner()" style="background:transparent;border:none;color:#64748B;cursor:pointer;font-size:18px;padding:0 2px;line-height:1">&#x2715;</button>
  `;
  document.body.appendChild(banner);
  setTimeout(dismissInstallBanner, 12000);
}

function triggerPWAInstall() {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  deferredInstallPrompt.userChoice.then(() => {
    deferredInstallPrompt = null;
    dismissInstallBanner();
  });
}

function dismissInstallBanner() {
  const b = document.getElementById('pwaInstallBanner');
  if (b) b.remove();
}

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  dismissInstallBanner();
});

// ===================================================================
// INIT
// ===================================================================
document.addEventListener('DOMContentLoaded', () => {
  initMarketplaceFilters();
  initBlogFilters();

  // Handle clean routes and old ?page= URL parameter
  const urlPage = new URLSearchParams(window.location.search).get('page');
  const routePage = urlPage || pathToPage(window.location.pathname);
  if (routePage && document.getElementById('page-' + routePage)) {
    showPage(routePage, true);
  }

  window.addEventListener('popstate', () => {
    const page = pathToPage(window.location.pathname);
    if (page && document.getElementById('page-' + page)) {
      showPage(page, true);
    }
  });
});

// ===================================================================

const listingGraphStyle = document.createElement('style');
listingGraphStyle.textContent = `
.listing-graph-wrap{height:230px;display:flex;align-items:flex-end;gap:18px;padding:18px 8px 8px;position:relative}
.listing-graph-group{flex:1;min-width:52px;display:flex;align-items:flex-end;justify-content:center;gap:5px;height:180px;position:relative}
.listing-bar{width:13px;border-radius:999px 999px 4px 4px;min-height:8px;transition:.2s ease;cursor:pointer;position:relative}
.listing-bar:hover{transform:translateY(-4px);filter:brightness(.96)}
.listing-bar-earning{background:#2563EB}
.listing-bar-cost{background:#F97316}
.listing-bar-profit{background:#16A34A}
.listing-graph-label{position:absolute;bottom:-24px;left:50%;transform:translateX(-50%);font-size:11px;font-weight:800;color:#64748B;white-space:nowrap}
.listing-tooltip{display:none;position:absolute;bottom:100%;left:50%;transform:translateX(-50%);background:#0F172A;color:white;border-radius:12px;padding:10px 12px;font-size:12px;line-height:1.55;white-space:nowrap;box-shadow:0 14px 30px rgba(15,23,42,.25);z-index:20;margin-bottom:10px;text-align:left}
.listing-graph-item:hover .listing-tooltip{display:block}
.listing-tooltip b{font-size:13px}
`;
document.head.appendChild(listingGraphStyle);

// READY-TO-LAUNCH FILTERS & REQUEST MODAL
// ===================================================================
function initRLFilters() {
  const btns = document.querySelectorAll('.rl-filter-btn');
  const cards = document.querySelectorAll('#rlGrid .market-card');
  if (!btns.length) return;
  btns.forEach(btn => {
    btn.addEventListener('click', function() {
      btns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const cat = this.dataset.cat;
      cards.forEach(card => {
        card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
      });
    });
  });
}

let rlProductName = '';
function openRLRequest(productName) {
  rlProductName = productName;
  const modal = document.getElementById('rlRequestModal');
  document.getElementById('rlModalTitle').textContent = productName;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function closeRLRequest() {
  document.getElementById('rlRequestModal').style.display = 'none';
  document.body.style.overflow = '';
}
function submitRLRequest() {
  const name = document.getElementById('rlName').value.trim();
  const email = document.getElementById('rlEmail').value.trim();
  if (!name || !email) { alert('Please enter your name and email.'); return; }
  const data = {
    product: rlProductName,
    name,
    email,
    phone: document.getElementById('rlPhone').value,
    message: document.getElementById('rlMessage').value
  };
  // Backend-ready stub — replace with fetch('/api/marketplace-request', ...)
  submitMarketplaceRequest(data);
  closeRLRequest();
  // Show confirmation
  const conf = document.createElement('div');
  conf.style.cssText = 'position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:#0B2351;border:1px solid rgba(37,99,235,.3);border-radius:12px;padding:14px 24px;font-size:14px;color:#fff;z-index:1001;box-shadow:0 8px 28px rgba(0,0,0,.4);font-family:var(--font-head)';
  conf.textContent = 'Request submitted. We will contact you within 24 hours.';
  document.body.appendChild(conf);
  setTimeout(() => conf.remove(), 4000);
}

// Re-init on DOMContentLoaded (already called below, patched here)
document.addEventListener('DOMContentLoaded', initRLFilters);

// ===================================================================
// MOBILE NAV DRAWER
// ===================================================================
function toggleMobMenu() {
  const btn     = document.getElementById('mobMenuBtn');
  const drawer  = document.getElementById('mobDrawer');
  const overlay = document.getElementById('mobOverlay');
  if (!drawer) return;

  const isOpen = drawer.classList.contains('open');
  if (isOpen) {
    closeMobMenu();
  } else {
    if (overlay) { overlay.style.display = 'block'; }
    requestAnimationFrame(() => {
      drawer.classList.add('open');
      overlay && overlay.classList.add('visible');
      btn && btn.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }
}

function closeMobMenu() {
  const btn     = document.getElementById('mobMenuBtn');
  const drawer  = document.getElementById('mobDrawer');
  const overlay = document.getElementById('mobOverlay');
  if (!drawer) return;
  drawer.classList.remove('open');
  overlay && overlay.classList.remove('visible');
  btn && btn.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { if (overlay) overlay.style.display = 'none'; }, 290);
}

// Close drawer on ESC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMobMenu();
});

// showPage now handles drawer close internally (see top of file)

// Ready to Launch secondary platform/type filters
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    const catBtns = document.querySelectorAll('.rl-filter-btn');
    const typeBtns = document.querySelectorAll('.rl-subfilter-btn');
    const cards = document.querySelectorAll('#rlGrid .market-card');

    let activeCat = 'all';
    let activeType = 'all';

    function applyRLFilters(){
      cards.forEach(card => {
        const cat = card.dataset.cat || '';
        const types = (card.dataset.type || '').split(/\s+/);
        const catOk = activeCat === 'all' || cat === activeCat;
        const typeOk = activeType === 'all' || types.includes(activeType);
        card.style.display = catOk && typeOk ? '' : 'none';
      });
    }

    catBtns.forEach(btn => {
      btn.addEventListener('click', function(){
        activeCat = this.dataset.cat || 'all';
        typeBtns.forEach(b => b.classList.remove('active'));
        const allType = document.querySelector('.rl-subfilter-btn[data-type="all"]');
        if (allType) allType.classList.add('active');
        activeType = 'all';
        applyRLFilters();
      });
    });

    typeBtns.forEach(btn => {
      btn.addEventListener('click', function(){
        typeBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        activeType = this.dataset.type || 'all';
        applyRLFilters();
      });
    });
  });
})();

// Ready-to-Launch dropdown type filter
document.addEventListener('DOMContentLoaded', function(){
  const toggle = document.getElementById('rlFilterToggle');
  const menu = document.getElementById('rlFilterMenu');
  const typeButtons = menu ? menu.querySelectorAll('button[data-type]') : [];
  const catButtons = document.querySelectorAll('.rl-filter-btn');
  const cards = document.querySelectorAll('#rlGrid .market-card');

  if (!toggle || !menu || !cards.length) return;

  let activeType = 'all';

  function getActiveCat(){
    const active = document.querySelector('.rl-filter-btn.active');
    return active ? active.dataset.cat : 'all';
  }

  function applyReadyLaunchFilters(){
    const activeCat = getActiveCat();

    cards.forEach(card => {
      const cat = card.dataset.cat || '';
      const types = (card.dataset.type || '').split(/\s+/);
      const catOk = activeCat === 'all' || cat === activeCat;
      const typeOk = activeType === 'all' || types.includes(activeType);
      card.style.display = catOk && typeOk ? '' : 'none';
    });
  }

  toggle.addEventListener('click', function(e){
    e.stopPropagation();
    menu.classList.toggle('open');
  });

  typeButtons.forEach(btn => {
    btn.addEventListener('click', function(){
      activeType = this.dataset.type || 'all';
      toggle.textContent = 'Filter: ' + this.textContent + ' ▾';
      menu.classList.remove('open');
      applyReadyLaunchFilters();
    });
  });

  catButtons.forEach(btn => {
    btn.addEventListener('click', function(){
      setTimeout(applyReadyLaunchFilters, 20);
    });
  });

  document.addEventListener('click', function(){
    menu.classList.remove('open');
  });
});

// Public blog loader from Supabase API
document.addEventListener('DOMContentLoaded', loadPublicBlogPosts);

async function loadPublicBlogPosts() {
  const grids = document.querySelectorAll('#publicBlogGrid');
  const grid = grids[grids.length - 1];
  if (grid && grid.textContent.includes('Loading articles')) grid.style.opacity = '0.25';
  if (!grid) return;

  try {
    const res = await fetch('/api/public/blog');
    const data = await res.json();

    const posts = data.posts || data || [];

    if (!Array.isArray(posts) || posts.length === 0) {
      grid.innerHTML = '<div class="blog-card"><div class="blog-body"><h3>No articles published yet</h3><p>New MBDTECH LTD articles will appear here soon.</p></div></div>';
      return;
    }

    grid.style.opacity = '1';
    grid.innerHTML = posts.map(post => {
      const title = post.title || 'Untitled Article';
      const excerpt = post.excerpt || post.seo_description || post.description || '';
      const category = post.category || 'Article';
      const slug = post.slug || '';
      const image = post.cover_image_url || post.image_url || '';
      const date = post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { month:'short', year:'numeric' }) : '';

      return `
        <div class="blog-card" data-cat="${category.toLowerCase().replace(/\\s+/g,'-')}">
          <div class="blog-img" style="${image ? `background-image:url('${image}');background-size:cover;background-position:center;` : 'background:linear-gradient(135deg,#071A3D,#1E3A8A);'}"></div>
          <div class="blog-body">
            <div class="blog-meta"><span class="blog-cat">${category}</span><span class="blog-date">${date}</span></div>
            <h3>${title}</h3>
            <p>${excerpt}</p>
            <a class="blog-read" href="/article.html?slug=${encodeURIComponent(slug)}">Read Article →</a>
          </div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.blog-card').forEach(card => {
      const link = card.querySelector('.blog-read');
      if (link) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => { window.location.href = link.href; });
      }
    });

    window.mbdBlogCardsReady = true;
    applyBlogCategoryFilter();

  } catch (err) {
    console.error('Blog load error:', err);
    grid.innerHTML = '<div class="blog-card"><div class="blog-body"><h3>Unable to load articles</h3><p>Please try again later.</p></div></div>';
  }
}


// Dynamic blog category filters
let mbdActiveBlogCategory = 'all';

function normBlogCat(v) {
  let x = String(v || '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const map = {
    'app-development': 'app-dev',
    'ai-technology': 'ai',
    'startup-ideas': 'startup',
    'app-monetization': 'monetization',
    'ui-ux-design': 'uiux',
    'ui-ux': 'uiux'
  };
  return map[x] || x;
}

function applyBlogCategoryFilter() {
  const grid = document.getElementById('publicBlogGrid');
  if (!grid) return;

  grid.querySelectorAll('.blog-card').forEach(card => {
    const cardCat = normBlogCat(card.getAttribute('data-cat'));
    const active = normBlogCat(mbdActiveBlogCategory);
    card.style.display = active === 'all' || cardCat === active ? '' : 'none';
  });
}

document.addEventListener('click', function(e){
  const btn = e.target.closest('.blog-filter-btn, .blog-cat-btn, [data-blog-cat]');
  if (!btn) return;

  const cat = btn.dataset.blogCat || btn.dataset.cat || btn.textContent.trim();
  mbdActiveBlogCategory = cat === 'All' || cat === 'All Articles' ? 'all' : cat;

  document.querySelectorAll('.blog-filter-btn, .blog-cat-btn, [data-blog-cat]').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  applyBlogCategoryFilter();
});

// Dynamic Portfolio loader from Admin Listings API
document.addEventListener('DOMContentLoaded', loadDynamicPortfolio);

async function loadDynamicPortfolio() {
  const grid = document.getElementById('portfolioGrid');
  if (!grid) return;

  try {
    const res = await fetch('/api/admin/listings');
    const data = await res.json();
    const listings = data.listings || [];

    const portfolioItems = listings.filter(item => {
      const cat = String(item.category || '').toLowerCase();
      const status = String(item.status || '').toLowerCase();
      return status === 'active' && cat.startsWith('portfolio');
    });

    if (!portfolioItems.length) return; // keep existing static portfolio as fallback

    grid.innerHTML = portfolioItems.map(item => {
      const title = item.title || 'Project';
      const desc = item.short_desc || item.description || '';
      const category = item.category || 'Project';
      const demo = item.demo_url || item.url || '#';
      const isPlayStoreLink = String(demo || '').includes('play.google.com');
    const image = item.image_url || item.cover_image_url || mbdAutoListingImage(item) || (isPlayStoreLink ? '' : getDomainThumbnail(demo)) || '';
      const catKey = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      return `
        <div class="portfolio-card portfolio-locked" data-cat="${catKey}" data-locked="true" onclick="event.preventDefault(); event.stopPropagation(); return false;">
          <div class="portfolio-img" style="${image ? `background-image:url('${image}');background-size:cover;background-position:center;` : 'background:linear-gradient(135deg,#071A3D,#1E3A8A);'}">
            <span class="portfolio-badge">${category}</span>
          </div>
          <div class="portfolio-body">
            <div class="portfolio-tech">
              <span class="tech-tag">${category}</span>
              <span class="tech-tag">MBDTECH LTD</span>
            </div>
            <h3>${title}</h3>
            <p>${desc}</p>
            <button class="btn btn-outline" onclick="window.open('${demo}','_blank')">View Case Study →</button>
          </div>
        </div>
      `;
    }).join('');

  } catch (err) {
    console.warn('Portfolio dynamic load failed; using static fallback.', err);
  }
}

// Dynamic Marketplace + Ready To Launch loader from Admin Listings API
document.addEventListener('DOMContentLoaded', loadDynamicListingSections);

async function loadDynamicListingSections() {
  try {
    const res = await fetch('/api/admin/listings');
    const data = await res.json();
    const listings = data.listings || [];
    window.__MBD_LISTINGS__ = window.__MBD_LISTINGS__ || {};
    listings.forEach(item => {
      const key = item.id || item.slug || String(item.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (key) window.__MBD_LISTINGS__[key] = item;
    });

    renderListingGrid('marketplaceGrid', listings, 'ready to launch');
    renderListingGrid('rlGrid', listings, 'ready to launch');
    renderListingDetailPage(listings);
  } catch (err) {
    console.warn('Dynamic listing sections failed; using static fallback.', err);
  }
}


function getListingSlug(item) {
  return item.id || item.slug || String(item.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function renderListingDetailPage(listings) {
  const wrap = document.getElementById('listingDetailPage');
  if (!wrap) return;

  const params = new URLSearchParams(window.location.search);
  const slug = (params.get('slug') || decodeURIComponent(window.location.pathname.split('/ready-to-launch/')[1] || '')).replace(/\/$/, '');
  const item = (listings || []).find(x => String(getListingSlug(x)) === slug);

  if (!item) {
    wrap.innerHTML = `<div style="background:white;border-radius:18px;padding:34px;box-shadow:0 10px 30px rgba(15,23,42,.08);"><h1 style="font-size:28px;margin-bottom:10px;">Listing not found</h1><p style="color:#64748B;">This ready-to-launch product may have been removed or is not published.</p><button class="btn btn-primary" onclick="showPage('readylaunch')">Back to Ready-to-Launch</button></div>`;
    return;
  }

  const platformMap = { ios: 'iOS App', android: 'Android App', ios_android: 'iOS + Android App', web: 'Web App' };
  const platformLabel = platformMap[item.platform] || 'Digital Product';
  const saleStatus = item.sale_status === 'sold_out' ? 'Sold Out' : 'Live';
  const statusColor = item.sale_status === 'sold_out' ? '#DC2626' : '#16A34A';
  if (item.sale_status === 'sold_out') {
    wrap.innerHTML = `
      <div style="background:white;border-radius:18px;padding:34px;box-shadow:0 10px 30px rgba(15,23,42,.08);text-align:center;">
        <h1 style="font-size:28px;margin-bottom:10px;">Sold Out</h1>
        <p style="color:#64748B;line-height:1.7;">This product has been sold and its details are locked.</p>
        <a href="/ready-to-launch" class="btn btn-primary" style="text-decoration:none;">Back to Ready-to-Launch</a>
      </div>
    `;
    return;
  }

  const currency = item.earning_currency || 'USD';
  let monthlyEarningNum = Number(item.monthly_earning || 0);
  let historyRows = [];
  try { historyRows = Array.isArray(item.earning_history_json) ? item.earning_history_json : JSON.parse(item.earning_history_json || '[]'); } catch(_) { historyRows = []; }
  const months = (historyRows.length ? historyRows : [
    { month: 'Month 1', earning: item.earning_month_1, cost: item.cost_month_1 },
    { month: 'Month 2', earning: item.earning_month_2, cost: item.cost_month_2 },
    { month: 'Month 3', earning: item.earning_month_3, cost: item.cost_month_3 },
    { month: 'Month 4', earning: item.earning_month_4, cost: item.cost_month_4 },
    { month: 'Month 5', earning: item.earning_month_5, cost: item.cost_month_5 },
    { month: 'Month 6', earning: item.earning_month_6, cost: item.cost_month_6 },
  ]).map((m,i) => ({ label: m.month || m.label || ('Month ' + (i+1)), earning: m.earning, cost: m.cost })).filter(m => Number(m.earning) || Number(m.cost));

  const totalEarning = months.reduce((s,m)=>s+Number(m.earning || 0),0);
  const totalCost = months.reduce((s,m)=>s+Number(m.cost || 0),0);
  if (months.length) monthlyEarningNum = Math.round(totalEarning / months.length);
  const monthlyCostNum = months.length ? Math.round(totalCost / months.length) : Number(item.monthly_cost || 0);
  const monthlyProfitNum = months.length ? Math.round((totalEarning - totalCost) / months.length) : (monthlyEarningNum - monthlyCostNum);
  const earning = monthlyEarningNum ? `${currency} ${monthlyEarningNum}/mo` : 'Available on request';
  const monthlyCost = monthlyCostNum ? `${currency} ${monthlyCostNum}/mo` : 'Available on request';
  const monthlyProfit = monthlyEarningNum ? `${currency} ${monthlyProfitNum}/mo` : 'Available on request';

  const rows = months.map((m, i) => {
    const earn = Number(m.earning || 0);
    const cost = Number(m.cost || 0);
    const label = m.label || m.month || `Month ${i + 1}`;
    return { label, earn, cost, profit: earn - cost };
  }).filter(r => r.earn > 0 || r.cost > 0);

  const bars = rows.length ? rows.map(r => `
    <div style="width:260px;min-width:220px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:18px;padding:18px;">
      <div style="font-size:13px;font-weight:900;color:#1E293B;margin-bottom:12px;">${r.label}</div>
      <div style="display:grid;gap:8px;font-size:14px;color:#334155;">
        <div style="display:flex;justify-content:space-between;"><span>Earning</span><b style="color:#2563EB">${currency} ${r.earn}</b></div>
        <div style="display:flex;justify-content:space-between;"><span>Cost</span><b style="color:#F97316">${currency} ${r.cost}</b></div>
        <div style="display:flex;justify-content:space-between;"><span>Profit</span><b style="color:#16A34A">${currency} ${r.profit}</b></div>
      </div>
    </div>`).join('') : `<div style="color:#64748B;font-size:14px;">Earning and cost history will be shared with serious buyers.</div>`;

  const contactWhatsapp = item.contact_whatsapp || '+447462059140';
  const contactTelegram = item.contact_telegram || '@Mbdtech_Ltd';
  const contactEmail = item.contact_email || 'mbdtechltd.uk@gmail.com';
  const whatsappLink = `https://wa.me/${String(contactWhatsapp).replace(/[^0-9]/g,'')}`;
  const telegramLink = `https://t.me/${String(contactTelegram).replace('@','')}`;
  const emailLink = `mailto:${contactEmail}?subject=Ready-to-Launch App Purchase Inquiry - ${encodeURIComponent(item.title || 'Listing')}`;
  const cleanCat = String(item.category || 'Ready To Launch').replace(/^Marketplace\s*—\s*/i, '').replace(/^Ready To Launch\s*—\s*/i, '');
  const image = item.image_url || '';
  const demo = item.demo_url || '#';
  const price = item.price_from ? `From $${item.price_from}` : 'Contact for price';

  document.title = item.seo_title || `${item.title || 'Ready-to-Launch App'} | MBDTECH LTD`;
  let meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', item.seo_description || item.short_desc || item.description || '');

  wrap.innerHTML = `
    <div style="display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:28px;align-items:start;">
      <div>
        <a href="/ready-to-launch" class="listing-back-btn" style="display:inline-block;text-decoration:none;color:#2563EB;font-weight:800;margin-bottom:18px;cursor:pointer;">← Back to Ready-to-Launch</a>
        <div style="background:white;border-radius:22px;padding:34px;box-shadow:0 12px 34px rgba(15,23,42,.08);border:1px solid #E2E8F0;">
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px;">
            <span style="font-size:12px;font-weight:900;color:#2563EB;text-transform:uppercase;">${cleanCat} • ${platformLabel}</span>
            <span style="font-size:11px;font-weight:900;padding:5px 11px;border-radius:999px;background:${statusColor};color:#fff;">${saleStatus}</span>
          </div>
          <h1 style="font-size:38px;line-height:1.12;margin:0 0 14px;color:#0F172A;letter-spacing:-1px;">${item.title || 'Ready-to-Launch Product'}</h1>
          <p style="font-size:16px;color:#475569;line-height:1.8;margin:0 0 28px;">${item.description || item.short_desc || 'Professional MBDTECH LTD digital product ready for deployment.'}</p>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,260px));gap:14px;margin-bottom:26px;justify-content:start;">
            <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:16px;padding:16px;"><div style="font-size:11px;color:#64748B;font-weight:900;text-transform:uppercase;">Monthly Earning</div><div style="font-size:22px;font-weight:900;color:#0F172A;margin-top:7px;">${earning}</div></div>
            <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:16px;padding:16px;"><div style="font-size:11px;color:#64748B;font-weight:900;text-transform:uppercase;">Monthly Cost</div><div style="font-size:22px;font-weight:900;color:#0F172A;margin-top:7px;">${monthlyCost}</div></div>
            <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:16px;padding:16px;"><div style="font-size:11px;color:#166534;font-weight:900;text-transform:uppercase;">Net Profit</div><div style="font-size:22px;font-weight:900;color:#166534;margin-top:7px;">${monthlyProfit}</div></div>
            <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:16px;padding:16px;"><div style="font-size:11px;color:#64748B;font-weight:900;text-transform:uppercase;">Monetization</div><div style="font-size:15px;font-weight:800;color:#0F172A;margin-top:7px;">${item.monetization || 'Available on request'}</div></div>
            <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:16px;padding:16px;"><div style="font-size:11px;color:#64748B;font-weight:900;text-transform:uppercase;">Payment Methods</div><div style="font-size:15px;font-weight:800;color:#0F172A;margin-top:7px;">${item.payment_methods || 'PayPal, Crypto, Bank Transfer'}</div></div>
          </div>

          <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:18px;padding:20px;margin-bottom:26px;">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:18px;">
              <h2 style="font-size:18px;margin:0;color:#0F172A;">Earning Performance</h2>
              <div style="display:flex;gap:10px;flex-wrap:wrap;font-size:11px;font-weight:800;color:#64748B;">
                <span>Blue: Earning</span><span>Orange: Cost</span><span>Green: Profit</span>
              </div>
            </div>
            <div style="display:flex;gap:14px;flex-wrap:wrap;padding:12px 0;">${bars}</div>
          </div>

          <div id="listingContactBox" style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:18px;padding:20px;">
            <h2 style="font-size:22px;margin:0 0 12px;color:#0F172A;">Purchase & Contact</h2>
            <p style="color:#475569;line-height:1.8;margin-bottom:14px;">Interested buyers can contact MBDTECH LTD for ownership transfer, customisation, deployment support, and payment details.</p>
            <div style="display:flex;flex-wrap:wrap;gap:10px;">
              <a class="btn btn-primary" style="text-decoration:none;" target="_blank" rel="noopener" href="${whatsappLink}">WhatsApp</a>
              <a class="btn btn-outline" style="text-decoration:none;" target="_blank" rel="noopener" href="${telegramLink}">Telegram</a>
              <a class="btn btn-outline" style="text-decoration:none;" href="${emailLink}">Email</a>
            </div>
          </div>
        </div>
      </div>

      <aside style="position:sticky;top:96px;background:white;border:1px solid #E2E8F0;border-radius:22px;box-shadow:0 12px 34px rgba(15,23,42,.08);overflow:hidden;">
        ${image ? `<div style="height:230px;background-image:url('${image}');background-size:cover;background-position:center;"></div>` : `<div style="height:230px;background:linear-gradient(135deg,#0F2D64,#1E5AA8);"></div>`}
        <div style="padding:22px;">
          <div style="font-size:13px;color:#64748B;font-weight:800;">${platformLabel}</div>
          <h3 style="font-size:20px;margin:6px 0 12px;color:#0F172A;">${item.title || 'Ready Product'}</h3>
          <div style="font-size:26px;font-weight:900;color:#0F172A;margin-bottom:16px;">${price}</div>
          <a href="${demo}" target="_blank" rel="noopener" class="btn btn-primary" style="width:100%;justify-content:center;margin-bottom:10px;text-decoration:none;">View App</a>
          <button onclick="openListingContactModal('${whatsappLink}','${telegramLink}','${emailLink}','${String(item.title || 'Listing').replace(/'/g, "\\'")}')" class="btn btn-outline" style="width:100%;justify-content:center;">Contact Us</button>
        </div>
      </aside>
    </div>
  `;
}

function openListingContactModal(whatsappLink, telegramLink, emailLink, title) {
  let modal = document.getElementById('listingContactModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'listingContactModal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.72);z-index:1200;display:flex;align-items:center;justify-content:center;padding:20px;';
    modal.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });
    document.body.appendChild(modal);
  }
  modal.innerHTML = `
    <div style="background:white;border-radius:22px;max-width:460px;width:100%;padding:26px;box-shadow:0 24px 70px rgba(15,23,42,.25);position:relative;">
      <button onclick="document.getElementById('listingContactModal').style.display='none'" style="position:absolute;top:12px;right:12px;border:0;background:#F1F5F9;border-radius:9px;width:32px;height:32px;cursor:pointer;">✕</button>
      <div style="font-size:12px;font-weight:900;color:#2563EB;text-transform:uppercase;margin-bottom:8px;">MBDTECH AI Assistant</div>
      <h3 style="font-size:24px;margin:0 0 10px;color:#0F172A;">Contact about ${title}</h3>
      <p style="color:#475569;line-height:1.7;margin:0 0 18px;">How would you like to contact MBDTECH LTD about this ready-to-launch product?</p>
      <div style="display:grid;gap:10px;">
        <a class="btn btn-primary" target="_blank" rel="noopener" href="${whatsappLink}" style="justify-content:center;text-decoration:none;">WhatsApp</a>
        <a class="btn btn-outline" target="_blank" rel="noopener" href="${telegramLink}" style="justify-content:center;text-decoration:none;">Telegram</a>
        <a class="btn btn-outline" href="${emailLink}" style="justify-content:center;text-decoration:none;">Email</a>
      </div>
    </div>`;
  modal.style.display = 'flex';
}


function initReadyLaunchFilters() {
  const grid = document.getElementById('rlGrid');
  if (!grid) return;

  const catButtons = document.querySelectorAll('.rl-filter-btn');
  const toggle = document.getElementById('rlFilterToggle');
  const menu = document.getElementById('rlFilterMenu');
  const typeButtons = menu ? menu.querySelectorAll('button[data-type]') : [];

  let activeType = 'all';

  function apply() {
    const activeCatBtn = document.querySelector('.rl-filter-btn.active');
    const activeCat = activeCatBtn ? (activeCatBtn.dataset.cat || 'all') : 'all';

    grid.querySelectorAll('.market-card').forEach(card => {
      const cat = card.dataset.cat || '';
      const type = card.dataset.type || '';
      const catOk = activeCat === 'all' || cat.includes(activeCat);
      const typeOk = activeType === 'all' || type.includes(activeType);
      card.style.display = (catOk && typeOk) ? '' : 'none';
    });
  }

  catButtons.forEach(btn => {
    if (btn.dataset.boundReady === '1') return;
    btn.dataset.boundReady = '1';
    btn.addEventListener('click', function() {
      catButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      apply();
    });
  });

  if (toggle && menu && toggle.dataset.boundReady !== '1') {
    toggle.dataset.boundReady = '1';
    toggle.addEventListener('click', function(e) {
      e.stopPropagation();
      menu.classList.toggle('open');
    });
  }

  typeButtons.forEach(btn => {
    if (btn.dataset.boundReady === '1') return;
    btn.dataset.boundReady = '1';
    btn.addEventListener('click', function() {
      activeType = this.dataset.type || 'all';
      if (toggle) toggle.textContent = 'Filter: ' + this.textContent + ' ▾';
      if (menu) menu.classList.remove('open');
      apply();
    });
  });

  apply();
}



function mbdAutoListingImage(item) {
  const text = [
    item?.title,
    item?.name,
    item?.slug,
    item?.demo_url,
    item?.app_url,
    item?.play_store_url,
    item?.store_url,
    item?.description
  ].filter(Boolean).join(" ").toLowerCase();

  if (text.includes("document") || text.includes("scanner") || text.includes("doucument")) {
    return "/assets/images/document-scanner-thumbnail.webp";
  }

  if (text.includes("voice") || text.includes("recorder") || text.includes("trimmer")) {
    return "/assets/images/voice-recorder-thumbnail.webp";
  }

  if (text.includes("travelnclear") || text.includes("travel n clear")) {
    return "/assets/images/travelnclear-thumbnail.png";
  }

  return "";
}


function getListingImageStyle(image, demo) {
  if (image) return `background-image:url('${image}');background-size:cover;background-position:center;`;

  try {
    const u = new URL(demo || '');
    if (u.hostname.includes('play.google.com')) {
      return "background:linear-gradient(135deg,#071A3D,#1E5AA8);position:relative;";
    }
  } catch (_) {}

  return 'background:linear-gradient(135deg,#0F2D64,#1E5AA8);';
}

function renderListingGrid(gridId, listings, prefix) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  const items = listings.filter(item => {
    const cat = String(item.category || '').toLowerCase();
    const status = String(item.status || '').toLowerCase();
    return status === 'active' && cat.startsWith(prefix);
  });

  if (!items.length) return; // keep static fallback

  grid.innerHTML = items.map(item => {
    const title = item.title || 'Listing';
    const desc = item.short_desc || item.description || '';
    const category = item.category || 'Listing';
    const cleanCat = category.replace(/^Marketplace\s*—\s*/i, '').replace(/^Ready To Launch\s*—\s*/i, '');
    const demo = item.demo_url || item.url || item.store_url || item.app_url || item.play_store_url || '#';
    const playStoreSource = [demo, item.demo_url, item.url, item.store_url, item.app_url, item.play_store_url].join(' ');
    const isPlayStoreLink = String(playStoreSource || '').includes('play.google.com');
    const image = item.image_url || item.cover_image_url || mbdAutoListingImage(item) || (isPlayStoreLink ? '' : getDomainThumbnail(demo)) || '';
    const price = item.price_from || '';
    const catKey = cleanCat.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const rawType = String(item.platform || item.category || cleanCat || '').toLowerCase();
    const typeKey = [
      rawType,
      rawType.includes('ios') ? 'ios' : '',
      rawType.includes('android') ? 'android' : '',
      rawType.includes('ios_android') || rawType.includes('cross') || rawType.includes('ios + android') ? 'cross' : '',
      rawType.includes('game') ? 'game' : '',
      rawType.includes('admin') ? 'admin' : '',
      rawType.includes('saas') ? 'saas' : '',
      rawType.includes('template') ? 'template' : ''
    ].filter(Boolean).join(' ');
    const id = item.id || item.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const platformMap = { ios: 'iOS App', android: 'Android App', ios_android: 'iOS + Android', web: 'Web App' };
    const platformLabel = platformMap[item.platform] || '';
    const saleStatus = item.sale_status === 'sold_out' ? 'Sold Out' : 'Live';
    const earning = item.monthly_earning ? `${item.earning_currency || 'USD'} ${item.monthly_earning}/mo` : '';

    return `
      <div class="market-card" data-cat="${catKey}" data-type="${typeKey}">
        <div class="market-img" style="${getListingImageStyle(image, demo)}">
          ${(!image && String(demo || '').includes('play.google.com')) ? '<div style="height:100%;display:flex;align-items:center;justify-content:center;color:white;font-weight:900;font-size:34px;letter-spacing:-1px;">APP</div>' : ''}
        </div>
        <div class="market-body">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:8px;">
            <div class="market-cat" style="margin:0;">${cleanCat}${platformLabel ? ' • ' + platformLabel : ''}</div>
            <span style="font-size:11px;font-weight:800;padding:4px 9px;border-radius:999px;color:#fff;background:${item.sale_status === 'sold_out' ? '#DC2626' : '#16A34A'};">${saleStatus}</span>
          </div>
          <h3>${title}</h3>
          <ul class="market-features" style="min-height:48px;">
            <li style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${desc || 'Professional MBDTECH LTD digital product'}</li>
          </ul>
          <button type="button" onclick="this.previousElementSibling.querySelector('li').style.webkitLineClamp='unset';this.style.display='none';" style="background:none;border:0;color:#1E5AA8;font-size:12px;font-weight:700;padding:0;margin:0 0 10px;cursor:pointer;">Learn More</button>
          <div class="market-price">${price ? 'From $' + price : 'Contact for price'}</div>
          <div class="market-actions">
            ${item.sale_status === 'sold_out'
  ? `<button class="btn btn-outline" style="flex:1;font-size:13px;opacity:.65;cursor:not-allowed;" disabled>Sold Out</button>`
  : `<button class="btn btn-outline" style="flex:1;font-size:13px;" type="button" onclick="window.location.href='/listing.html?slug=${encodeURIComponent(id)}'">View App</button>`
}
            <button class="btn btn-primary" style="flex:1;font-size:13px" onclick="showPage('contact')">Request</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
  if (gridId === 'rlGrid') initReadyLaunchFilters();
}


// HARD LOCK: Portfolio cards must never open
document.addEventListener('click', function(e) {
  var card = e.target.closest && e.target.closest('.portfolio-card');
  if (card && card.classList.contains('portfolio-locked')) {
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();
    return false;
  }
}, true);

// HARD LOCK: remove href/action from portfolio locked cards after render
function lockPortfolioCardsHard() {
  document.querySelectorAll('.portfolio-card.portfolio-locked').forEach(function(card) {
    card.style.cursor = 'default';
    card.querySelectorAll('a').forEach(function(a) {
      a.removeAttribute('href');
      a.removeAttribute('target');
      a.style.pointerEvents = 'none';
      a.style.cursor = 'not-allowed';
    });
    card.querySelectorAll('button').forEach(function(btn) {
      btn.disabled = true;
      btn.style.pointerEvents = 'none';
      btn.style.cursor = 'not-allowed';
      if (/view/i.test(btn.textContent || '')) btn.textContent = 'Locked';
    });
  });
}
document.addEventListener('DOMContentLoaded', lockPortfolioCardsHard);
setTimeout(lockPortfolioCardsHard, 500);
setTimeout(lockPortfolioCardsHard, 1500);

