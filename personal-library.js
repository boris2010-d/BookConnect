// Personal library: Supabase favorites and history; remaining features local.
const personalLibrary = (() => {
  const key = () => "bookconnect.personal.v1." + (currentUser?.id || "guest");
  const fresh = () => ({favorites:[],recent:[],reviews:{},goals:{},finished:{},premiumUntil:0});
  function read() {
    try {
      const v=JSON.parse(localStorage.getItem(key()));
      if (!v || typeof v!=="object") return fresh();
      const ids=a=>Array.isArray(a)?[...new Set(a.filter(x=>typeof x==="string"))]:[];
      return {...fresh(),favorites:ids(v.favorites),recent:ids(v.recent).slice(0,10),
        reviews:v.reviews&&typeof v.reviews==="object"&&!Array.isArray(v.reviews)?v.reviews:{},
        goals:v.goals&&typeof v.goals==="object"?v.goals:{},
        finished:v.finished&&typeof v.finished==="object"?v.finished:{},
        premiumUntil:Number.isFinite(v.premiumUntil)?v.premiumUntil:0};
    } catch { return fresh(); }
  }
  function change(fn) {
    const state=read(); fn(state);
    try { localStorage.setItem(key(),JSON.stringify(state)); return true; }
    catch { showNotice(language==="bg"?"Локалното запазване е недостъпно.":"Local storage is unavailable."); return false; }
  }
  const id=b=>String(b.id);
  let remoteFavorites = null, remoteOwner = null, pending = false;
  async function syncFavorites() {
    void syncPremium();
    void syncChallenge();
    void syncReviews();
    void syncHistory();
    const owner=currentUser?.id;
    if (!owner) { remoteOwner=null; remoteFavorites=null; return; }
    if(remoteOwner!==owner){remoteOwner=owner;remoteFavorites=null;}
    if(pending)return;
    const {data,error}=await db.from('favorites').select('book_id').eq('user_id',owner);
    if(currentUser?.id!==owner||pending)return;
    if(error){showNotice(personalText('Любимите книги не са заредени.','Favorites could not be loaded.'));return;}
    remoteFavorites=data.map(r=>String(r.book_id));renderBooks();
  }
  const favorite=b=>currentUser ? remoteOwner===currentUser.id && (remoteFavorites||[]).includes(id(b)) : read().favorites.includes(id(b));
  async function toggle(b) {
    if(!currentUser)return change(s=>{s.favorites=s.favorites.includes(id(b))?s.favorites.filter(x=>x!==id(b)):[...s.favorites,id(b)];});
    const owner=currentUser.id;
    if(pending||remoteOwner!==owner||!remoteFavorites)return false;
    pending=true;
    try {
      const active=remoteFavorites.includes(id(b));
      const {error}=await (active?db.from("favorites").delete().eq("user_id",owner).eq("book_id",id(b)):db.from("favorites").insert({user_id:owner,book_id:id(b)}));
      if(error)throw error;
      if(currentUser?.id!==owner)return false;
      remoteFavorites=active?remoteFavorites.filter(x=>x!==id(b)):[...remoteFavorites,id(b)];
      return true;
    } catch(e){showNotice(personalText("Любимата книга не е запазена.","Favorite could not be saved."));return false;}
    finally{pending=false;}
  }
  let reviewOwner=null, remoteReviews={}, reviewVersion=0;
  async function syncReviews(){
    const owner=currentUser?.id, version=++reviewVersion;
    if(reviewOwner!==owner){reviewOwner=owner;remoteReviews={};}
    if(!owner)return;
    try {
      const {data,error}=await db.from("reviews").select("book_id,rating,comment").eq("user_id",owner);
      if(error)throw error;
      if(currentUser?.id===owner&&version===reviewVersion)remoteReviews=Object.fromEntries(data.map(r=>[String(r.book_id),{rating:r.rating,comment:r.comment}]));
    }catch(e){if(currentUser?.id===owner)showNotice(personalText("Ревютата не са заредени.","Reviews could not be loaded."));}
  }
  async function saveReview(book,value){
    const owner=currentUser?.id, bookId=id(book);
    if(!owner)return change(v=>{if(value)v.reviews[bookId]=value;else delete v.reviews[bookId];});
    try{
      const {error}=await (value?db.from("reviews").upsert({user_id:owner,book_id:bookId,...value},{onConflict:"user_id,book_id"}):db.from("reviews").delete().eq("user_id",owner).eq("book_id",bookId));
      if(error)throw error;
      if(currentUser?.id!==owner)return false;
      await syncReviews();
      return currentUser?.id===owner;
    }catch(e){if(currentUser?.id===owner)showNotice(personalText("Ревюто не е променено.","Review could not be changed."));return false;}
  }
  let challengeOwner=null, remoteGoals={}, remoteFinished={}, challengeVersion=0, challengeBusy=false;
  async function syncChallenge(){
    const owner=currentUser?.id, version=++challengeVersion;
    if(challengeOwner!==owner){challengeOwner=owner;remoteGoals={};remoteFinished={};}
    if(!owner)return false;
    try{
      const [g,c]=await Promise.all([db.from("reading_challenges").select("year,target_books").eq("user_id",owner),db.from("completed_books").select("book_id,completed_at").eq("user_id",owner)]);
      if(g.error||c.error)throw g.error||c.error;
      if(currentUser?.id!==owner||version!==challengeVersion)return false;
      remoteGoals=Object.fromEntries(g.data.map(r=>[String(r.year),r.target_books]));
      remoteFinished={};
      for(const r of c.data){const y=String(new Date(r.completed_at).getFullYear());(remoteFinished[y]??=[]).push(String(r.book_id));}
      renderPersonalLibrary();return true;
    }catch(e){if(currentUser?.id===owner)showNotice(personalText("Предизвикателството не е заредено.","Challenge could not be loaded."));return false;}
  }
  async function saveGoal(year,target){
    const owner=currentUser?.id;
    if(!owner)return change(v=>v.goals[year]=target);
    return challengeWrite(owner,()=>db.from("reading_challenges").upsert({user_id:owner,year:Number(year),target_books:target},{onConflict:"user_id,year"}));
  }
  async function markFinished(book,year,finished){
    const owner=currentUser?.id, bookId=id(book);
    if(!owner)return change(v=>{const a=v.finished[year]||[];v.finished[year]=finished?a.filter(x=>x!==bookId):[...new Set([...a,bookId])];});
    return challengeWrite(owner,()=>finished?db.from("completed_books").delete().eq("user_id",owner).eq("book_id",bookId):db.from("completed_books").upsert({user_id:owner,book_id:bookId,completed_at:new Date().toISOString()},{onConflict:"user_id,book_id"}));
  }
  async function challengeWrite(owner,operation){
    if(challengeBusy)return false;
    challengeBusy=true;
    try{const {error}=await operation();if(error)throw error;if(currentUser?.id!==owner)return false;return await syncChallenge();}
    catch(e){if(currentUser?.id===owner)showNotice(personalText("Промяната не е запазена.","Change could not be saved."));return false;}
    finally{challengeBusy=false;}
  }
  let premiumOwner=null, premiumTrial=null, premiumLoaded=false, premiumVersion=0, premiumBusy=false;
  async function syncPremium(){
    const owner=currentUser?.id, version=++premiumVersion;
    if(premiumOwner!==owner){premiumOwner=owner;premiumTrial=null;premiumLoaded=false;}
    if(!owner)return false;
    try{
      const {data,error}=await db.from("premium_trials").select("started_at,expires_at").eq("user_id",owner).maybeSingle();
      if(error)throw error;
      if(currentUser?.id!==owner||version!==premiumVersion)return false;
      premiumTrial=data;premiumLoaded=true;renderPersonalLibrary();return true;
    }catch(e){if(currentUser?.id===owner)showNotice(personalText("Premium не е зареден.","Premium could not be loaded."));return false;}
  }
  async function activatePremium(){
    const owner=currentUser?.id;
    if(!owner||premiumBusy||!premiumLoaded||premiumOwner!==owner||premiumTrial)return false;
    premiumBusy=true;
    try{
      const {error}=await db.from("premium_trials").insert({user_id:owner});
      if(error&&error.code!=="23505")throw error;
      if(currentUser?.id!==owner)return false;
      return await syncPremium();
    }catch(e){if(currentUser?.id===owner)showNotice(personalText("Premium не е активиран.","Premium could not be activated."));return false;}
    finally{premiumBusy=false;}
  }
  function view(){const s=read();s.premiumUntil=0;s.premiumUsed=false;s.premiumLoaded=false;if(currentUser&&premiumOwner===currentUser.id){s.premiumUntil=premiumTrial?Date.parse(premiumTrial.expires_at):0;s.premiumUsed=!!premiumTrial;s.premiumLoaded=premiumLoaded;}if(currentUser){s.favorites=remoteOwner===currentUser.id?(remoteFavorites||[]):[];s.recent=historyOwner===currentUser.id?remoteRecent:[];s.reviews=reviewOwner===currentUser.id?remoteReviews:{};s.goals=challengeOwner===currentUser.id?remoteGoals:{};s.finished=challengeOwner===currentUser.id?remoteFinished:{};}return s;}
  let historyOwner=null, remoteRecent=[], historyVersion=0;
  async function syncHistory(){
    const owner=currentUser?.id;
    if(historyOwner!==owner){historyOwner=owner;remoteRecent=[];}
    const version=++historyVersion;
    if(!owner)return;
    try {
      const {data,error}=await db.from("reading_history").select("book_id").eq("user_id",owner).order("last_opened_at",{ascending:false}).limit(10);
      if(error)throw error;
      if(currentUser?.id===owner&&version===historyVersion){remoteRecent=data.map(r=>String(r.book_id));renderPersonalLibrary();}
    }catch(e){if(currentUser?.id===owner)showNotice(personalText("Историята не е заредена.","History could not be loaded."));}
  }
  async function visit(b) {
    if(!currentUser)return change(s=>{s.recent=[id(b),...s.recent.filter(x=>x!==id(b))].slice(0,10);});
    const owner=currentUser.id;
    try{
      const {error}=await db.from("reading_history").upsert({user_id:owner,book_id:id(b),last_opened_at:new Date().toISOString()},{onConflict:"user_id,book_id"});
      if(error)throw error;
      if(currentUser?.id===owner)await syncHistory();
    }catch(e){if(currentUser?.id===owner)showNotice(personalText("Историята не е запазена.","History could not be saved."));}
  }
  function recommendations(items) {
    const s=view(), weights=new Map();
    for(const b of items) {
      const weight=(s.favorites.includes(id(b))?3:0)+(s.recent.includes(id(b))?1:0);
      if(weight) weights.set(b.genre,(weights.get(b.genre)||0)+weight);
    }
    return items.filter(b=>!s.favorites.includes(id(b))&&!s.recent.includes(id(b))&&remainingCopies(b)>0)
      .map((b,i)=>({b,i,score:weights.get(b.genre)||0}))
      .sort((a,b)=>b.score-a.score||a.i-b.i).slice(0,4).map(x=>x.b);
  }
  return {read:view,change,id,favorite,toggle,visit,recommendations,syncFavorites,saveReview,saveGoal,markFinished,activatePremium};
})();

const personalText=(bg,en)=>language==="bg"?bg:en;
function personalElement(tag,text,cls) {
  const e=document.createElement(tag); if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;
}
function personalButton(text,fn) {
  const b=personalElement("button",text,"btn btn-outline");b.type="button";b.addEventListener("click",fn);return b;
}
function favoriteButton(book) {
  const active=personalLibrary.favorite(book);
  const b=personalButton(active?"♥":"♡",async()=>{if(await personalLibrary.toggle(book))renderBooks();});
  b.setAttribute("aria-pressed",String(active));
  b.setAttribute("aria-label",personalText("Любима книга","Favorite book")+": "+book.title[language]);
  return b;
}
let personalTab = "favorites";
function renderPersonalLibrary() {
  const root=document.getElementById("personalLibrary");if(!root)return;
  const s=personalLibrary.read(),year=String(new Date().getFullYear());
  root.replaceChildren(personalElement("h2",personalText("Моята библиотека","My personal library")),
    personalElement("p",personalText("Любимите книги, историята, ревютата и предизвикателствата се синхронизират при вход. Premium също се синхронизира.","Favorites, history, reviews and challenges sync when signed in. Premium also syncs.")));
  const tabs=personalElement("div",undefined,"personal-tabs");
  const choices=[["favorites",personalText("♥ Любими","♥ Favorites")],["recent",personalText("История","History")],["recommended",personalText("Препоръки","Recommendations")],["challenge",personalText("Предизвикателство","Challenge")],["premium","Premium"]];
  for(const [key,label] of choices){const b=personalButton(label,()=>{personalTab=key;renderPersonalLibrary();document.querySelector("#personalLibrary [aria-pressed=true]")?.focus();});b.setAttribute("aria-pressed",String(key===personalTab));tabs.append(b);}
  root.append(tabs);
  const panel=personalElement("div",undefined,"personal-panel");root.append(panel);
  function group(label,items) {
    panel.append(personalElement("h3",label));
    const row=personalElement("div",undefined,"personal-row");
    for(const b of items)row.append(personalButton(b.title[language],()=>openBook(b.id)));
    if(!items.length)row.append(personalElement("p",personalText("Все още няма книги.","No books yet.")));
    panel.append(row);
  }
  if(personalTab==="favorites") group(personalText("♥ Любими","♥ Favorites"),books.filter(b=>s.favorites.includes(personalLibrary.id(b))));
  if(personalTab==="recent") group(personalText("Последно разглеждани","Recently viewed"),s.recent.map(id=>books.find(b=>personalLibrary.id(b)===id)).filter(Boolean));
  if(personalTab==="recommended") group(personalText("Препоръчани за теб","Recommended for you"),personalLibrary.recommendations(books));
  if(personalTab==="challenge") {
  const goal=Number(s.goals[year])||12,done=Array.isArray(s.finished[year])?new Set(s.finished[year]).size:0;
  panel.append(personalElement("h3",personalText("Годишно предизвикателство","Annual reading challenge")+" "+year));
  const label=personalElement("label",personalText("Цел (книги): ","Goal (books): "));
  const input=personalElement("input");input.type="number";input.min="1";input.max="365";input.value=String(goal);label.append(input);
  const progress=personalElement("progress");progress.max=goal;progress.value=Math.min(done,goal);
  panel.append(label,personalButton(personalText("Запази целта","Save goal"),async()=>{if(input.reportValidity()&&Number.isInteger(Number(input.value))&&Number(input.value)>=1&&Number(input.value)<=365){if(await personalLibrary.saveGoal(year,Number(input.value)))renderPersonalLibrary();}}),personalElement("p",done+" / "+goal),progress);
  }
  if(personalTab==="premium") {
  const active=s.premiumUntil>Date.now();
  panel.classList.add("personal-premium");
  panel.append(personalElement("h3","BookConnect Premium — €27 / "+personalText("година","year")),
    personalElement("p",personalText("Безплатен пробен месец. Без автоматично плащане.","Free one-month trial. No automatic payment.")),
    personalElement("p",active?personalText("Демо активен до ","Demo active until ")+new Date(s.premiumUntil).toLocaleDateString(language):personalText("Неактивен","Inactive")),
    personalElement("p",!currentUser?personalText("Влез, за да активираш пробния месец.","Sign in to activate your trial."):!s.premiumLoaded?personalText("Зареждане на Premium…","Loading Premium…"):s.premiumUsed?personalText("Пробният месец може да се активира само веднъж.","The trial can only be activated once."):personalText("Активирай своя безплатен месец.","Activate your free month.")));
    if(currentUser&&s.premiumLoaded&&!s.premiumUsed)panel.append(personalButton(personalText("Активирай 1 месец безплатно","Activate one free month"),async()=>{if(await personalLibrary.activatePremium())renderPersonalLibrary();}));
  }
}
function renderPersonalDetails(book) {
  const root=document.getElementById("personalDetails");if(!root)return;
  root.replaceChildren();
  const id=personalLibrary.id(book),s=personalLibrary.read(),year=String(new Date().getFullYear());
  const finished=Array.isArray(s.finished[year])&&s.finished[year].includes(id);
  root.append(personalButton(finished?personalText("Отмени прочетена","Undo finished"):personalText("Отбележи като прочетена","Mark as finished"),async()=>{
    if(await personalLibrary.markFinished(book,year,finished)){if(root.contains(rating))renderPersonalDetails(book);renderPersonalLibrary();}
  }));
  const review=s.reviews[id]||{};
  const rating=personalElement("select");rating.setAttribute("aria-label",personalText("Оценка","Rating"));
  for(let i=1;i<=5;i++){const o=personalElement("option",i+" ★");o.value=String(i);rating.append(o);}rating.value=String(review.rating||5);
  const comment=personalElement("textarea");comment.maxLength=500;comment.value=typeof review.comment==="string"?review.comment:"";comment.placeholder=personalText("Лично ревю","Private review");comment.setAttribute("aria-label",comment.placeholder);
  root.append(personalElement("h3",personalText("Моята оценка и ревю","My rating and review")),rating,comment,
    personalButton(personalText("Запази ревю","Save review"),async()=>{if(await personalLibrary.saveReview(book,{rating:Number(rating.value),comment:comment.value.trim()}))showNotice(personalText("Ревюто е запазено.","Review saved."));}),
    personalButton(personalText("Изтрий ревю","Delete review"),async()=>{if(await personalLibrary.saveReview(book,null)&&root.contains(comment))renderPersonalDetails(book);}));
  const source = publicBookSource(book);
  if (source) { const link=personalElement("a",personalText("Пълно издание и PDF — Читанка","Full Bulgarian edition and PDF — Chitanka"),"btn btn-outline"); link.href=source;link.target="_blank";link.rel="noopener noreferrer";root.append(link); }
  const pdfUrl = catalogPdfUrl(book);
  const reader = personalButton(personalText("Чети онлайн (PDF)","Read online (PDF)"),()=>openCatalogPdf(book,pdfUrl));
  reader.disabled = !pdfUrl;
  root.append(reader);
  if (!pdfUrl) root.append(personalElement("p",personalText("Онлайн изданието все още не е налично.","Online edition is not available yet.")));
}
function updateSearchSuggestions() {
  const input=document.getElementById("catalogSearch"),list=document.getElementById("catalogSuggestions");if(!input||!list)return;
  list.replaceChildren();if(!input.value.trim())return;
  for(const b of rankCatalog(books,input.value).slice(0,6)){const o=document.createElement("option");o.value=b.title[language];list.append(o);}
}

 // Add only authorized PDF editions here, keyed by the exact catalog book ID.
const catalogPdfEditions = Object.freeze({});
function catalogPdfUrl(book) {
  const entry = catalogPdfEditions[String(book.id)];
  if (!entry) return null;
  const url = typeof entry === "string" ? entry : entry[language];
  if (typeof url !== "string") return null;
  try {
    const parsed = new URL(url, location.href);
    if (parsed.origin === location.origin && parsed.pathname.startsWith(new URL("pdf/",location.href).pathname) && /\.pdf$/i.test(parsed.pathname)) return parsed.href;
  } catch {}
  return null;
}
function openCatalogPdf(book,url) {
  if (!url || url !== catalogPdfUrl(book)) return;
  const dialog = document.createElement("dialog");
  dialog.style.cssText="width:95vw;height:90vh;max-width:1200px;padding:12px;border:0;border-radius:12px;background:Canvas;color:CanvasText;";
  const header=personalElement("div",undefined,"personal-row");
  header.append(personalElement("h2",book.title[language]),personalButton(personalText("Затвори","Close"),()=>dialog.close()));
  const frame=document.createElement("iframe");
  frame.title=book.title[language];frame.src=url;frame.style.cssText="width:100%;height:calc(100% - 85px);border:0;";
  const fallback=personalElement("a",personalText("Отвори PDF при проблем с четеца","Open PDF if viewer is unavailable"));fallback.href=url;fallback.target="_blank";fallback.rel="noopener";
  dialog.append(header,fallback,frame);document.body.append(dialog);
  dialog.addEventListener("close",()=>dialog.remove(),{once:true});dialog.showModal();
}

// Verified public-domain edition landing pages; direct PDF embedding is not verified.
function publicBookSource(book) {
  const title = String(book.title?.bg || "").trim().toLocaleLowerCase("bg-BG");
  const author = String(book.author?.bg || "").trim().toLocaleLowerCase("bg-BG");
  if (title === "под игото" && author.includes("вазов")) return "https://chitanka.info/book/1773-pod-igoto";
  if (title === "бай ганьо" && author.includes("константинов")) return "https://chitanka.info/book/1763-baj-ganxo";
  return null;
}
