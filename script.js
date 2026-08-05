// The Barber Shack — front-end interactivity

const SERVICES = [
  { name: "Classic Cut", price: "$28", time: "30 min", desc: "Scissor or clipper cut, styled and finished the way you like it." },
  { name: "Skin Fade", price: "$34", time: "40 min", desc: "Precision fade blended down to the skin, sharp and clean." },
  { name: "Beard Sculpt", price: "$20", time: "25 min", desc: "Line-up, shape, and trim with hot towel and beard oil." },
  { name: "Hot Towel Shave", price: "$32", time: "35 min", desc: "Traditional straight-razor shave with hot towels and aftercare." },
  { name: "Cut + Beard", price: "$44", time: "50 min", desc: "The full service — haircut and beard grooming in one sitting." },
  { name: "The Kid's Cut", price: "$18", time: "25 min", desc: "Patient, friendly cuts for the under-12 crowd." },
];

const GALLERY = [
  { label: "Textured Crop", hue: 28 },
  { label: "Low Skin Fade", hue: 200 },
  { label: "Classic Pompadour", hue: 12 },
  { label: "Full Beard Sculpt", hue: 42 },
  { label: "Slick Back", hue: 260 },
  { label: "Buzz + Line-up", hue: 150 },
];

function renderServices() {
  const grid = document.getElementById("services-grid");
  if (!grid) return;
  grid.innerHTML = SERVICES.map((s) => `
    <article class="card">
      <div class="card-top">
        <h3>${s.name}</h3>
        <span class="card-price">${s.price}</span>
      </div>
      <p>${s.desc}</p>
      <span class="card-meta">${s.time}</span>
    </article>
  `).join("");
}

function renderGallery() {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;
  grid.innerHTML = GALLERY.map((g) => `
    <div class="gallery-item" style="background:
      linear-gradient(135deg, hsl(${g.hue} 30% 22%), hsl(${g.hue} 25% 14%));">
      <span>${g.label}</span>
    </div>
  `).join("");
}

function populateServiceSelect() {
  const select = document.getElementById("service");
  if (!select) return;
  select.innerHTML = SERVICES
    .map((s) => `<option value="${s.name}">${s.name} — ${s.price}</option>`)
    .join("");
}

function setupNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
}

function setupBooking() {
  const form = document.getElementById("booking-form");
  const status = document.getElementById("form-status");
  if (!form || !status) return;

  // Prevent selecting past dates.
  const dateInput = document.getElementById("date");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.min = today;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.className = "form-status";

    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const date = form.date.value;

    if (!name || !phone || !date) {
      status.textContent = "Please fill in your name, phone, and preferred date.";
      status.classList.add("err");
      return;
    }
    if (!/^[+()\-\s\d]{7,}$/.test(phone)) {
      status.textContent = "That phone number doesn't look right — mind checking it?";
      status.classList.add("err");
      return;
    }

    const service = form.service.value;
    status.textContent = `Thanks, ${name}! We'll text you to confirm your ${service} on ${date}.`;
    status.classList.add("ok");
    form.reset();
    if (dateInput) dateInput.min = new Date().toISOString().split("T")[0];
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderServices();
  renderGallery();
  populateServiceSelect();
  setupNav();
  setupBooking();
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});
