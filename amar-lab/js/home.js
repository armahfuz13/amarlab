// Home page logic for Amar Lab
//
// This script powers the home page interactions:
//  - Handles the search form submission and redirects to the equipment library
//    with the user's query.
//  - Displays a random selection of featured equipment on the home page.
//  - Shows a "continue quiz" section if there is saved quiz state in
//    localStorage.
//
// We embed a lightweight version of the equipment dataset here with only
// the fields needed on the home page. If you add or remove equipment in
// the main dataset, be sure to update this list as well.

const HOME_EQUIPMENT = [
  {"id":"beaker","name_bn":"বীকার","name_en":"Beaker","categories":["biology","physics","chemistry"],"image":"assets/images/beaker.jpg"},
  {"id":"test-tube","name_bn":"টেস্ট টিউব","name_en":"Test Tube","categories":["chemistry","biology"],"image":"assets/images/test-tube.jpg"},
  {"id":"pipette","name_bn":"পিপেট","name_en":"Pipette","categories":["chemistry","biology"],"image":"assets/images/pipette.jpg"},
  {"id":"bunsen-burner","name_bn":"বুনসেন বার্নার","name_en":"Bunsen Burner","categories":["chemistry","physics"],"image":"assets/images/bunsen-burner.jpg"},
  {"id":"volumetric-flask","name_bn":"ভলিউমেট্রিক ফ্লাস্ক","name_en":"Volumetric Flask","categories":["chemistry"],"image":"assets/images/volumetric-flask.jpg"},
  {"id":"microscope","name_bn":"মাইক্রোস্কোপ","name_en":"Microscope","categories":["biology","physics"],"image":"assets/images/microscope.jpg"},
  {"id":"thermometer","name_bn":"থার্মোমিটার","name_en":"Thermometer","categories":["physics","chemistry","biology"],"image":"assets/images/thermometer.jpg"},
  {"id":"balance","name_bn":"ব্যালান্স","name_en":"Balance","categories":["physics","chemistry"],"image":"assets/images/balance.jpg"},
  {"id":"watch-glass","name_bn":"ওয়াচ গ্লাস","name_en":"Watch Glass","categories":["chemistry"],"image":"assets/images/watch-glass.jpg"},
  {"id":"test-tube-holder","name_bn":"টেস্ট টিউব হোল্ডার","name_en":"Test Tube Holder","categories":["chemistry","biology"],"image":"assets/images/test-tube-holder.jpg"},
  {"id":"safety-goggles","name_bn":"নিরাপত্তা গগলস","name_en":"Safety Goggles","categories":["chemistry","biology","physics"],"image":"assets/images/safety-goggles.jpg"},
  {"id":"funnel","name_bn":"ফানেল","name_en":"Funnel","categories":["chemistry","biology"],"image":"assets/images/funnel.jpg"},
  {"id":"petri-dish","name_bn":"পেট্রি ডিশ","name_en":"Petri Dish","categories":["biology","chemistry"],"image":"assets/images/petri-dish.jpg"},
  {"id":"graduated-cylinder","name_bn":"গ্র্যাজুয়েটেড সিলিন্ডার","name_en":"Graduated Cylinder","categories":["chemistry","physics"],"image":"assets/images/graduated-cylinder.jpg"},
  {"id":"dropper","name_bn":"ড্রপার","name_en":"Dropper","categories":["chemistry","biology"],"image":"assets/images/dropper.jpg"},
  {"id":"centrifuge","name_bn":"সেন্ট্রিফিউজ","name_en":"Centrifuge","categories":["biology","chemistry"],"image":"assets/images/centrifuge.jpg"},
  {"id":"pH-meter","name_bn":"পিএইচ মিটার","name_en":"pH Meter","categories":["chemistry","biology"],"image":"assets/images/pH-meter.jpg"},
  {"id":"slide-and-cover-slip","name_bn":"স্লাইড ও কভার স্লিপ","name_en":"Slide and Cover Slip","categories":["biology"],"image":"assets/images/slide-and-cover-slip.jpg"}
];

/** Select n random unique items from an array */
function getRandomItems(arr, n) {
  const copy = arr.slice();
  const result = [];
  const max = Math.min(n, copy.length);
  for (let i = 0; i < max; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

document.addEventListener('DOMContentLoaded', () => {
  // Handle search form submission: redirect to equipment page with query
  const searchForm = document.getElementById('homepageSearchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('homepageSearch');
      if (!input) return;
      const q = input.value.trim();
      if (q) {
        location.href = `equipment.html?query=${encodeURIComponent(q)}`;
      } else {
        // If empty search, go to equipment page without query
        location.href = 'equipment.html';
      }
    });
  }

  // Render random equipment for the "today" section
  const todayContainer = document.getElementById('todayContainer');
  if (todayContainer) {
    const items = getRandomItems(HOME_EQUIPMENT, 2);
    items.forEach(item => {
      const article = document.createElement('article');
      article.className = 'card equip-card';
      // Thumbnail: show image if available, fallback to emoji placeholder
      const thumb = document.createElement('div');
      thumb.className = 'thumb';
      if (item.image) {
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = '';
        thumb.appendChild(img);
      } else {
        thumb.textContent = '🔬';
      }
      article.appendChild(thumb);

      const meta = document.createElement('div');
      meta.className = 'equip-meta';
      const title = document.createElement('h3');
      title.innerHTML = `${item.name_bn} <span class="muted small">(${item.name_en})</span>`;
      meta.appendChild(title);
      // Show the first category as an English tag (capitalize first letter)
      const cat = (item.categories && item.categories.length) ? item.categories[0] : '';
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
      meta.appendChild(tag);
      article.appendChild(meta);

      const btn = document.createElement('a');
      btn.className = 'btn btn-small';
      btn.href = `equipment-detail.html?id=${item.id}`;
      btn.textContent = 'দেখুন';
      article.appendChild(btn);

      todayContainer.appendChild(article);
    });
  }

  // Handle continue quiz section visibility
  const contSec = document.getElementById('continueSection');
  if (contSec) {
    const hasWrong = localStorage.getItem('quizWrongOnly');
    if (hasWrong) {
      contSec.classList.remove('hidden');
      // button inside section triggers wrong-only quiz mode by navigating to quiz
      const link = contSec.querySelector('a');
      if (link) {
        link.addEventListener('click', (e) => {
          // For now, simply navigate to quiz page. The quiz page will handle wrong-only logic if implemented.
          e.preventDefault();
          location.href = 'quiz.html';
        });
      }
    } else {
      contSec.classList.add('hidden');
    }
  }
});