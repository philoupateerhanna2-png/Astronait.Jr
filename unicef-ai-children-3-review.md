# UNICEF Guidance on AI and Children 3.0 — design mapping

Reviewed against UNICEF's official **Guidance on AI and Children, Version 3.0**, published December 2025: https://www.unicef.org/innocenti/reports/policy-guidance-ai-children

This is a preliminary product-design mapping, not a legal opinion, certification, or substitute for UNICEF's complete checklist.

| UNICEF requirement | Astro design response | Status / gap |
|---|---|---|
| 1. Regulatory frameworks, oversight and compliance | Backend-only provider secrets; documented launch gates | Adult owner, local legal/privacy review, deployment governance still required |
| 2. Safety for children | Short input limits, refusal layer, timeouts, trusted-adult message | Client keyword gate is incomplete; provider moderation and human safeguarding workflow need testing |
| 3. Data privacy | No profile details sent; no transcript persistence; request sent only with authenticated token | Processor review, consent, retention, deletion, cross-border review and deployed verification remain required |
| 4. Fairness and non-discrimination | Plain language, simple default, accessible UI | Test across language, disability, reading level and cultural context; bias audit pending |
| 5. Transparency, explainability and accountability | AI-assisted label, fallibility notice, source links, report route | Public model/provider notice, audit trail without child content, staffed response path pending |
| 6. Responsible AI practice and child rights | Explicit child-centred system prompt and launch restrictions | Supply-chain/provider review and lifecycle governance pending |
| 7. Best interests, development and well-being | Guided explanations and hints; does not claim to replace teachers | Teacher validation and learning-outcome evaluation pending |
| 8. Inclusion | Arabic/English interface and responsive UI | Accessibility audit and learner participation study pending |
| 9. Prepare and skill children | Encourages reasoning and AI transparency | Add explicit AI literacy lesson and teacher guidance |
| 10. Enabling environment | Modular optional endpoint and documented architecture | School/adult governance, infrastructure, support and monitoring still needed |

**Overall:** several product-level safeguards are scaffolded, but the system is not yet demonstrated to satisfy UNICEF Guidance 3.0. The guidance itself recommends child-rights-centred governance and meaningful oversight; software checks alone cannot establish compliance.
