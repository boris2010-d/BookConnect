// Stage 3 static checks — node tests/check-stage3.mjs
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {Script} from "node:vm";
const read = f => readFileSync(new URL("../"+f,import.meta.url),"utf8");
const html=read("index.html"), js=read("script.js"), sql=read("docs/STAGE_3_MIGRATION.sql");
new Script(js,{filename:"script.js"});
for(const id of ["accountForm","accountEmail","accountPassword","signInBtn","signUpBtn","signOutBtn","reservationList","bookGrid","reserveBtn"]) {
  assert.ok(html.includes('id="'+id+'"'),"Missing interface element "+id);
}
assert.match(js,/auth\.signInWithPassword/);
assert.match(js,/auth\.signUp/);
assert.match(js,/auth\.signOut/);
assert.match(js,/\.rpc\("reserve_book"/);
assert.match(js,/\.rpc\("cancel_my_reservation"/);
assert.match(js,/\.from\("reservations"\)/);
assert.doesNotMatch(js,/localStorage\.setItem\(/);
assert.match(sql,/FOR UPDATE/i);
assert.match(sql,/pg_advisory_xact_lock/i);
assert.match(sql,/UNIQUE/i);
assert.match(sql,/auth\.uid\(\)/);
assert.match(sql,/REVOKE ALL ON FUNCTION/i);
assert.match(sql,/ENABLE ROW LEVEL SECURITY/i);
console.log("PASS Stage 3: JavaScript syntax, auth, reservation RPCs, atomic allocation, RLS and ownership checks");
