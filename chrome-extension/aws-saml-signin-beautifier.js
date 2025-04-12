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
        ? items.favoriteAccounts.split(",").map((account) => account.trim())
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
        account
          .querySelectorAll(".saml-role.clickable-radio")
          .forEach((container) => {
            const radio = container.querySelector('input[type="radio"]');
            const label = container.querySelector("label");

            const roleValue = radio.value;

            let labelText = label.textContent.trim();
            labelText = labelText.replace(removeFromButtonLabelRegEx, "");

            // Create button
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = labelText;
            button.classList.add("btn");
            button.dataset.roleValue = roleValue;

            if (
              items.primaryButtonRegEx &&
              primaryButtonRegEx.test(labelText)
            ) {
              button.classList.add("primary-btn");
            } else {
              button.classList.add("secondary-btn");
            }

            container.replaceWith(button);
          });
      }

      // Moves favorite accounts to the top
      function moveFavoriteAccounts(account) {
        const accountNumber =
          account.querySelector(".account-number")?.textContent;
        const index = favoriteAccounts.indexOf(accountNumber);

        if (index !== -1) {
          account.classList.add("favorite-account");
          account.style.gridColumn = "span 2";

          const parent = account.parentElement;
          const siblings = Array.from(parent.children);

          // Find where to insert based on favoriteAccounts order
          const insertBeforeIndex = siblings.findIndex((sibling) => {
            const siblingNumber =
              sibling.querySelector(".account-number")?.textContent;
            const siblingIndex = favoriteAccounts.indexOf(siblingNumber);
            return siblingIndex > index || siblingIndex === -1;
          });

          if (insertBeforeIndex === -1) {
            parent.appendChild(account); // move to end
          } else {
            parent.insertBefore(account, siblings[insertBeforeIndex]);
          }
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

      // When you click a role button, this picks the role and submits the form
      function handleRoleButtonClicks() {
        const form = document.querySelector("#saml_form");

        document
          .querySelectorAll("button[data-role-value]")
          .forEach((button) => {
            function handleSubmit() {
              const hiddenInput = document.createElement("input");
              hiddenInput.type = "hidden";
              hiddenInput.name = "roleIndex";
              hiddenInput.value = button.dataset.roleValue;
              form.appendChild(hiddenInput);
              form.submit();
            }

            button.addEventListener("click", handleSubmit);
          });
      }

      // Adds a filter input to filter account cards by account name.
      function addAccountFilter() {
        const filterContainer = document.createElement("div");
        filterContainer.classList.add("field");
        filterContainer.classList.add("filter");

        const filterInput = document.createElement("input");
        filterInput.id = "filter-input";
        filterInput.type = "text";
        filterInput.placeholder = "Filter by account name...";

        filterContainer.appendChild(filterInput);

        const form = document.querySelector("form");
        if (form) {
          form.insertBefore(filterContainer, form.firstChild);
        }

        filterInput.focus();

        filterInput.addEventListener("input", (e) => {
          const filterValue = e.target.value
            .toLowerCase()
            .replace(/[-_\s]/g, "");
          const cards = document.querySelectorAll(".card");

          cards.forEach((card) => {
            const accountName = card
              .querySelector(".saml-account-name")
              .textContent.toLowerCase()
              .replace(/[-_\s]/g, "");
            if (accountName.includes(filterValue)) {
              card.classList.add("show");
              card.classList.remove("hide");
            } else {
              card.classList.add("hide");
              card.classList.remove("show");
            }
          });
        });
      }

      processAccounts();
      addAccountFilter();
      handleRoleButtonClicks();
    }
  );
})();
