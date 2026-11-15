# Child and guardian process (Section 9.4)

**Status: proposed operational workflow; not approved for real student onboarding.** An adult supervisor and qualified Egyptian privacy/legal adviser must review and sign off before collection of any real student data. The school must separately approve any school-managed pilot.

## Roles before launch

- **Adult project supervisor:** named adult responsible for student safety, the support inbox, escalation and access reviews.
- **School representative:** confirms whether the school is controller, joint controller or otherwise involved; approves any class/teacher workflow and student recruitment.
- **Privacy/legal adviser:** reviews Egyptian Personal Data Protection Law No. 151/2020, Executive Regulations and current Personal Data Protection Center guidance, including consent, children, processors and cross-border processing.
- **Technical owner:** implements approved settings and can demonstrate access controls, deletion, backup restoration and incident response.
- **Backup owner:** can revoke access, rotate secrets and respond if the technical owner is unavailable.

## Before inviting students

1. Write a plain-language Arabic privacy notice first; an English translation may be provided as well.
2. Identify the data controller, processors, contact route, purposes, data categories, recipients, retention, deletion/withdrawal method and any cross-border transfers.
3. Use separate choices for separate optional purposes: public leaderboard, AI processing, school/teacher access, and optional support communications. Do not bundle them with account creation or pre-check any box.
4. Do not collect exact date of birth or ID documents by default. Ask the adviser to approve the minimum age-handling method. If age threshold handling is required, use a guardian-confirmed age band/route rather than storing a full birth date unless counsel says otherwise. Also disclose third-party assets, fonts, videos and embedded simulations because those providers receive normal browser request metadata when opened.
5. Use a guardian-controlled email or approved school identity where an account contact is necessary; do not require a child's personal email or phone.
6. Obtain written guardian consent where required, and provide an age-appropriate explanation/assent to the child. The safe project default is guardian involvement for all under-18 pilot participants unless counsel and school approve a different route.
7. Do not make optional data processing a condition of access to core learning features.
8. Keep the school roster and teacher tools disabled until a written school agreement defines access, purpose, retention, support and deletion.
9. Test consent withdrawal and account deletion using synthetic accounts before the pilot.
10. Provide an adult-supervised route for safety concerns, privacy requests and account recovery.

## Consent design checklist

- Arabic is the primary language; use simple, age-appropriate wording.
- State who is collecting data, what exact fields are collected, why, who receives them and how long they are kept.
- Ask for an affirmative action; no pre-selected checkboxes.
- Keep each optional purpose separate and optional.
- Make refusal as easy as acceptance and do not use pressure or confusing wording.
- Explain how to withdraw consent and what happens after withdrawal.
- Keep a minimal consent record containing notice/version, purpose, timestamp, and the guardian confirmation route. Do not store scans of IDs or sensitive documents unless counsel specifically requires and approves them.

## Egypt-specific legal review note

The official text of Law No. 151/2020 defines children's data as sensitive personal data and sets rules for personal-data processing, retention, security and rights. The Personal Data Protection Center's **Data Subject Consent Guidelines, Version 1.1 dated 26 January 2026**, say consent for children's data requires guardian involvement, with a distinction for children under 15 and those over 15; they also describe consent as explicit, informed, specific, freely given and written for sensitive data, and say consent requests should be in Arabic, clear, affirmative, granular and separate. These are important review inputs, not a substitute for legal advice or a final determination of Astronaut Jr's obligations. Counsel must also review Executive Regulations issued by Decision No. 816 of 2025, controller/processor roles, cross-border transfers and any required licence/permit before launch.

## Launch must remain blocked until

- [ ] Named adult supervisor and backup owner have accepted responsibility.
- [ ] Qualified local adviser has reviewed and signed the privacy/consent process.
- [ ] School has approved the student pilot and any teacher access in writing.
- [ ] Arabic privacy notice and separate consent texts are approved.
- [ ] Guardian workflow and age-handling method are approved and tested.
- [ ] Data inventory, processor list, retention and deletion process are approved.
- [ ] No real student data is present in development/test environments.

## Sources for the review

- Egyptian Personal Data Protection Law No. 151 of 2020 (Official Gazette copy): https://escc.gov.eg/assets/docs/law-151-2020.pdf
- Personal Data Protection Center, Data Subject Consent Guidelines, Version 1.1 (26 January 2026): https://pdpc.gov.eg/assets/pdf-data/Guidelines/DSConsent.pdf
