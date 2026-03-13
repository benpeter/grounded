---
agent: test-minion
phase: review
task: implement-ddd-003-footer-block
verdict: ADVISE
---

ADVISE

- [testing]: The verification step for `aria-label` stripping (DevTools > Accessibility > Name) is manual-only and requires the dev server to be running — it is the only check for a high-severity risk with no automated fallback.
  SCOPE: drafts/footer.plain.html, `aria-label` on LinkedIn link
  CHANGE: Add a CLI-executable check to the verification sequence: after the dev server is running, verify the rendered fragment via `curl http://localhost:3000/footer.plain.html | grep -q 'aria-label="Ben Peter on LinkedIn"'` as a fast sanity check that the attribute survived authoring. This does not cover EDS decoration stripping (which is a runtime DOM concern), but it confirms the source file is correct and removes ambiguity about whether the manual DevTools step was actually done.
  WHY: The risk table marks `aria-label` stripped by EDS `decorateLinks()` as High. The only mitigation is a manual DevTools inspection step. If the dev server is not available during implementation, this check is silently skipped. A grep on the source file is not sufficient to catch stripping, but it is a zero-cost check that eliminates one failure mode and creates an auditable artifact in the task output.
  TASK: Task 1 (Deliverable 3: Verification)

- [testing]: The dev server `--html-folder drafts` flag requirement for serving the footer fragment is documented only in Project Context, not in the verification sequence — a passing lint check does not confirm the fragment is actually being served.
  SCOPE: drafts/footer.plain.html, dev server startup
  CHANGE: Add a verification step to the post-task list: `curl -s http://localhost:3000/footer.plain.html | grep -q 'Legal Notice'` to confirm the fragment is reachable at the expected path. This is a one-line check that closes the gap between "file exists" and "dev server serves it."
  WHY: The task success criteria includes `drafts/footer.plain.html exists` but not `fragment is reachable via dev server`. The lint gate passes whether or not the dev server is running or configured with the correct flag. The visual verification steps all depend on the server being live and correctly pointed at the drafts folder. Without a reachability check, a frontend-minion that creates the file but starts the server without `--html-folder drafts` will have a green lint result but a broken visual verification — and no structured signal that something is wrong.
  TASK: Task 1 (Deliverable 3: Verification)
