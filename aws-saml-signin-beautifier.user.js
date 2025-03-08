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

  const favoriteAccounts = ["935695194370", "829315696278", "109147643482"];
  const accountTypes = ["prod", "dev", "delivery"];
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

/* Layout */
fieldset {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
}

/* Card */
fieldset > .saml-account {
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

/* Card - Warning */
.saml-account.prod-account {
  border-color: #855900;
  background-color: #fffeF0;
}

/* Card - Info */
.saml-account.delivery-account {
  border-color: #006ce0;
  background-color: #f0fbff;
}

/* Card Title */
.saml-account-name {
  font-family: "Open Sans", "Helvetica Neue", Roboto, Arial, sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 22px;
  letter-spacing: 0.005em;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Account Number */
.saml-account-name .account-number {
  font-family: "Open Sans", "Helvetica Neue", Roboto, Arial, sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  letter-spacing: 0.005em;
}

/* Button Container */
.saml-account .saml-account {
  margin: 0;
  padding: 0;
  display: flex !important;
  gap: 8px
}


/* Primary Button */
.saml-role label {
  display: block;
  white-space: nowrap;

  /* Core button styles */
  padding: 4px 20px;
  border: 2px solid #006ce0;
  border-radius: 20px;

  /* Typography */
  font-family: "Open Sans", "Helvetica Neue", Roboto, Arial, sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  letter-spacing: 0.005em;

  /* Colors & Interaction */
  background-color: #006ce0;
  color: #fff;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    border-color: #002b66;
    background-color: #002b66;
  }

  &:active {
    background-color: #002b66;
    border-color: #002b66;
  }
}

/* Secondary Button */
.saml-role.readonly label {
  border: 2px solid #006ce0 !important;
  background-color: #fff !important;
  color: #006ce0 !important;
  &:hover {
    border-color: #002b66 !important;
    color: #002b66 !important;
    background-color: #f0fbff !important;
  }
  &:active {
    background-color: #d1f1ff !important;
    border-color: #002b66 !important;
    color: #002b66 !important;
  }
}
`);

  // Cleans up the account labels to make them easier to read
  function cleanAccountLabels(account) {
    const accountNameElement = account.querySelector(".saml-account-name");
    if (accountNameElement) {
      accountNameElement.innerHTML = accountNameElement.textContent
        .replace(/\((\d+)\)/, '<span class="account-number">$1</span>')
        .replace(/^Account:\s*/, "")
        .replace(/^dhi-/i, "");
    }
  }

  // Adds classes to accounts based on the account name
  function addAccountClasses(account) {
    const nameElement = account.querySelector(".saml-account-name");
    if (nameElement) {
      const text = nameElement.textContent.toLowerCase();
      accountTypes.forEach((type) => {
        if (text.includes(type)) {
          account.classList.add(`${type}-account`);
        }
      });
    }
  }

  // Adds class to clickable radio buttons
  function addClassToClickableRadios(account) {
    account.querySelectorAll(".clickable-radio label").forEach((label) => {
      let labelText = label.textContent.trim();
      labelText = labelText.replace(/^DHI-/i, "");
      label.textContent = labelText;
      const className = labelText.toLowerCase().replace(/\s+/g, "-");
      label.closest(".clickable-radio").classList.add(className);
    });
  }

  // Adds class to clickable radio buttons
  function addClassToClickableRadios(account) {
    account.querySelectorAll(".clickable-radio label").forEach((label) => {
      let labelText = label.textContent.trim();
      labelText = labelText.replace(/^DHI-/i, "");
      label.textContent = labelText;
      const className = labelText.toLowerCase().replace(/\s+/g, "-");
      label.closest(".clickable-radio").classList.add(className);
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

  // Processes each account element
  function processAccounts() {
    document.querySelectorAll("fieldset > .saml-account").forEach((account) => {
      cleanAccountLabels(account);
      addAccountClasses(account);
      addClassToClickableRadios(account);
      moveFavoriteAccounts(account);
    });
  }

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

  init();
})();
