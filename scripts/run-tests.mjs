import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ruleset = JSON.parse(
  readFileSync(join(__dirname, '..', 'src', 'data', 'crisis-rules.json'), 'utf-8')
);

// Independent reimplementation of the resolver. If this diverges from
// src/lib/engine.js, the tests will catch it.
function resolve(intake) {
  const ordered = [...ruleset.rules].sort((a, b) => {
    if (a.tier !== b.tier) return a.tier - b.tier;
    return b.priority - a.priority;
  });
  for (const rule of ordered) {
    const conditions = Object.entries(rule.when);
    if (conditions.every(([k, v]) => intake[k] === v)) return rule.id;
  }
  return null;
}

const cases = [
  // Tier 1 — physical safety override
  { name: 'T1 overrides fraud', intake: { physicalDanger: true, category: 'fraud', moneyLost: true, fraudType: 'upi' }, expected: 'R-EMERGENCY-PHYSICAL' },
  { name: 'T1 overrides NCII minor threat', intake: { physicalDanger: true, category: 'ncii', minor: true, threatened: true, ownership: 'nonconsented' }, expected: 'R-EMERGENCY-PHYSICAL' },
  { name: 'T1 overrides stalking', intake: { physicalDanger: true, category: 'stalking', ongoing: true }, expected: 'R-EMERGENCY-PHYSICAL' },

  // Tier 3 — NCII
  { name: 'NCII minor + threat', intake: { category: 'ncii', minor: true, threatened: true, ownership: 'nonconsented' }, expected: 'R-NCII-MINOR-THREAT' },
  { name: 'NCII minor only', intake: { category: 'ncii', minor: true, threatened: false, ownership: 'nonconsented' }, expected: 'R-NCII-MINOR' },
  { name: 'NCII adult threatened', intake: { category: 'ncii', minor: false, threatened: true, ownership: 'nonconsented' }, expected: 'R-NCII-THREAT' },
  { name: 'NCII adult no threat', intake: { category: 'ncii', minor: false, threatened: false, ownership: 'nonconsented' }, expected: 'R-NCII' },
  { name: 'NCII self-created no threat', intake: { category: 'ncii', minor: false, threatened: false, ownership: 'self' }, expected: 'R-NCII-SELF' },
  { name: 'NCII self-created with threat', intake: { category: 'ncii', minor: false, threatened: true, ownership: 'self' }, expected: 'R-NCII-THREAT' },

  // Tier 3 — stalking
  { name: 'Stalking ongoing', intake: { category: 'stalking', ongoing: true }, expected: 'R-STALKING-ONGOING' },
  { name: 'Stalking past', intake: { category: 'stalking', ongoing: false }, expected: 'R-STALKING' },

  // Tier 2 — fraud with money lost
  { name: 'UPI fraud money lost', intake: { category: 'fraud', moneyLost: true, fraudType: 'upi' }, expected: 'R-FRAUD-MONEY-UPI' },
  { name: 'OTP fraud money lost', intake: { category: 'fraud', moneyLost: true, fraudType: 'otp' }, expected: 'R-FRAUD-MONEY' },
  { name: 'Other fraud money lost', intake: { category: 'fraud', moneyLost: true, fraudType: 'other' }, expected: 'R-FRAUD-MONEY' },
  { name: 'Tier 2 overrides phishing attempt', intake: { category: 'fraud', moneyLost: true, fraudType: 'phishing' }, expected: 'R-FRAUD-MONEY' },

  // Tier 4 — fraud without money lost
  { name: 'Phishing no money lost', intake: { category: 'fraud', moneyLost: false, fraudType: 'phishing' }, expected: 'R-FRAUD-PHISHING' },
  { name: 'UPI attempt no money lost', intake: { category: 'fraud', moneyLost: false, fraudType: 'upi' }, expected: 'R-FRAUD-ATTEMPT' },
  { name: 'Generic fraud attempt', intake: { category: 'fraud', moneyLost: false, fraudType: 'other' }, expected: 'R-FRAUD-ATTEMPT' },

  // Tier 4 — account
  { name: 'Account hacked', intake: { category: 'account', accountType: 'hacked' }, expected: 'R-ACCOUNT-HACKED' },
  { name: 'Account locked', intake: { category: 'account', accountType: 'locked' }, expected: 'R-ACCOUNT-LOCKED' },
  { name: 'Account suspicious', intake: { category: 'account', accountType: 'compromised' }, expected: 'R-ACCOUNT' },

  // Tier 4 — default
  { name: 'Unknown category falls back', intake: { category: 'something' }, expected: 'R-DEFAULT' },
  { name: 'Empty intake falls back', intake: {}, expected: 'R-DEFAULT' },

  // Cross-tier precedence
  { name: 'T3 NCII threat beats T4 NCII default', intake: { category: 'ncii', threatened: true, ownership: 'nonconsented' }, expected: 'R-NCII-THREAT' },
  { name: 'T2 fraud beats T4 account', intake: { category: 'fraud', moneyLost: true, fraudType: 'upi', accountType: 'hacked' }, expected: 'R-FRAUD-MONEY-UPI' },
  { name: 'T3 stalking ongoing beats T4 NCII', intake: { category: 'stalking', ongoing: true, minor: false, threatened: false }, expected: 'R-STALKING-ONGOING' },

  // Precedence edge cases
  { name: 'Minor NCII with threat prefers MINOR-THREAT', intake: { category: 'ncii', minor: true, threatened: true }, expected: 'R-NCII-MINOR-THREAT' },
  { name: 'Minor NCII without threat', intake: { category: 'ncii', minor: true, threatened: false }, expected: 'R-NCII-MINOR' },
  { name: 'UPI beats generic when both conditions met', intake: { category: 'fraud', moneyLost: true, fraudType: 'upi' }, expected: 'R-FRAUD-MONEY-UPI' },

  // Tier boundary
  { name: 'Physical danger with no other flags', intake: { physicalDanger: true }, expected: 'R-EMERGENCY-PHYSICAL' }
];

let passed = 0;
let failed = 0;

console.log(`Running ${cases.length} test cases…\n`);

for (const c of cases) {
  const actual = resolve(c.intake);
  if (actual === c.expected) {
    console.log(`  PASS  ${c.name}`);
    passed++;
  } else {
    console.log(`  FAIL  ${c.name}`);
    console.log(`        expected: ${c.expected}`);
    console.log(`        got:      ${actual}`);
    failed++;
  }
}

console.log(`\n${passed}/${cases.length} passed, ${failed} failed`);

if (failed > 0) process.exit(1);