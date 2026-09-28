"use strict";

// ---- DOM selection method #1: getElementById ----
const showBtn = document.getElementById("showBtn");
const clearBtn = document.getElementById("clearBtn");
const outputEl = document.getElementById("output");

// ---- DOM selection method #2: querySelector ----
const form = document.querySelector("#infoForm");


function escapeHTML(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}


function colorToCss(name) {
  const map = {
    Red: "#ef4444",
    Green: "#22c55e",
    Blue: "#3b82f6",
    Purple: "#a855f7"
  };
  return map[name] || "#94a3b8";
}

function getSelectedColor() {
  const radios = document.getElementsByName("favColor");
  for (let i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      return radios[i].value;
    }
  }
  return "";
}


function collectFormData() {
  return {
    fullName: document.getElementById("fullName").value.trim(),
    email: document.getElementById("email").value.trim(),
    age: document.getElementById("age").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    birthday: document.getElementById("birthday").value,
    country: document.querySelector("#country").value,
    website: document.getElementById("website").value.trim(),
    favColor: getSelectedColor(),
    bio: document.getElementById("bio").value.trim(),
    consent: document.getElementById("consent").checked
  };
}


function display(value) {
  if (value === "" || value === null || value === undefined) {
    return '<span class="info-value" style="color:#94a3b8">— not provided —</span>';
  }
  return '<span class="info-value">' + escapeHTML(String(value)) + "</span>";
}


function getInitials(name) {
  if (!name) return "?";
  const parts = name.split(/\s+/).filter(Boolean);
  const first = parts[0] ? parts[0][0] : "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase() || "?";
}

function renderCard() {
  const data = collectFormData();

  const websiteDisplay = data.website
    ? '<a class="link" href="' + escapeHTML(data.website) + '" target="_blank" rel="noopener">' +
      escapeHTML(data.website) + "</a>"
    : '<span class="info-value" style="color:#94a3b8">— not provided —</span>';

  const colorDisplay = data.favColor
    ? '<span class="info-value"><span class="color-dot" style="background:' +
      colorToCss(data.favColor) + '"></span>' + escapeHTML(data.favColor) + "</span>"
    : display("");

  outputEl.classList.remove("card--empty");
  outputEl.innerHTML =
    '<div class="card__banner">' +
      '<div class="card__avatar">' + escapeHTML(getInitials(data.fullName)) + "</div>" +
      "<div>" +
        '<p class="card__name">' + (data.fullName ? escapeHTML(data.fullName) : "Anonymous User") + "</p>" +
        '<p class="card__email">' + (data.email ? escapeHTML(data.email) : "no email provided") + "</p>" +
      "</div>" +
    "</div>" +
    '<ul class="info-list">' +
      "<li><span class=\"info-label\">Full Name</span>" + display(data.fullName) + "</li>" +
      "<li><span class=\"info-label\">Email</span>" + display(data.email) + "</li>" +
      "<li><span class=\"info-label\">Age</span>" + display(data.age) + "</li>" +
      "<li><span class=\"info-label\">Phone</span>" + display(data.phone) + "</li>" +
      "<li><span class=\"info-label\">Birthday</span>" + display(data.birthday) + "</li>" +
      "<li><span class=\"info-label\">Country</span>" + display(data.country) + "</li>" +
      "<li><span class=\"info-label\">Website</span>" + websiteDisplay + "</li>" +
      "<li><span class=\"info-label\">Favorite Color</span>" + colorDisplay + "</li>" +
      "<li><span class=\"info-label\">Bio</span>" + display(data.bio) + "</li>" +
      "<li><span class=\"info-label\">Consent</span>" +
        '<span class="info-value">' + (data.consent ? "Agreed ✓" : "Not agreed") + "</span></li>" +
    "</ul>";
}

function resetOutput() {
  outputEl.classList.add("card--empty");
  outputEl.innerHTML =
    '<p class="card__placeholder">Your info will appear here once you click <strong>Show My Info</strong>.</p>';

  // Select every input, select, and textarea, then clear each one.
  const allFields = document.querySelectorAll("input, select, textarea");
  allFields.forEach(function (field) {
    if (field.type === "checkbox") {
      field.checked = false;
    } else if (field.type === "radio") {
      // Restore the default checked radio (Blue).
      field.checked = field.value === "Blue";
    } else {
      field.value = "";
    }
  });
}

// ---------- Event wiring ----------
showBtn.addEventListener("click", renderCard);

// The Clear button empties every field and resets the output card.
clearBtn.addEventListener("click", function (event) {
  event.preventDefault();
  resetOutput();
});

// Pressing Enter inside the form triggers "Show My Info" instead of reload.
form.addEventListener("submit", function (event) {
  event.preventDefault();
  renderCard();
});
