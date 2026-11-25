// Local-only personal library. No database writes or payment processing.
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
  const favorite=b=>read().favorites.includes(id(b));
  function toggle(b) { return change(s=>{s.favorites=s.favorites.includes(id(b))?s.favorites.filter(x=>x!==id(b)):[...s.favorites,id(b)];}); }
  function visit(b) { return change(s=>{s.recent=[id(b),...s.recent.filter(x=>x!==id(b))].slice(0,10);}); }
  function recommendations(items) {
    const s=read(), weights=new Map();
    for(const b of items) {
      const weight=(s.favorites.includes(id(b))?3:0)+(s.recent.includes(id(b))?1:0);
      if(weight) weights.set(b.genre,(weights.get(b.genre)||0)+weight);
    }
    return items.filter(b=>!s.favorites.includes(id(b))&&!s.recent.includes(id(b))&&remainingCopies(b)>0)
      .map((b,i)=>({b,i,score:weights.get(b.genre)||0}))
      .sort((a,b)=>b.score-a.score||a.i-b.i).slice(0,4).map(x=>x.b);
  }
  return {read,change,id,favorite,toggle,visit,recommendations};
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
  const b=personalButton(active?"♥":"♡",()=>{if(personalLibrary.toggle(book))renderBooks();});
  b.setAttribute("aria-pressed",String(active));
  b.setAttribute("aria-label",personalText("Любима книга","Favorite book")+": "+book.title[language]);
  return b;
}
function renderPersonalLibrary() {
  const root=document.getElementById("personalLibrary");if(!root)return;
  const s=personalLibrary.read(),year=String(new Date().getFullYear());
  root.replaceChildren(personalElement("h2",personalText("Моята библиотека","My personal library")),
    personalElement("p",personalText("Данните са само в този браузър.","Data is stored only in this browser.")));
  function group(label,items) {
    root.append(personalElement("h3",label));
    const row=personalElement("div",undefined,"personal-row");
    for(const b of items)row.append(personalButton(b.title[language],()=>openBook(b.id)));
    if(!items.length)row.append(personalElement("p",personalText("Все още няма книги.","No books yet.")));
    root.append(row);
  }
  group(personalText("♥ Любими","♥ Favorites"),books.filter(b=>s.favorites.includes(personalLibrary.id(b))));
  group(personalText("Последно разглеждани","Recently viewed"),s.recent.map(id=>books.find(b=>personalLibrary.id(b)===id)).filter(Boolean));
  group(personalText("Препоръчани за теб","Recommended for you"),personalLibrary.recommendations(books));
  const goal=Number(s.goals[year])||12,done=Array.isArray(s.finished[year])?new Set(s.finished[year]).size:0;
  root.append(personalElement("h3",personalText("Годишно предизвикателство","Annual reading challenge")+" "+year));
  const label=personalElement("label",personalText("Цел (книги): ","Goal (books): "));
  const input=personalElement("input");input.type="number";input.min="1";input.max="365";input.value=String(goal);label.append(input);
  const progress=personalElement("progress");progress.max=goal;progress.value=Math.min(done,goal);
  root.append(label,personalButton(personalText("Запази целта","Save goal"),()=>{if(input.reportValidity()&&Number.isInteger(Number(input.value))&&Number(input.value)>=1&&Number(input.value)<=365){personalLibrary.change(v=>v.goals[year]=Number(input.value));renderPersonalLibrary();}}),personalElement("p",done+" / "+goal),progress);
  const active=s.premiumUntil>Date.now();
  root.append(personalElement("h3","BookConnect Premium — €27 / "+personalText("година","year")),
    personalElement("p",personalText("Демо абонамент, без плащане или отключване на лицензирани книги.","Demo subscription, no payment or licensed content unlocked.")),
    personalElement("p",active?personalText("Демо активен до ","Demo active until ")+new Date(s.premiumUntil).toLocaleDateString(language):personalText("Неактивен","Inactive")),
    personalButton(active?personalText("Прекрати демото","End demo"):personalText("Активирай демо","Activate demo"),()=>{personalLibrary.change(v=>{const d=new Date();d.setFullYear(d.getFullYear()+1);v.premiumUntil=active?0:d.getTime();});renderPersonalLibrary();}));
}
function renderPersonalDetails(book) {
  const root=document.getElementById("personalDetails");if(!root)return;
  root.replaceChildren();
  const id=personalLibrary.id(book),s=personalLibrary.read(),year=String(new Date().getFullYear());
  const finished=Array.isArray(s.finished[year])&&s.finished[year].includes(id);
  root.append(personalButton(finished?personalText("Отмени прочетена","Undo finished"):personalText("Отбележи като прочетена","Mark as finished"),()=>{
    personalLibrary.change(v=>{const a=Array.isArray(v.finished[year])?v.finished[year]:[];v.finished[year]=finished?a.filter(x=>x!==id):[...new Set([...a,id])];});renderPersonalDetails(book);renderPersonalLibrary();
  }));
  const review=s.reviews[id]||{};
  const rating=personalElement("select");rating.setAttribute("aria-label",personalText("Оценка","Rating"));
  for(let i=1;i<=5;i++){const o=personalElement("option",i+" ★");o.value=String(i);rating.append(o);}rating.value=String(review.rating||5);
  const comment=personalElement("textarea");comment.maxLength=500;comment.value=typeof review.comment==="string"?review.comment:"";comment.placeholder=personalText("Лично ревю","Private review");comment.setAttribute("aria-label",comment.placeholder);
  root.append(personalElement("h3",personalText("Моята оценка и ревю","My rating and review")),rating,comment,
    personalButton(personalText("Запази ревю","Save review"),()=>{if(personalLibrary.change(v=>v.reviews[id]={rating:Number(rating.value),comment:comment.value.trim()}))showNotice(personalText("Ревюто е запазено локално.","Review saved locally."));}),
    personalButton(personalText("Изтрий ревю","Delete review"),()=>{personalLibrary.change(v=>delete v.reviews[id]);renderPersonalDetails(book);}));
  const pdf=personalElement("input");pdf.type="file";pdf.accept="application/pdf,.pdf";pdf.setAttribute("aria-label",personalText("Избери разрешен PDF","Choose authorized PDF"));
  pdf.addEventListener("change",()=>{const file=pdf.files[0];if(!file)return;if(file.type!=="application/pdf"&&!/\.pdf$/i.test(file.name))return;const url=URL.createObjectURL(file);const a=document.createElement("a");a.href=url;a.target="_blank";a.rel="noopener noreferrer";a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);});
  root.append(personalElement("h3",personalText("Чети собствен PDF","Read your own PDF")),personalElement("p",personalText("Избери файл, който имаш право да четеш. Не се качва на сървър.","Choose a file you have permission to read. It is not uploaded.")),pdf);
}
function updateSearchSuggestions() {
  const input=document.getElementById("catalogSearch"),list=document.getElementById("catalogSuggestions");if(!input||!list)return;
  list.replaceChildren();if(!input.value.trim())return;
  for(const b of rankCatalog(books,input.value).slice(0,6)){const o=document.createElement("option");o.value=b.title[language];list.append(o);}
}
