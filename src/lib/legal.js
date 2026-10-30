/**
 * STRICT LEGAL NOTICE & DISCLAIMER:
 * Potential mapping only. Requires review by a judicial officer.
 * These are potential statutory provisions based on broad incident categories.
 * They do not constitute formal legal advice or an official charge sheet.
 */

/**
 * Returns potential statutory legal provisions based on crisis category.
 *
 * @param {string} category
 * @returns {Array<{act: string, section: string, title: string, status: "REVIEW_REQUIRED", note: string}>}
 */
export function getPotentialLegalSections(category) {
  const cat = typeof category === 'string' ? category.trim().toLowerCase() : '';
  const note = 'Potential mapping only. Requires review by a judicial officer.';

  switch (cat) {
    case 'ncii':
      return [
        {
          act: 'BNS 2023',
          section: 'Section 77',
          title: 'Voyeurism',
          status: 'REVIEW_REQUIRED',
          note
        },
        {
          act: 'BNS 2023',
          section: 'Section 78',
          title: 'Stalking',
          status: 'REVIEW_REQUIRED',
          note
        }
      ];

    case 'stalking':
      return [
        {
          act: 'BNS 2023',
          section: 'Section 78',
          title: 'Stalking',
          status: 'REVIEW_REQUIRED',
          note
        }
      ];

    case 'account':
      return [
        {
          act: 'IT Act 2000',
          section: 'Section 66C',
          title: 'Identity Theft',
          status: 'REVIEW_REQUIRED',
          note
        }
      ];

    case 'fraud':
      return [
        {
          act: 'BNS 2023',
          section: 'Section 318',
          title: 'Cheating',
          status: 'REVIEW_REQUIRED',
          note
        }
      ];

    default:
      return [
        {
          act: 'Unknown',
          section: 'N/A',
          title: 'Requires Legal Review',
          status: 'REVIEW_REQUIRED',
          note
        }
      ];
  }
}

export default getPotentialLegalSections;
