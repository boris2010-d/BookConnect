import { chromium } from "playwright";
import assert from "node:assert/strict";
const browser = await chromium.launch({headless:true,args:["--no-sandbox"]});
const context = await browser.newContext({viewport:{width:1250,height:850}});
const page = await context.newPage();
try {
  await page.goto("http://127.0.0.1:8765/index.html",{waitUntil:"domcontentloaded"});
  assert.equal(await page.locator("html").getAttribute("data-theme"),"light");
  await page.locator("#themeToggle").click();
  assert.equal(await page.locator("html").getAttribute("data-theme"),"dark");
  assert.match(await page.locator("#themeToggle").innerText(),/Светъл режим/);
  await page.reload({waitUntil:"domcontentloaded"});
  assert.equal(await page.locator("html").getAttribute("data-theme"),"dark");
  await page.goto("http://127.0.0.1:8765/librarian.html",{waitUntil:"domcontentloaded"});
  assert.equal(await page.locator("html").getAttribute("data-theme"),"dark");
  await page.locator("#enBtn").click();
  assert.match(await page.locator("#themeToggle").innerText(),/Light mode/);
  await page.locator("#themeToggle").click();
  assert.equal(await page.locator("html").getAttribute("data-theme"),"light");
  assert.match(await page.locator("#themeToggle").innerText(),/Dark mode/);
  await page.goto("http://127.0.0.1:8765/index.html",{waitUntil:"domcontentloaded"});
  assert.equal(await page.locator("html").getAttribute("data-theme"),"light");
  console.log("PASS: Light/Dark toggle, page navigation, reload persistence, BG/EN labels");
} finally { await browser.close(); }
