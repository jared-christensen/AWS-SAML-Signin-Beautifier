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
  GM_addStyle(`/* Rests */
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
  border: 1px solid rgb(198, 198, 205);
  border-radius: 16px;
  padding: 16px 20px;
  box-sizing: border-box;
}

.saml-account.prod-account {
  border-color: rgb(133, 89, 0);
  background-color: rgb(255, 254, 240);
}

.saml-account.delivery-account {
  border-color: #006ce0;
  background-color: rgb(240, 251, 255);
}

.saml-account .saml-account {
  margin: 0;
  padding: 0;
  display: flex !important;
  gap: 8px
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
}`);

  function cleanAccountLabels() {
    document.querySelectorAll(".saml-account-name").forEach((account) => {
      account.innerHTML = account.textContent
        .replace(/\((\d+)\)/, '<span class="account-number">($1)</span>')
        .replace(/^Account:\s*/, "")
        .replace(/^dhi-/i, "");
    });
  }

  function highlightEnvAccounts() {
    document.querySelectorAll(".saml-account").forEach((account) => {
      const nameElement = account.querySelector(".saml-account-name");
      if (nameElement) {
        const text = nameElement.textContent.toLowerCase();
        if (text.includes("prod")) {
          account.classList.add("prod-account");
        } else if (text.includes("dev")) {
          account.classList.add("dev-account");
        } else if (text.includes("delivery")) {
          account.classList.add("delivery-account");
        }
      }

      account.querySelectorAll(".clickable-radio label").forEach((label) => {
        let labelText = label.textContent.trim();
        labelText = labelText.replace(/^DHI-/i, "");

        label.textContent = labelText;

        if (labelText.toLowerCase().includes("admin")) {
          label.closest(".clickable-radio").classList.add("admin");
        } else if (labelText.toLowerCase().includes("poweruser")) {
          label.closest(".clickable-radio").classList.add("poweruser");
        } else if (labelText.toLowerCase().includes("deployeditor")) {
          label.closest(".clickable-radio").classList.add("deployeditor");
        } else if (labelText.toLowerCase().includes("readonly")) {
          label.closest(".clickable-radio").classList.add("readonly");
        } else if (labelText.toLowerCase().includes("delivery")) {
          label.closest(".clickable-radio").classList.add("delivery");
        }
      });
    });
  }

  function autoSubmit() {
    const form = document.querySelector("#saml_form");
    if (!form) return;

    document.querySelectorAll(".saml-role").forEach((role) => {
      role.addEventListener("click", () => {
        const radio = role.querySelector('input[type="radio"]');
        if (radio) {
          radio.checked = true;
          form.submit();
        }
      });
    });
  }

  function init() {
    cleanAccountLabels();
    highlightEnvAccounts();
    autoSubmit();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
