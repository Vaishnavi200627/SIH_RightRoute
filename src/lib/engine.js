import ruleset from '../data/crisis-rules.json';
import resourcesFile from '../data/resources.json';

const RESOURCES = resourcesFile.resources;

export const RULESET_META = {
  version: ruleset.version,
  jurisdiction: ruleset.jurisdiction,
  lastReviewed: ruleset.lastReviewed,
  ruleCount: ruleset.rules.length,
  resourceCount: Object.keys(RESOURCES).length,
  tiers: ruleset.tiers
};

const TIER_LABEL = {
  1: 'P1 · Immediate safety',
  2: 'P2 · Active financial loss',
  3: 'P3 · Image abuse or ongoing threat',
  4: 'P4 · General digital crisis'
};

export function tierLabel(tier) {
  return TIER_LABEL[tier] || `Tier ${tier}`;
}

/**
 * Evaluates the ruleset against an intake object.
 *
 * Sorts by ascending tier first (tier 1 is most urgent), then descending
 * priority within each tier. Returns the selected rule plus every other
 * rule that also matched, with a human-readable reason for each rejection.
 *
 * The rejection reasons are what allow the UI to show "Other routes we
 * considered" — the provenance that separates this from a plain lookup.
 */
export function resolveRoute(intake) {
  const ordered = [...ruleset.rules].sort((a, b) => {
    if (a.tier !== b.tier) return a.tier - b.tier;
    return b.priority - a.priority;
  });

  const allMatches = ordered.filter(rule => {
    const conditions = Object.entries(rule.when);
    return conditions.every(([key, value]) => intake[key] === value);
  });

  if (allMatches.length === 0) return null;

  const selected = allMatches[0];
  const alsoMatched = allMatches.slice(1);

  const rejectedBecause = alsoMatched.map(rule => {
    let reason;
    if (rule.tier > selected.tier) {
      reason = `Lower priority tier (T${rule.tier} vs T${selected.tier})`;
    } else {
      reason = `Lower priority within T${rule.tier} (${rule.priority} vs ${selected.priority})`;
    }
    return {
      ruleId: rule.id,
      label: rule.label,
      tier: rule.tier,
      priority: rule.priority,
      reason
    };
  });

  return {
    ruleId: selected.id,
    tier: selected.tier,
    priority: selected.priority,
    label: selected.label,
    matchedOn: Object.entries(selected.when).map(([key, value]) => ({ key, value })),
    why: selected.why,
    actions: selected.actions,
    evidence: selected.evidence,
    resources: selected.resourceIds.map(id => RESOURCES[id]).filter(Boolean),
    rulesetVersion: ruleset.version,
    evaluated: ordered.length,
    alsoMatched: alsoMatched.map(r => ({
      ruleId: r.id,
      label: r.label,
      tier: r.tier,
      priority: r.priority
    })),
    rejectedBecause
  };
}

export function listRules() {
  return [...ruleset.rules].sort((a, b) => {
    if (a.tier !== b.tier) return a.tier - b.tier;
    return b.priority - a.priority;
  });
}