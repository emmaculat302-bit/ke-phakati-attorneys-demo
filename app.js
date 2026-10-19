const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('.primary-nav');
const navLinks = document.querySelectorAll('.primary-nav a');
const enquirySection = document.querySelector('#enquiry');
const form = document.querySelector('#intake-form');
const formSteps = [...document.querySelectorAll('.form-step')];
const nextButton = document.querySelector('#next-button');
const backButton = document.querySelector('#back-button');
const submitButton = document.querySelector('#submit-button');
const stepCount = document.querySelector('#step-count');
const progressBar = document.querySelector('#progress-bar');
const formTitle = document.querySelector('#form-title');
const selectedMatterLabel = document.querySelector('#selected-matter-label');
const changeMatterButton = document.querySelector('#change-matter');
const successState = document.querySelector('#success-state');
const successName = document.querySelector('#success-name');
const successWhatsApp = document.querySelector('#success-whatsapp');
const successEmail = document.querySelector('#success-email');
const copyEnquiryButton = document.querySelector('#copy-enquiry');
const resetFormButton = document.querySelector('#reset-form');
const currentYear = document.querySelector('#current-year');

let currentStep = 1;
let latestEnquiryText = '';

const stepTitles = {
  1: 'What brings you here?',
  2: 'Tell us a little more',
  3: 'How can we reach you?'
};

function closeMenu() {
  if (!primaryNav || !menuToggle) return;
  primaryNav.classList.remove('is-open');
  menuToggle.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}

function scrollToEnquiry() {
  enquirySection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

menuToggle?.addEventListener('click', () => {
  const isOpen = primaryNav.classList.toggle('is-open');
  menuToggle.classList.toggle('is-open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.classList.toggle('menu-open', isOpen);
});

navLinks.forEach((link) => link.addEventListener('click', closeMenu));

function clearErrors() {
  document.querySelectorAll('.form-error').forEach((error) => {
    error.textContent = '';
  });
}

function renderStep(step) {
  currentStep = step;
  formSteps.forEach((item) => item.classList.toggle('is-active', Number(item.dataset.step) === step));
  if (stepCount) stepCount.textContent = `0${step} / 03`;
  if (progressBar) progressBar.style.width = `${step * 33.333}%`;
  if (formTitle) formTitle.textContent = stepTitles[step];
  if (backButton) backButton.hidden = step === 1;
  if (nextButton) nextButton.hidden = step === 3;
  if (submitButton) submitButton.hidden = step !== 3;
  clearErrors();
}

function getMatter() {
  return document.querySelector('input[name="matter"]:checked')?.value || '';
}

function validateStep(step) {
  clearErrors();

  if (step === 1 && !getMatter()) {
    const error = document.querySelector('[data-error-for="matter"]');
    if (error) error.textContent = 'Please choose the option that feels closest to your situation.';
    return false;
  }

  if (step === 3) {
    const name = document.querySelector('#full-name');
    const phone = document.querySelector('#phone');
    const email = document.querySelector('#email');
    const preference = document.querySelector('#contact-preference');
    const consent = document.querySelector('#consent');
    const error = document.querySelector('[data-error-for="contact"]');
    const missing = [];

    if (!name.value.trim()) missing.push('your name');
    if (!phone.value.trim()) missing.push('your phone number');
    if (!email.value.trim() || !email.validity.valid) missing.push('a valid email address');
    if (!preference.value) missing.push('a contact preference');
    if (!consent.checked) missing.push('consent to be contacted');

    if (missing.length) {
      error.textContent = `Please add ${missing.join(', ')}.`;
      return false;
    }
  }

  return true;
}

function updateSelectedMatter() {
  const matter = getMatter();
  if (selectedMatterLabel) selectedMatterLabel.textContent = matter || 'Not selected';
}

function goToStep(step) {
  if (step > currentStep && !validateStep(currentStep)) return;
  if (step === 2) updateSelectedMatter();
  renderStep(step);
}

nextButton?.addEventListener('click', () => goToStep(currentStep + 1));
backButton?.addEventListener('click', () => goToStep(currentStep - 1));
changeMatterButton?.addEventListener('click', () => {
  renderStep(1);
  document.querySelector('.matter-options')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

document.querySelectorAll('input[name="matter"]').forEach((radio) => {
  radio.addEventListener('change', updateSelectedMatter);
});

document.querySelectorAll('.matter-link').forEach((link) => {
  link.addEventListener('click', () => {
    const selectedMatter = link.dataset.matter;
    const radio = [...document.querySelectorAll('input[name="matter"]')].find((input) => input.value === selectedMatter);
    if (radio) radio.checked = true;
    updateSelectedMatter();
    renderStep(1);
    scrollToEnquiry();
    window.setTimeout(() => {
      document.querySelector('.matter-options')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 350);
  });
});

function getEnquiryData() {
  const data = new FormData(form);
  return {
    name: data.get('name')?.toString().trim() || 'there',
    phone: data.get('phone')?.toString().trim() || '',
    email: data.get('email')?.toString().trim() || '',
    matter: data.get('matter')?.toString() || 'a legal matter',
    summary: data.get('summary')?.toString().trim() || '',
    urgency: data.get('urgency')?.toString() || '',
    location: data.get('location')?.toString().trim() || '',
    preference: data.get('preference')?.toString() || ''
  };
}

function buildEnquiryText() {
  const data = getEnquiryData();
  return [
    'K E PHAKATI ATTORNEYS — INITIAL ENQUIRY',
    '',
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email}`,
    `Preferred contact: ${data.preference}`,
    `Matter: ${data.matter}`,
    data.urgency ? `Timing: ${data.urgency}` : '',
    data.location ? `Location: ${data.location}` : '',
    '',
    data.summary ? `Summary: ${data.summary}` : 'Summary: Not provided',
    '',
    'This is an initial enquiry and not legal advice.'
  ].filter(Boolean).join('\n');
}

function makeWhatsAppMessage() {
  const data = getEnquiryData();
  const lines = [
    `Hello K E Phakati Attorneys, my name is ${data.name}.`,
    `I would like to enquire about ${data.matter.toLowerCase()}.`,
    data.summary ? `A little context: ${data.summary}` : '',
    data.location ? `I am based in ${data.location}.` : '',
    data.preference ? `My preferred contact method is ${data.preference}.` : ''
  ].filter(Boolean);
  return `https://wa.me/27728632183?text=${encodeURIComponent(lines.join('\n'))}`;
}

function makeEmailDraft() {
  const data = getEnquiryData();
  const subject = `Initial legal enquiry — ${data.matter}`;
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(latestEnquiryText)}`;
}

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!validateStep(3)) return;

  const data = getEnquiryData();
  latestEnquiryText = buildEnquiryText();
  if (successName) successName.textContent = data.name.split(' ')[0];
  if (successWhatsApp) successWhatsApp.href = makeWhatsAppMessage();
  if (successEmail) successEmail.href = makeEmailDraft();
  form.hidden = true;
  successState.hidden = false;
  document.querySelector('#intake-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

copyEnquiryButton?.addEventListener('click', async () => {
  if (!latestEnquiryText) return;
  try {
    await navigator.clipboard.writeText(latestEnquiryText);
    copyEnquiryButton.textContent = 'Enquiry text copied ✓';
    window.setTimeout(() => { copyEnquiryButton.textContent = 'Copy enquiry text'; }, 2200);
  } catch (error) {
    copyEnquiryButton.textContent = 'Select the email or WhatsApp option above';
  }
});

resetFormButton?.addEventListener('click', () => {
  form.reset();
  latestEnquiryText = '';
  form.hidden = false;
  successState.hidden = true;
  if (copyEnquiryButton) copyEnquiryButton.textContent = 'Copy enquiry text';
  renderStep(1);
  updateSelectedMatter();
});

if (currentYear) currentYear.textContent = new Date().getFullYear();
renderStep(1);

// Review carousel: populated with safe placeholders until the approved Google profile copy is supplied.
const reviewSlider = document.querySelector('#review-slider');
const reviewText = document.querySelector('#review-text');
const reviewAuthor = document.querySelector('#review-author');
const reviewDate = document.querySelector('#review-date');
const reviewSource = document.querySelector('#review-source');
const reviewStars = document.querySelector('#review-stars');
const reviewDots = document.querySelector('#review-dots');
const reviewPrev = document.querySelector('#review-prev');
const reviewNext = document.querySelector('#review-next');

const reviewData = [
  {
    text: 'Approved Google review text will appear here.',
    author: 'Reviewer name or initials to be confirmed',
    date: 'Review copy pending approval',
    source: 'GOOGLE PROFILE · CONTENT PENDING'
  },
  {
    text: 'A polished review slideshow will help future clients feel more confident taking the first step.',
    author: 'Demo structure only — not a client testimonial',
    date: 'Replace with approved public review',
    source: 'GOOGLE PROFILE · DEMO COPY'
  },
  {
    text: 'Exact review text can be added here with attribution once supplied from the Google profile.',
    author: 'Reviewer name or initials to be confirmed',
    date: 'Review copy pending approval',
    source: 'GOOGLE PROFILE · CONTENT PENDING'
  }
];

let reviewIndex = 0;
let reviewTimer;

function renderReview(index, announce = true) {
  if (!reviewText || !reviewData.length) return;
  reviewIndex = (index + reviewData.length) % reviewData.length;
  const review = reviewData[reviewIndex];
  reviewText.textContent = `“${review.text}”`;
  reviewAuthor.textContent = review.author;
  reviewDate.textContent = review.date;
  reviewSource.textContent = review.source;
  reviewStars.setAttribute('aria-label', 'Rating to be verified');
  [...reviewDots.children].forEach((dot, dotIndex) => {
    dot.classList.toggle('is-active', dotIndex === reviewIndex);
    dot.setAttribute('aria-current', dotIndex === reviewIndex ? 'true' : 'false');
  });
  if (announce) reviewText.setAttribute('aria-live', 'polite');
}

function resetReviewTimer() {
  window.clearInterval(reviewTimer);
  reviewTimer = window.setInterval(() => renderReview(reviewIndex + 1, false), 7000);
}

if (reviewDots && reviewData.length) {
  reviewData.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'review-dot';
    dot.setAttribute('aria-label', `Show review ${index + 1}`);
    dot.addEventListener('click', () => {
      renderReview(index);
      resetReviewTimer();
    });
    reviewDots.appendChild(dot);
  });
}

reviewPrev?.addEventListener('click', () => {
  renderReview(reviewIndex - 1);
  resetReviewTimer();
});
reviewNext?.addEventListener('click', () => {
  renderReview(reviewIndex + 1);
  resetReviewTimer();
});
reviewSlider?.addEventListener('mouseenter', () => window.clearInterval(reviewTimer));
reviewSlider?.addEventListener('mouseleave', resetReviewTimer);
reviewSlider?.addEventListener('focusin', () => window.clearInterval(reviewTimer));
reviewSlider?.addEventListener('focusout', resetReviewTimer);
renderReview(0, false);
resetReviewTimer();
