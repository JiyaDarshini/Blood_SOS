// Blood group compatibility mapping
// Key: Donor blood group
// Value: Array of recipient blood groups the donor can donate to

const BLOOD_COMPATIBILITY = {
  O_NEG:  ['O_NEG', 'O_POS', 'A_NEG', 'A_POS', 'B_NEG', 'B_POS', 'AB_NEG', 'AB_POS'],
  O_POS:  ['O_POS', 'A_POS', 'B_POS', 'AB_POS'],
  A_NEG:  ['A_NEG', 'A_POS', 'AB_NEG', 'AB_POS'],
  A_POS:  ['A_POS', 'AB_POS'],
  B_NEG:  ['B_NEG', 'B_POS', 'AB_NEG', 'AB_POS'],
  B_POS:  ['B_POS', 'AB_POS'],
  AB_NEG: ['AB_NEG', 'AB_POS'],
  AB_POS: ['AB_POS'],
};

/**
 * Get list of compatible donor blood groups for a given recipient blood group
 * @param {string} recipientBloodGroup - The blood group that needs blood
 * @returns {string[]} Array of donor blood groups that can donate to this recipient
 */
function getCompatibleDonors(recipientBloodGroup) {
  const compatible = [];
  for (const [donorGroup, canDonateTo] of Object.entries(BLOOD_COMPATIBILITY)) {
    if (canDonateTo.includes(recipientBloodGroup)) {
      compatible.push(donorGroup);
    }
  }
  return compatible;
}

/**
 * Check if a donor can donate to a recipient
 * @param {string} donorBloodGroup
 * @param {string} recipientBloodGroup
 * @returns {boolean}
 */
function canDonate(donorBloodGroup, recipientBloodGroup) {
  const donorCanDonateTo = BLOOD_COMPATIBILITY[donorBloodGroup] || [];
  return donorCanDonateTo.includes(recipientBloodGroup);
}

/**
 * Format blood group enum value to display string
 * @param {string} bloodGroup - Prisma enum value e.g. "A_POS"
 * @returns {string} e.g. "A+"
 */
function formatBloodGroup(bloodGroup) {
  return bloodGroup
    .replace('_POS', '+')
    .replace('_NEG', '-')
    .replace('AB', 'AB')
    .replace('O', 'O');
}

/**
 * Parse display blood group string to enum value
 * @param {string} display - e.g. "A+"
 * @returns {string} Prisma enum value e.g. "A_POS"
 */
function parseBloodGroup(display) {
  return display
    .replace('+', '_POS')
    .replace('-', '_NEG');
}

module.exports = {
  BLOOD_COMPATIBILITY,
  getCompatibleDonors,
  canDonate,
  formatBloodGroup,
  parseBloodGroup,
};
