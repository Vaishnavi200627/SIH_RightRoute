# RightRoute

Privacy-first crisis navigator for cybercrime in India. Given a short intake, RightRoute selects a pre-written route from a versioned rule file and shows the user exactly why that route was chosen.

## What it does

- Routes four crisis categories: **NCII**, **financial fraud**, **account takeover**, **stalking**.
- Every route shows the rule ID, the priority, the conditions that matched, and the reasoning behind the route.
- Local SHA-256 hashing so a user can keep an integrity reference for a file without uploading it.
- All routes point to official resources — NCRP, CERT-In, StopNCII, Take It Down (NCMEC).

## What it does not do

- It does not store intake answers.
- It does not upload files. Hashing runs in the browser via Web Crypto.
- It does not produce court-admissible evidence. It produces a personal integrity reference.
- It is not legal advice.

## Structure
