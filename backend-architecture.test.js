import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const file = (name) => fs.readFileSync(path.join(root, name), 'utf8');

test('architecture decision selects one managed backend path', () => {
  const adr = file('docs/architecture/ADR-001-backend-platform.md');
  assert.match(adr, /Decision\s*\n\nUse \*\*one Supabase project\*\*/);
  assert.match(adr, /Do not add a parallel Firebase project or a separate custom Node\.js API/);
});

test('schema protects roles and authoritative reward tables', () => {
  const sql = file('supabase/migrations/202611150001_initial_schema.sql');
  for (const table of ['user_roles', 'mission_progress', 'quiz_attempts', 'star_ledger', 'purchases', 'inventory', 'equipped_items']) {
    assert.match(sql, new RegExp(`alter table public\\.${table} enable row level security`));
  }
  assert.match(sql, /unique \(user_id, event_key\)/);
  assert.match(sql, /unique \(user_id, idempotency_key\)/);
  assert.match(sql, /revoke all on all tables in schema public from anon, authenticated/);
  assert.match(sql, /No client write grants on progress, quiz attempts, roles, rewards, purchases/);
  assert.doesNotMatch(sql, /insert into public\.user_roles/i);
});

test('API contract includes all required service boundaries and error schema', () => {
  const api = file('docs/backend/openapi.yaml');
  for (const route of ['/me:', '/progress:', '/missions/{missionKey}/complete:', '/quizzes/{quizKey}/attempts:', '/achievements:', '/store/purchases:', '/store/equipped:', '/leaderboard:', '/ai/ask:', '/nasa/{resource}:']) {
    assert.ok(api.includes(route), `Missing API route ${route}`);
  }
  for (const code of ['400', '401', '403', '404', '409', '429', '503']) assert.ok(api.includes(`'${code}'`));
});

test('sync and recovery plan includes two-device, offline and account recovery cases', () => {
  const sync = file('docs/backend/sync-and-recovery.md');
  assert.match(sync, /Two-device acceptance test/);
  assert.match(sync, /Offline queue/);
  assert.match(sync, /Account recovery/);
  assert.match(sync, /Star balance \| Derived from server ledger only/);
});

test('service credentials are not embedded in browser application files', () => {
  const browserFiles = ['index.html', 'astro.js', ...fs.readdirSync(path.join(root, 'js'), { recursive: true }).filter((p) => String(p).endsWith('.js')).map((p) => `js/${p}`)];
  for (const name of browserFiles) {
    const contents = file(name);
    assert.doesNotMatch(contents, /SUPABASE_SERVICE_ROLE_KEY|SUPABASE_SECRET_KEY|sk-[A-Za-z0-9]{20,}/, `${name} contains a server secret marker`);
  }
});
