"use strict";
const SUPABASE_URL = "https://hnbyqcohznceoefmzzpl.supabase.co";
const KEY = "sb_publishable_3uTZGoFy9Stvq711wkTXxg_JytjGLNA";
const db = window.supabase.createClient(SUPABASE_URL, KEY);
const $ = id => document.getElementById(id);
const strings = {
  bg: {catalog:"Каталог",dashboard:"Панел на библиотекаря",intro:"Данни от Supabase за книги и налични екземпляри.",refresh:"Обнови",genres:"Жанрове",books:"Книги",total:"Всички екземпляри",available:"Налични",inventory:"Каталог и наличности",title:"Заглавие",author:"Автор",genre:"Жанр",staff:"Вход за библиотекар",accessHelp:"Прегледът е публичен, но добавянето на книга е достъпно само за одобрен библиотекар.",email:"Имейл",password:"Парола",login:"Вход",logout:"Изход",add:"Добави книга",titleBg:"Заглавие (BG)",titleEn:"Заглавие (EN)",authorBg:"Автор (BG)",authorEn:"Автор (EN)",save:"Запази книга",writeNote:"Записът е защитен и достъпен само за библиотекар.",loading:"Зареждане...",loaded:"Данните са заредени от Supabase.",error:"Неуспешно зареждане на данните.",noBooks:"Няма намерени книги.",signedOut:"Няма влязъл потребител.",noPermission:"Потребителят няма права на библиотекар.",signedIn:"Влязъл библиотекар.",loginError:"Неуспешен вход: ",saveOk:"Книгата и първият ѝ екземпляр са добавени.",saveError:"Грешка при запис: "},
  en: {catalog:"Catalog",dashboard:"Librarian dashboard",intro:"Live book and copy availability from Supabase.",refresh:"Refresh",genres:"Genres",books:"Books",total:"Total copies",available:"Available",inventory:"Books and inventory",title:"Title",author:"Author",genre:"Genre",staff:"Librarian sign-in",accessHelp:"Inventory is public, but adding a book requires an approved librarian account.",email:"Email",password:"Password",login:"Sign in",logout:"Sign out",add:"Add a book",titleBg:"Title (BG)",titleEn:"Title (EN)",authorBg:"Author (BG)",authorEn:"Author (EN)",save:"Save book",writeNote:"Writes are protected and limited to librarians.",loading:"Loading...",loaded:"Loaded from Supabase.",error:"Could not load data.",noBooks:"No books found.",signedOut:"Not signed in.",noPermission:"This account is not authorized as a librarian.",signedIn:"Librarian signed in.",loginError:"Sign-in failed: ",saveOk:"Book and first copy added.",saveError:"Save failed: "}
};
let lang = "bg";
let books = [];
let genres = [];
let sessionUser = null;
const t = key => strings[lang][key] || key;
function setLanguage(next) {
  lang = next;
  document.documentElement.lang = next;
  document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
  $("bgBtn").classList.toggle("active",next === "bg");
  $("enBtn").classList.toggle("active",next === "en");
  render();
  updateAuth();
}
function render(){
  $("genreCount").textContent = genres.length;
  $("bookCount").textContent = books.length;
  $("totalCount").textContent = books.reduce((n,b)=>n+(b.copies||[]).length,0);
  $("availableCount").textContent = books.reduce((n,b)=>n+(b.copies||[]).filter(c=>c.status==="available").length,0);
  const tbody = $("inventoryRows");
  tbody.replaceChildren();
  if (!books.length) {
    const tr = document.createElement("tr"), td = document.createElement("td");
    td.colSpan=5; td.textContent=t("noBooks"); tr.append(td); tbody.append(tr); return;
  }
  for (const book of books) {
    const row = document.createElement("tr");
    const values = [book["title_"+lang],book["author_"+lang],book.genres?.["name_"+lang]||"",String((book.copies||[]).length),String((book.copies||[]).filter(c=>c.status==="available").length)];
    for(const value of values) { const td=document.createElement("td"); td.textContent=value||""; row.append(td); }
    tbody.append(row);
  }
  const selected = $("addGenre").value;
  $("addGenre").replaceChildren();
  for (const genre of genres) {
    const option = document.createElement("option");
    option.value=String(genre.id);option.textContent=genre["name_"+lang];$("addGenre").append(option);
  }
  if (selected) $("addGenre").value=selected;
}
async function loadData(){
  $("dbStatus").textContent=t("loading");
  const [bookResult,genreResult] = await Promise.all([
    db.from("books").select("id,title_bg,title_en,author_bg,author_en,genres(name_bg,name_en),copies(status)").order("id"),
    db.from("genres").select("id,name_bg,name_en").order("id")
  ]);
  if (bookResult.error || genreResult.error) {
    console.error(bookResult.error || genreResult.error);
    $("dbStatus").textContent=t("error");
    return;
  }
  books=bookResult.data||[]; genres=genreResult.data||[];
  $("dbStatus").textContent=t("loaded"); render();
}
function isLibrarian(user){
  return Boolean(user && user.app_metadata && user.app_metadata.role==="librarian" && !user.is_anonymous);
}
function updateAuth(){
  const allowed=isLibrarian(sessionUser);
  $("loginForm").hidden=Boolean(sessionUser);
  $("logoutBtn").hidden=!sessionUser;
  $("addPanel").hidden=!allowed;
  $("authStatus").textContent = !sessionUser?t("signedOut"):(allowed?t("signedIn"):t("noPermission"));
}
$("bgBtn").addEventListener("click",()=>setLanguage("bg"));
$("enBtn").addEventListener("click",()=>setLanguage("en"));
$("refreshBtn").addEventListener("click",loadData);
$("loginForm").addEventListener("submit",async event=>{
  event.preventDefault();
  $("loginBtn").disabled=true;
  const {data,error}=await db.auth.signInWithPassword({email:$("email").value.trim(),password:$("password").value});
  $("password").value="";
  $("loginBtn").disabled=false;
  if(error){$("authStatus").textContent=t("loginError")+error.message;return;}
  sessionUser=data.user;updateAuth();
});
$("logoutBtn").addEventListener("click",async()=>{
  await db.auth.signOut(); sessionUser=null;updateAuth();
});
$("addBookForm").addEventListener("submit",async event=>{
  event.preventDefault();
  if(!isLibrarian(sessionUser)){updateAuth();return;}
  $("saveBtn").disabled=true;
  const payload={
    p_title_bg:$("titleBg").value.trim(),
    p_title_en:$("titleEn").value.trim(),
    p_author_bg:$("authorBg").value.trim(),
    p_author_en:$("authorEn").value.trim(),
    p_genre_id:Number($("addGenre").value),
    p_inventory_number:$("inventoryNumber").value.trim()
  };
  const {error}=await db.rpc("add_book_with_copy",payload);
  $("saveBtn").disabled=false;
  if(error){$("authStatus").textContent=t("saveError")+error.message;return;}
  $("authStatus").textContent=t("saveOk");
  $("addBookForm").reset();await loadData();
});
// Public inventory must load even when the visitor has no account.
setLanguage("bg");
loadData().catch(error=>{
  console.error("Inventory loading failed:",error);
  $("dbStatus").textContent=t("error")+" "+error.message;
});
db.auth.getUser().then(({data,error})=>{
  sessionUser=error?null:data.user;
  updateAuth();
}).catch(error=>console.warn("Authentication check:",error));
db.auth.onAuthStateChange((_event,session)=>{
  sessionUser=session?.user||null;
  updateAuth();
});
