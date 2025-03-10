// ==UserScript==
// @name         AWS-SAML-Signin-Beautifier
// @namespace    https://github.com/jared-christensen/AWS-SAML-Signin-Beautifier
// @version      1.2.0
// @description  Enhances the AWS SAML sign-in page with UI improvements, better readability, and quality-of-life tweaks.
// @author       Jared Christensen
// @match        https://signin.aws.amazon.com/saml
// @grant        GM_addStyle
// @updateURL    https://github.com/jared-christensen/AWS-SAML-Signin-Beautifier/raw/main/aws-saml-signin-beautifier.user.js
// @downloadURL  https://github.com/jared-christensen/AWS-SAML-Signin-Beautifier/raw/main/aws-saml-signin-beautifier.user.js
// ==/UserScript==
(function () {
  "use strict";

  // Favorite account will show at the top of the list
  const favoriteAccounts = [];
  // If the button label matches this regex, it will be shown as a primary button
  const primaryButtonRegEx =
    /PowerUser|Admin|MetricsUser|Billing|DeployEditor/i;
  // If the account name matches this regex, it will be shown as a caution card
  const cautionCardRegEx = /prod/i;
  // If the account name matches this regex, it will be shown as an info card
  const infoCardRegEx = /delivery/i;
  // Removes unwanted repetitive text from account labels
  const removeFromAccountLabelRegEx = /^dhi-/i;
  // Removes unwanted repetitive text from button labels
  const removeFromButtonLabelRegEx = /^dhi-/i;

  // Sets the card type based on the account name
  function setCardType(account) {
    const nameElement = account.querySelector(".saml-account-name");
    account.classList.add("card");
    if (nameElement) {
      const text = nameElement.textContent.toLowerCase();
      if (cautionCardRegEx.test(text)) {
        account.classList.add("caution");
      }
      if (infoCardRegEx.test(text)) {
        account.classList.add("info");
      }
    }
  }

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

  // Prettifies the buttons by removing any unwanted text and setting button prominence
  function prettifyButtons(account) {
    account.querySelectorAll(".clickable-radio label").forEach((label) => {
      let labelText = label.textContent.trim();
      labelText = labelText.replace(removeFromButtonLabelRegEx, "");
      label.textContent = labelText;
      label.classList.add("btn");
      if (primaryButtonRegEx.test(labelText)) {
        label.classList.add("primary-btn");
      } else {
        label.classList.add("secondary-btn");
      }
    });
  }

  // Moves favorite accounts to the top
  function moveFavoriteAccounts(account) {
    const accountNumber = account.querySelector(".account-number").textContent;
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
    document.querySelectorAll("fieldset > .saml-account").forEach((account) => {
      setCardType(account);
      prettifyAccountLabels(account);
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

  function init() {
    autoSubmit();
    processAccounts();
  }

  GM_addStyle(`
/* Rests */
.saml-role {
  display: inline-block;
  margin: 0;
}
h1.background,
#saml_form p,
.saml-account > hr,
.expandable-container > img,
.saml-role input[type="radio"],
#input_signin_button,
#smallprint {
  display: none;
}
#content {
  border: none;
}

/* Grid */
fieldset {
  font-family: "Open Sans", "Helvetica Neue", Roboto, Arial, sans-serif;
  letter-spacing: 0.005em;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
}

/* Card */
.card {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin: 0;
  gap: 8px;
  background-color: #fff;
  border-radius: 16px;
  background-color: #fff;
  border: 1px solid #c6c6cd;
  border-radius: 16px;
  padding: 16px 20px;
  box-sizing: border-box;
}
.card.caution {
  border-color: #855900;
  background-color: #fffeF0;
}
.card.info {
  border-color: #006ce0;
  background-color: #f0fbff;
}

/* Card Title */
.saml-account-name {
  font-size: 18px;
  font-weight: 700;
  line-height: 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Account Number */
.account-number {
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
}

/* Button Container */
.card .saml-account {
  margin: 0;
  padding: 0;
  display: flex !important;
  gap: 8px
}

/* Button */
.btn {
  display: block;
  white-space: nowrap;
  padding: 4px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  cursor: pointer;
  text-decoration: none;
}
.secondary-btn {
  border: 2px solid #006ce0;
  background-color: #ffffff;
  color: #006ce0;
  &:hover {
    border-color: #002b66 ;
    color: #002b66 ;
    background-color: #f0fbff;
  }
  &:active {
    border-color: #002b66;
    color: #002b66;
    background-color: #d1f1ff;
  }
}
.primary-btn {
  border: 2px solid #006ce0;
  background-color: #006ce0;
  color: #fff;
  &:hover {
      border-color: #002b66 ;
    border-color: #002b66;
    background-color: #002b66;
  }
  &:active {
   border-color: #002b66;
    background-color: #002b66;
    border-color: #002b66;
  }
}
  `);

  init();
})();
