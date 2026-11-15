# Section 14 — Educational content quality

**Implementation date:** 2026-11-15  
**Scope:** 15 mission records, learning-objective display, assessment validation, and a pilot learning-measure protocol.

## 14.1 Content records

`js/data/content-records.js` defines one record for each of the 15 mission IDs. Each record includes:

- approximate target age (9–13; must be checked against the actual school/curriculum audience),
- a measurable learning objective,
- key concepts,
- source URLs,
- pointers to the existing lesson, activity, and quiz content,
- misconceptions to address,
- assessment alignment,
- record update date, scientific review status, and claim-audit status.

The mission briefing displays its learning objective and target level. The actual lesson, activity, and quiz remain in `js/data/missions.js` so existing mission behavior is preserved.

## 14.2 Scientific review and traceability — NOT YET COMPLETE

Official/primary-source starting points are mapped by mission in `content-records.js`. A source mapping is not proof that every factual sentence is supported. Every lesson paragraph and factual note still needs sentence-level claim checking against the linked sources, with a citation attached to the specific claim and a dated reviewer sign-off.

All records currently say:

- `scientificReview.status`: Pending knowledgeable human reviewer
- `scientificReview.reviewedAt`: null
- `claimTraceability.status`: Source mapping supplied; sentence-level audit pending
- `claimTraceability.auditedAt`: null

Do not describe the missions as scientifically reviewed until those fields are completed by a qualified reviewer. Keep a change log when claims or sources are revised.

## 14.3 Assessment alignment

Each record states how its quiz should measure the learning objective. Automated checks verify that all 15 missions have a record and that every current quiz item has a non-empty question, distinct options, a valid single answer index, a hint, and an explanation.

These checks do **not** prove that an item is unambiguous, age-appropriate, scientifically correct, or aligned in practice. A teacher/reviewer must inspect each item, independently solve it, and document the rationale for the keyed answer. Distractors should represent plausible misconceptions rather than trick wording.

## 14.4 Pilot learning measure

### Suggested small pilot protocol

1. Before the lesson, give learners a short 3-item pre-check aligned to the mission objective. Do not show the answers or hints.
2. Deliver the lesson and activity.
3. Give a parallel 3-item post-check testing the same concepts with different wording or examples.
4. Report anonymous group-level results: number invited, number completing both checks, mean pre-score, mean post-score, mean change in percentage points, and the range of scores.
5. Ask one short transfer question ("How would you use this idea in a new example?") and have a teacher score it with a simple 0/1/2 rubric.
6. Keep game stars and cosmetic rewards separate from all learning measures.

### Interpretation and limitations

A small, single-group pilot is descriptive, not proof that the app caused learning. Results can be affected by prior knowledge, reading ability, guessing, repeated testing, attendance, teacher support, and the small or non-representative sample. Report missing responses and do not identify individual children in a public report. Do not collect names or other unnecessary personal details. Obtain school/guardian approval and follow the school’s child-data rules before any real learner study.

### Pilot report template

| Measure | Result |
|---|---|
| Mission / learning objective | To be completed |
| Number completing pre and post checks | To be completed |
| Mean pre-check score (0–100%) | To be completed |
| Mean post-check score (0–100%) | To be completed |
| Mean change (percentage points) | To be completed |
| Transfer question rubric (0–2) | To be completed |
| Limitations / deviations | To be completed |
| Reviewer and review date | To be completed |

No pilot data has been collected as part of this code change. The table is a reporting template, not a claim of measured impact.

## Acceptance status

| Requirement | Status |
|---|---|
| 15/15 content records exist and are structurally complete | Implemented; automated validation |
| Objective and target age shown in mission briefing | Implemented |
| Source mapping for each mission | Implemented; sentence-level audit pending |
| Knowledgeable reviewer signs off each factual claim | Pending human review |
| Quiz structure and answer-key integrity | Automated validation passed; pedagogical review pending |
| Pre/post learning measure and limitations | Pilot protocol/report template added; pilot not yet run |

## Sources

The URLs in `js/data/content-records.js` are official or primary-source starting points (NASA, IAU, and the U.S. government GPS program). Reviewers should verify that each page is current and directly supports the exact claim before approving it.
