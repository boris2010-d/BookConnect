import {chromium} from "playwright";
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
for(const [path,label] of [["index.html","catalog"],["librarian.html","librarian"]]){
 const page=await browser.newPage({viewport:{width:1366,height:900}});
 const errs=[], failed=[];
 page.on("pageerror",e=>errs.push(e.message));
 page.on("console",m=>{if(m.type()==="error")errs.push(m.text())});
 page.on("requestfailed",req=>failed.push(req.url()+" "+req.failure()?.errorText));
 await page.goto("http://127.0.0.1:8765/"+path,{waitUntil:"domcontentloaded"});
 await page.waitForTimeout(4500);
 const info={label,errs,failed,cards:await page.locator(".book-card").count(),bookStat:label==="librarian"?await page.locator("#bookCount").textContent():null,status:label==="librarian"?await page.locator("#dbStatus").textContent():null};
 if(label==="catalog"){
  const heading=await page.locator(".catalog-lead").innerText();
  const account=await page.locator(".catalog-toolbar a").innerText();
  const covers=await page.locator(".book-cover").evaluateAll(images=>images.map(image=>({src:image.currentSrc || image.src,loaded:image.complete&&image.naturalWidth>0})));
  if(heading==="catalogLead" || account==="catalogAccountLink")throw Error("Untranslated catalog labels");
  if(covers.length<30 || covers.some(c=>!c.loaded))throw Error("Missing book covers: "+JSON.stringify(covers.filter(c=>!c.loaded).slice(0,5)));
 }
 console.log(JSON.stringify(info));
 if(errs.filter(e=>!e.includes("404")).length||failed.length|| (label==="catalog" && info.cards<30)||(label==="librarian" && Number(info.bookStat)<30))throw Error(label+" did not load public Supabase data");
 await page.close();
}
await browser.close();
console.log("PASS public catalog and librarian page loaded without signing in");
