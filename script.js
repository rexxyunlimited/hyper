// Wait until DOM is ready
document.addEventListener("DOMContentLoaded", function () {

  // === Countdown Timer ===
  function countdown() {
    const offerDate = new Date("2026-01-31T23:59:59");
    const now = new Date();
    const diff = offerDate - now;

    if (diff <= 0) {
      document.getElementById("countdown").textContent = "Offer ended!";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    const countdownElement = document.getElementById("countdown");
    if (countdownElement) {
      countdownElement.innerHTML = `${days}d ${hours}h ${mins}m ${secs}s`;
    }
  }
  setInterval(countdown, 1000);
  countdown(); // run immediately


  // === Smooth Scroll to Form ===
  document.querySelectorAll('a[href="#order-form"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const formSection = document.querySelector('#order-form');
      formSection.scrollIntoView({ behavior: 'smooth' });
    });
  });


  // === Sticky CTA Visibility Logic ===
  window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const cta = document.querySelector('#sticky-cta');
    if (hero && cta) {
      const scrollY = window.scrollY;
      cta.style.display = scrollY > hero.offsetHeight ? 'block' : 'none';
    }
  });


  // === FAQ Accordion ===
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      item.classList.toggle('active');
    });
  });


  // === Fake Order Notification ===
  const fakeOrders = [
  "Fatima from Kano reordered this morning!",
  "⏳ OFFER ENDING SOON Today’s deal ends shortly. Order now.",
  "🛡️ 30-Day Satisfaction Guarantee Try HYPERCURE risk-free.",
  "✅ Order received from Ogbomosho",
  "Mary from Lagos just ordered two bottles!",
  "Ahmed from Abuja placed an order!",
  "Chinwe from Enugu bought 2 packs!",
  "Tolu from Ibadan just ordered the complete pack!",
  "✅ A customer in Lagos just ordered HYPERCURE",
  "🔔 New order received from Awka",
  "✅ Someone in Uyo purchased HYPERCURE"
  ];

  const fakePopup = document.getElementById('fake-order-popup');
  function showFakeOrder() {
    if (!fakePopup) return;
    fakePopup.textContent = fakeOrders[Math.floor(Math.random() * fakeOrders.length)];
    fakePopup.style.opacity = '1';
    setTimeout(() => {
      fakePopup.style.opacity = '0';
    }, 5000);
  }
  setInterval(showFakeOrder, 25000); // every 25 seconds


  // === Fake Comment Submit Toast ===
  const sendBtn = document.getElementById('send-comment');
  const input = document.getElementById('comment-input');
  const toast = document.getElementById('comment-toast');

  if (sendBtn && input && toast) {
    sendBtn.addEventListener('click', () => {
      if (input.value.trim() !== '') {
        toast.style.display = 'block';
        input.value = '';
        setTimeout(() => {
          toast.style.display = 'none';
        }, 3000);
      }
    });
  }


  // === EXIT POPUP (Mobile + Desktop Friendly) ===
  let popupVisible = false;
  const exitPopup = document.getElementById('exit-popup');
  const skipPopup = document.getElementById('skip-popup');
  const popupForm = document.getElementById('popupForm');

  function showPopup() {
    if (!popupVisible && exitPopup) {
      popupVisible = true;
      exitPopup.style.display = 'flex';
    }
  }

  // === 1️⃣ Show when user presses back button ===
  (function handleBackButton() {
    // Push fake history entry so pressing back first triggers popup
    history.pushState(null, null, location.href);
    window.addEventListener('popstate', function () {
      showPopup();
      // Push state again so user must press back twice to leave
      history.pushState(null, null, location.href);
    });
  })();


  // === 2️⃣ Show when user switches away or minimizes ===
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      showPopup();
    }
  });

  // === 3️⃣ Show after 25 seconds of inactivity AND 1 minute total ===
  let idleTimer;
  let totalIdleTimer;

  function resetIdleTimers() {
    clearTimeout(idleTimer);
    clearTimeout(totalIdleTimer);

    // 25 seconds of inactivity
    idleTimer = setTimeout(() => {
      showPopup();
    }, 45000);

    // 1 minute total inactivity (no matter what)
    totalIdleTimer = setTimeout(() => {
      showPopup();
    }, 120000);
  }

  ['scroll', 'touchstart', 'mousemove', 'keydown', 'click'].forEach(evt =>
    document.addEventListener(evt, resetIdleTimers)
  );
  resetIdleTimers();


  // === Close popup ===
  if (skipPopup) {
    skipPopup.addEventListener('click', () => {
      exitPopup.style.display = 'none';
    });
  }

  // === Handle popup form submit ===
  if (popupForm) {
    popupForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const phone = document.getElementById('popup-phone').value.trim();
      const phoneRegex = /^\d{11}$/;

      if (!phoneRegex.test(phone)) {
        alert("Phone number must be exactly 11 digits.");
        return;
      }

      const response = await fetch(this.action, {
        method: this.method,
        body: new FormData(this),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        alert("✅ Thank you! Your free BP PDF will be sent shortly.");
        exitPopup.style.display = 'none';
      } else {
        alert("Something went wrong. Please try again.");
      }
    });
  }

}); // END DOMContentLoaded

