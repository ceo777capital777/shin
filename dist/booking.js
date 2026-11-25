const form = document.getElementById("booking-form");
const dateField = form.elements.namedItem("date");
const phoneField = form.elements.namedItem("phone");
const nameField = form.elements.namedItem("name");
const vehicleField = form.elements.namedItem("car");
const dateFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Volgograd",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function updateMinimumDate() {
  const parts = dateFormat.formatToParts(new Date());
  const date = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  dateField.min = [date.year, date.month, date.day].join("-");
}

updateMinimumDate();
for (const field of [nameField, phoneField, vehicleField]) {
  field.addEventListener("input", () => field.setCustomValidity(""));
}
dateField.addEventListener("focus", updateMinimumDate);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  updateMinimumDate();
  const data = new FormData(form);
  const name = nameField.value.trim();
  const vehicle = vehicleField.value.trim();
  const phone = data.get("phone").trim();
  const digits = phone.replace(/\D/g, "");
  nameField.setCustomValidity(name ? "" : "Введите имя.");
  vehicleField.setCustomValidity(vehicle ? "" : "Введите марку и модель.");
  if (!/^\+?[\d ()-]+$/.test(phone) || digits.length < 10 || digits.length > 15) {
    phoneField.setCustomValidity("Введите телефон с 10–15 цифрами.");
  }
  if (!form.reportValidity()) return;

  const [year, month, day] = data.get("date").split("-");
  const message = [
    "Здравствуйте! Хочу записаться в Шин-сервис.",
    "Имя: " + name,
    "Телефон: " + phone,
    "Авто или мотоцикл: " + vehicle,
    "Услуга: " + data.get("service"),
    "Желаемая дата: " + [day, month, year].join("."),
    "Желаемое время: " + data.get("time"),
  ].join("\n");
  window.location.assign("https://wa.me/79053333438?text=" + encodeURIComponent(message));
});

form.querySelector('button[type="submit"]').disabled = false;
