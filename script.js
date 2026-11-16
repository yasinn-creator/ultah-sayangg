const slotPicker = document.querySelector("#slot-picker");
const photoPicker = document.querySelector("#photo-picker");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
let activeSlot = null;
const photoUrls = new Set();

function showPhoto(file, slot) {
  if (!file || !file.type.startsWith("image/")) return;
  const imageUrl = URL.createObjectURL(file);
  photoUrls.add(imageUrl);

  const card = document.createElement("button");
  card.type = "button";
  card.className = `photo-card photo-image ${slot.classList.contains("photo-tall") ? "photo-tall" : ""} ${slot.classList.contains("photo-wide") ? "photo-wide" : ""}`;
  card.style.backgroundImage = `url("${imageUrl}")`;
  card.setAttribute("aria-label", `Lihat ${file.name}`);
  const title = document.createElement("span");
  title.className = "photo-title";
  title.textContent = file.name.replace(/\.[^.]+$/, "");
  const subtitle = document.createElement("span");
  subtitle.className = "photo-subtitle";
  subtitle.textContent = "Kenangan kita ♡";
  const icon = document.createElement("span");
  icon.className = "add-icon";
  icon.textContent = "↗";
  card.append(icon, title, subtitle);
  card.addEventListener("click", () => {
    lightboxImage.src = imageUrl;
    lightbox.showModal();
  });
  slot.replaceWith(card);
}

document.querySelectorAll("[data-photo-slot]").forEach((slot) => {
  slot.addEventListener("click", () => {
    activeSlot = slot;
    slotPicker.click();
  });
});

slotPicker.addEventListener("change", () => {
  const file = slotPicker.files[0];
  if (file && activeSlot) showPhoto(file, activeSlot);
  slotPicker.value = "";
  activeSlot = null;
});

photoPicker.addEventListener("change", () => {
  const files = Array.from(photoPicker.files).filter((file) => file.type.startsWith("image/"));
  const grid = document.querySelector("#photo-grid");
  files.forEach((file) => {
    const emptySlot = grid.querySelector("[data-photo-slot]");
    const slot = emptySlot || Object.assign(document.createElement("div"), {
      className: "photo-card photo-add photo-small",
    });
    if (!emptySlot) {
      slot.classList.add("photo-image-slot");
      slot.innerHTML = "";
      grid.append(slot);
    }
    showPhoto(file, slot);
  });
  photoPicker.value = "";
});

document.querySelector("#surprise-button").addEventListener("click", (event) => {
  const message = document.querySelector("#surprise-message");
  message.hidden = false;
  event.currentTarget.textContent = "Kejutanmu terbuka ♡";
  event.currentTarget.disabled = true;
  event.currentTarget.setAttribute("aria-expanded", "true");
  if (typeof window.confetti === "function") window.confetti();
});

document.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});
window.addEventListener("beforeunload", () => photoUrls.forEach((url) => URL.revokeObjectURL(url)));
