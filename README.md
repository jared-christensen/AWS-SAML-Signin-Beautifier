# AWS-SAML-Signin-Beautifier

A Tampermonkey script to improve the AWS SAML sign-in page by making role selection faster, enhancing UI readability, and adding colors for easier scanning.

## What This Script Does
If your company manages many AWS accounts, selecting the right role from the AWS SAML login page (`https://signin.aws.amazon.com/saml`) can be frustrating. This script removes friction from the process by:

- Turning role radio buttons into submit buttons – No need to scroll down and click "Sign In"
- Making the design easier to scan – Quickly find the right role
- Adding color coding for clarity – Visually differentiate accounts

Designed for users managing multiple AWS accounts.

---

## Installation
### 1. Install Tampermonkey
First, install Tampermonkey, a popular userscript manager:
- [Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
- [Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/)

### 2. Install the Script
Click below to install directly in Tampermonkey:
[Install AWS-SAML-Signin-Beautifier](https://github.com/jared-christensen/AWS-SAML-Signin-Beautifier/raw/main/aws-saml-signin-beautifier.user.js)

Tampermonkey should detect the script and prompt you to install it.

### 3. Done!
Now, whenever you visit `https://signin.aws.amazon.com/saml`, the script will improve the role selection experience automatically.
