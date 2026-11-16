// Stage 2 checks: run with node tests/check-stage2.mjs
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {Script} from "node:vm";
const read = f => readFileSync(new URL("../"+f,import.meta.url),"utf8");
const index = read("index.html");
const librarian = read("librarian.html");
const catalogJS = read("script.js");
const staffJS = read("librarian.js");
const css = read("style.css");
const sql = read("docs/STAGE_2_MIGRATION.sql");
new Script(catalogJS,{filename:"script.js"});
new Script(staffJS,{filename:"librarian.js"});
for (const [file,html] of [["index.html",index],["librarian.html",librarian]]) {
  assert.match(html,/style\.css/,`${file} must load CSS`);
  assert.match(html,/supabase-js@2/,`${file} must load Supabase SDK`);
}
for (const id of ["catalogSearch","bookGrid","genreFilter","availabilityFilter","bgBtn","enBtn"]) {
  assert.ok(index.includes('id="'+id+'"'),`missing catalog id ${id}`);
}
for (const id of ["inventoryRows","bookCount","genreCount","totalCount","availableCount","addBookForm","loginForm"]) {
  assert.ok(librarian.includes('id="'+id+'"'),`missing librarian id ${id}`);
}
assert.match(catalogJS,/loadBooksFromSupabase\(\);/);
assert.match(staffJS,/\.rpc\("add_book_with_copy"/);
assert.match(staffJS,/\.signInWithPassword/);
assert.match(staffJS,/app_metadata\.role===?"librarian"/);
assert.match(sql,/SECURITY INVOKER/i);
assert.match(sql,/REVOKE ALL ON FUNCTION/i);
assert.match(css,/@media\(max-width:700px\)/);
console.log("PASS Stage 2 static checks: syntax, navigation, UI, Supabase, security and responsive CSS");
