## UX Strategy Review — DDD-001 Global Layout

**Verdict: ADVISE**

---

- [mobile measure gap needs amendment path]: Open Question #3 notes that 20px body font on a 375px screen yields ~38 chars/line — below the 45-char minimum for comfortable reading — and defers the decision to DDD-005/006. The coupling runs both ways: if DDD-005/006 resolves this by changing mobile font size or reducing the measure, the wireframes in this DDD become inaccurate. The open question should explicitly request a DDD-001 amendment path if the typography DDD lands on values that change the mobile layout geometry.
  SCOPE: DDD-001-global-layout.md, Open Question #3
  CHANGE: Add a sentence to Open Question #3 stating that if DDD-005/006 resolves the mobile chars-per-line gap by adjusting font size or measure, DDD-001 must be amended to update the mobile wireframe and the content constraint column in the responsive behavior table.
  WHY: A foundational layout contract whose wireframes silently become wrong the moment a downstream DDD makes a decision is a coordination trap. Making the amendment path explicit keeps the contract trustworthy.
  TASK: 1

---

All other UX concerns are well-handled. The two-tier width model serves the reader's job (scan headings, read prose, read code) without adding interface complexity. The spacing scale reduces cognitive load by creating predictable visual rest stops. The code block escape hatch is correctly elevated as a hard constraint — trapping code at 68ch would damage the primary use case for this audience. The approval gate is appropriate given the blast radius.
