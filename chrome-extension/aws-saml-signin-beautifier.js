(function () {
  "use strict";

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
      const favoriteAccounts = items.favoriteAccounts
        ? items.favoriteAccounts.split(",")
        : [];

      function parseRegEx(regexString) {
        if (!regexString) {
          return new RegExp("");
        }
        const match = regexString.match(/\/(.*)\/([gimuy]*)/);
        return new RegExp(match[1], match[2]);
      }

      const primaryButtonRegEx = parseRegEx(items.primaryButtonRegEx);
      const cautionCardRegEx = parseRegEx(items.cautionCardRegEx);
      const infoCardRegEx = parseRegEx(items.infoCardRegEx);
      const removeFromAccountLabelRegEx = parseRegEx(
        items.removeFromAccountLabelRegEx
      );
      const removeFromButtonLabelRegEx = parseRegEx(
        items.removeFromButtonLabelRegEx
      );

      // Prettifies the account labels by removing the account prefix and any unwanted text
      function prettifyAccountLabels(account) {
        const accountNameElement = account.querySelector(".saml-account-name");
        if (accountNameElement) {
          accountNameElement.innerHTML = accountNameElement.textContent
            .replace(/\((\d+)\)/, '<span class="account-number">$1</span>')
            .replace(/^Account:\s*/, "")
            .replace(removeFromAccountLabelRegEx, "");
        }
      }

      // Sets the card type based on the account name
      function setCardType(account) {
        const nameElement = account.querySelector(".saml-account-name");
        account.classList.add("card");
        console.log("nameElement", nameElement);
        if (nameElement) {
          const text = nameElement.textContent.toLowerCase();
          if (items.cautionCardRegEx && cautionCardRegEx.test(text)) {
            account.classList.add("caution");
          }
          if (items.infoCardRegEx && infoCardRegEx.test(text)) {
            account.classList.add("info");
          }
        }
      }

      // Prettifies the buttons by removing any unwanted text and setting button prominence
      function prettifyButtons(account) {
        account.querySelectorAll(".clickable-radio label").forEach((label) => {
          let labelText = label.textContent.trim();
          labelText = labelText.replace(removeFromButtonLabelRegEx, "");
          label.textContent = labelText;
          label.classList.add("btn");
          if (items.primaryButtonRegEx && primaryButtonRegEx.test(labelText)) {
            label.classList.add("primary-btn");
          } else {
            label.classList.add("secondary-btn");
          }
        });
      }

      // Moves favorite accounts to the top
      function moveFavoriteAccounts(account) {
        const accountNumber =
          account.querySelector(".account-number").textContent;
        const index = favoriteAccounts.indexOf(accountNumber);
        if (index !== -1) {
          account.classList.add("favorite-account");
          account.style.order = index;
          account.style.gridColumn = "span 2";
        } else {
          account.style.order = favoriteAccounts.length;
        }
      }

      // Loops through all accounts cards and processes them
      function processAccounts() {
        document
          .querySelectorAll("fieldset > .saml-account")
          .forEach((account) => {
            prettifyAccountLabels(account);
            setCardType(account);
            prettifyButtons(account);
            moveFavoriteAccounts(account);
          });
      }

      // Automatically submits the form when a role is clicked
      function autoSubmit() {
        const form = document.querySelector("#saml_form");
        document.querySelectorAll(".saml-role").forEach((role) => {
          role.addEventListener("click", () => {
            form.submit();
          });
        });
      }

      autoSubmit();
      processAccounts();
    }
  );
})();
