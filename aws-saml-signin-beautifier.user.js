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
  
      GM_addStyle(`
      :root {
        --colorText: #FAFAFA;
        --colorGray100: #FAFAFA;
        --colorTextReversed: #1E2222;
        --colorGrey800: #1E2222;
        --colorSecondaryText: #FFFFFF;
        --colorSecondaryReversed: #1E2222;
        --colorDisabledText: #FAFAFA;
        --colorDisabledTextReversed: #1E2222;
        --colorBackground: #232F3E;
        --colorBackgroundReversed: #EBEDED;
        --colorBackgroundOverlay: #000000;
        --colorRed800: #65151E;
        --colorGreen800: #34581B;
        --colorTeal800: #0A655E;
        --colorBlue800: #232F3E;
        --colorPurple800: #3E3F68;
        --colorGray800: #1E2222;
        --colorComponent: #FAFAFA;;
        --colorComponentReversed: #1E2222;
  
        --card-background-default: var(--colorBackground);
        --card-background-prod: var(--colorGray800);
        --card-background-dev: var(--colorGray100);
        --card-background-delivery: var(--colorBlue800);
  
        --border-default: var(--colorGray100);
        --border-admin: var(--colorRed800);
        --border-poweruser: var(--colorGreen800);
        --border-deployeditor: var(--colorGreen800);
        --border-readonly: var(--colorGray100);
        --border-delivery: var(--colorBlue800);
  
        --text-default: var(--colorText);
        --text-light: var(--colorSecondaryText);
  
        --font-size-large: 18px;
        --font-size-small: 12px;
      }
  
      fieldset {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
        margin-top: 10px;
      }
  
      fieldset > .saml-account {
        background: var(--card-background-default);
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        margin: 0;
        padding: 8px 12px;
        gap: 6px;
      }
  
      .saml-account.prod-account {
        background: var(--card-background-prod) !important;
      }
  
      .saml-account.dev-account {
        background: var(--card-background-dev) !important;
      }
  
      .saml-account.delivery-account {
        background: var(--card-background-delivery) !important;
      }
  
      .saml-account .saml-account {
        margin: 0;
        padding: 0;
        display: block !important;
      }
  
      .saml-account-name {
        font-size: var(--font-size-large);
        font-weight: normal;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
  
      .saml-account-name .account-number {
        font-size: var(--font-size-small);
      }
  
      .clickable-radio {
        display: inline-block;
        margin: 0;
      }
  
      .clickable-radio label {
        cursor: pointer;
        font-size: var(--font-size-small);
        font-weight: normal;
        text-align: center;
        display: block;
        padding: 5px 8px;
        border-radius: 4px;
        background: var(--colorComponent);
        border: 1px solid var(--border-default);
        white-space: nowrap;
        color: var(--text-default) !important;
      }
  
      .clickable-radio label:hover {
        filter: brightness(85%);
        color: var(--text-default) !important;
      }
  
      .clickable-radio.admin label {
        background: var(--border-admin) !important;
        border: 1px solid var(--border-admin) !important;
        color: var(--text-light) !important;
      }
  
      .clickable-radio.admin label:hover {
        filter: brightness(75%);
        color: var(--text-light) !important;
      }
  
      .clickable-radio.poweruser label {
        background: var(--border-poweruser) !important;
        border: 1px solid var(--border-poweruser) !important;
        color: var(--text-light) !important;
      }
  
      .clickable-radio.poweruser label:hover {
        filter: brightness(75%);
        color: var(--text-light) !important;
      }
  
      .clickable-radio.deployeditor label {
        background: var(--border-deployeditor) !important;
        border: 1px solid var(--border-deployeditor) !important;
        color: var(--text-light) !important;
      }
  
      .clickable-radio.deployeditor label:hover {
        filter: brightness(75%);
        color: var (--text-light) !important;
      }
  
      .clickable-radio.readonly label {
        background: var(--colorComponent) !important;
        border: 1px solid var(--border-default) !important;
      }
  
      .clickable-radio.readonly label:hover {
        filter: brightness(85%);
        color: var(--text-default) !important;
      }
  
      .clickable-radio.delivery label {
        background: var(--border-delivery) !important;
        border: 1px solid var(--border-delivery) !important;
      }
  
      .clickable-radio.delivery label:hover {
        filter: brightness(75%);
        color: var(--text-default) !important;
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
    `);
  
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
