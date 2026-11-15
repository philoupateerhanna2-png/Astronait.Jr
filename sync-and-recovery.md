# Offline sync, conflict handling and recovery

## Two distinct states

The browser must show and store two clearly distinguished categories:

- **Local draft:** unsent work and offline checkpoints stored on this device. It may be edited locally and is not proof of completion or a reward.
- **Server-confirmed:** profile, mission completion, quiz result, star balance, achievement, purchase and equipped inventory returned by the authenticated API. Only this state is authoritative and synchronizes across devices.

Never label a local draft as a confirmed reward. The UI should show a small offline/pending indicator and the last successful sync time.

## Offline queue

- Queue only operations that can be safely replayed, with a client-generated UUID `Idempotency-Key` per logical operation.
- Keep pending operations separate from confirmed server records.
- On reconnect, send operations in order; retry network failures with bounded exponential backoff and jitter.
- Do not queue password changes, role/admin actions or arbitrary AI proxy calls.
- If the user signs out or switches accounts, keep each draft queue partitioned by local account and never submit one user's queue under another user's session.

## Conflict policy

| Data | Conflict rule |
|---|---|
| Quiz attempts | Append-only; each attempt has a unique ID; server grades it. Never overwrite a previous attempt. |
| Mission completion/rewards | Server transaction and idempotency key; server determines completion and reward once. |
| Star balance | Derived from server ledger only. Never merge by adding local balances. |
| Checkpoints | Server validates mission/checkpoint schema. Use server revision; if revisions conflict, return `409 CONFLICT` and let the UI offer reload or keep a local draft. |
| Profile preferences | Last server-confirmed update wins; send an `updated_at`/revision precondition to avoid silent overwrites. |
| Inventory/equipped items | Server is authoritative; purchase/equip requests are validated against current ownership and slot rules. |
| Lesson/planet viewed flags | May merge as monotonic sets only if the team decides they are worth syncing; they never award stars by themselves. |

Do not use generic last-write-wins for scores, stars, roles, purchases or achievements.

## Two-device acceptance test

1. Sign in on Device A and Device B with the same test account.
2. Complete a server-graded quiz on A; confirm the attempt and star balance appear on B after refresh/sync.
3. Change a checkpoint on A while B is offline; reconnect B and confirm the revision/conflict rule is shown rather than silently overwriting confirmed state.
4. Submit the same purchase twice from two devices using the same idempotency key; verify one debit and one inventory grant.
5. Change localStorage stars and role on B; confirm the server balance and role do not change.

## Backup and restore

- Development/free projects: schedule regular encrypted logical exports to a separate controlled location; do not rely on the free tier for automatic backups.
- Production: choose a paid plan with a documented backup retention period; current Supabase Pro documentation lists daily backups with 7-day retention. Confirm the selected plan and retention at launch.
- At least quarterly, restore a backup into a separate test project and verify profiles, progress, attempts, ledger, purchases and memberships. A backup that has never been restored is not a proven recovery plan.
- Record who can trigger restore, who approves it, expected recovery point/time, and how users are informed.

## Account recovery

- Use Supabase Auth's verified email/password recovery flow; never recover accounts by trusting a username, localStorage record or a teacher-supplied star balance.
- After password reset, the user signs in and downloads server-confirmed progress from the account.
- A device's unsynced local draft is not automatically granted as server progress. Provide an explicit, teacher-reviewed import path only if the school wants one; imported rewards must be marked unverified or recalculated.
- Provide a documented account deletion/export request process before real student data is collected.

## Release gate

Do not switch on cloud mode until automated tests cover two devices, offline edits, replay/idempotency, account recovery, backup restore and cross-account isolation.
