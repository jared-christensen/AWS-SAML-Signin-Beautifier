document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("options-form");

  // Load saved settings
  chrome.storage.sync.get(
    [
      "favoriteAccounts",
      "primaryButtonRegEx",
      "cautionCardRegEx",
      "infoCardRegEx",
      "removeFromAccountLabelRegEx",
      "removeFromButtonLabelRegEx",
    ],
    (items) => {
      form.favoriteAccounts.value = items.favoriteAccounts || "";
      form.primaryButtonRegEx.value = items.primaryButtonRegEx || "";
      form.cautionCardRegEx.value = items.cautionCardRegEx || "";
      form.infoCardRegEx.value = items.infoCardRegEx || "";
      form.removeFromAccountLabelRegEx.value =
        items.removeFromAccountLabelRegEx || "";
      form.removeFromButtonLabelRegEx.value =
        items.removeFromButtonLabelRegEx || "";
    }
  );

  // Save settings
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    chrome.storage.sync.set(
      {
        favoriteAccounts: form.favoriteAccounts.value,
        primaryButtonRegEx: form.primaryButtonRegEx.value,
        cautionCardRegEx: form.cautionCardRegEx.value,
        infoCardRegEx: form.infoCardRegEx.value,
        removeFromAccountLabelRegEx: form.removeFromAccountLabelRegEx.value,
        removeFromButtonLabelRegEx: form.removeFromButtonLabelRegEx.value,
      },
      () => {
        alert("Settings saved");
      }
    );
  });
});
