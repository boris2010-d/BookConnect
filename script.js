
/* BookConnect — Stage 3: authenticated real Supabase reservations. */
const SUPABASE_URL = "https://hnbyqcohznceoefmzzpl.supabase.co";

const SUPABASE_KEY = "sb_publishable_3uTZGoFy9Stvq711wkTXxg_JytjGLNA";

const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const translations = {
  bg: {
    home: "Начало",
    accountTitle: "Профил",
    accountHelp: "Регистрирай се или влез, за да резервираш реални екземпляри от Supabase.",
    accountEmail: "Имейл", accountPassword: "Парола",
    signIn: "Вход", signUp: "Регистрация", signOut: "Изход",
    signedOut: "Влез, за да резервираш книга.",
    confirmEmail: "Провери имейла си за потвърждение на регистрацията.",
    signedInAs: "Влязъл потребител: ",
    authError: "Грешка при вход или регистрация: ",
    reservationError: "Резервацията не беше извършена: ",
    cancelError: "Неуспешен отказ: ",
    reservationLogin: "За резервация първо влез в профила си.",
    catalog: "Каталог",
    librarianNav: "Библиотекар",
    myBooks: "Моите книги",
    howNav: "Как работи",
    aboutNav: "За библиотеката",
    welcome: "Добре дошъл в BookConnect",
    heroText: "Открий, резервирай и заеми книги от училищната библиотека.",
    searchPlaceholder: "Търси книга по заглавие, автор или тема...",
    search: "Търси",
    browse: "Разгледай каталога",
    browseDesc: "Открий интересни книги",
    reserve: "Резервирай книга",
    reserveDesc: "Запази книга онлайн",
    borrow: "Заеми книга",
    borrowDesc: "Вземи книга от библиотеката",
    stats: "Моите книги",
    statsDesc: "Проследи резервациите си",
    newBooks: "Книги в каталога",
    filterPlaceholder: "Търси по заглавие или автор...",
    allGenres: "Всички жанрове",
    classic: "Класика",
    children: "Детска литература",
    fantasy: "Фентъзи",
    modern: "Съвременна",
    allBooks: "Всички книги",
    availableOnly: "Само налични",
    noResults: "Няма намерени книги.",
    details: "Виж детайли",
    available: "Налична",
    unavailable: "Няма свободни екземпляри",
    copies: "бр.",
    author: "Автор",
    genre: "Жанр",
    howTitle: "Как работи BookConnect?",
    step1: "1. Намери книга",
    step1Desc: "Потърси по заглавие, автор или тема.",
    step2: "2. Резервирай",
    step2Desc: "Запази избраната книга онлайн.",
    step3: "3. Заеми",
    step3Desc: "Вземи книгата от библиотекаря.",
    step4: "4. Върни",
    step4Desc: "Върни книгата в определения срок.",
    myReservations: "Моите резервации",
    demoNote: "Реални резервации в Supabase за влезлия потребител.",
    noReservations: "Все още нямаш резервации.",
    cancel: "Откажи",
    removeHistory: "Изтрий от историята",
    removedHistory: "Записът е изтрит от историята.",
    deleteError: "Изтриването е неуспешно: ",
    cancelledStatus: "Отказана",
    reserved: "Резервирана",
    alreadyReserved: "Вече си резервирал тази книга.",
    reservationSuccess: "Книгата е резервирана успешно в Supabase.",
    reservationCancelled: "Резервацията е отменена.",
    noCopies: "Няма свободни екземпляри за резервация.",
    aboutTitle: "За нашата библиотека",
    aboutText: "BookConnect е уеб система за управление на училищната библиотека. Учениците могат да откриват и резервират книги, а библиотекарят организира заеманията и връщанията.",
    explore: "Разгледай книгите",
    footerDesc: "Училищна библиотека"
  },

  en: {
    home: "Home",
    accountTitle: "Account",
    accountHelp: "Sign up or sign in to reserve real copies in Supabase.",
    accountEmail: "Email", accountPassword: "Password",
    signIn: "Sign in", signUp: "Sign up", signOut: "Sign out",
    signedOut: "Sign in to reserve a book.",
    confirmEmail: "Check your email to confirm registration.",
    signedInAs: "Signed in as: ",
    authError: "Sign-in or registration error: ",
    reservationError: "Could not reserve: ",
    cancelError: "Could not cancel: ",
    reservationLogin: "Sign in to reserve a book.",
    catalog: "Catalog",
    librarianNav: "Librarian",
    myBooks: "My books",
    howNav: "How it works",
    aboutNav: "About the library",
    welcome: "Welcome to BookConnect",
    heroText: "Discover, reserve and borrow books from your school library.",
    searchPlaceholder: "Search by title, author or topic...",
    search: "Search",
    browse: "Browse catalog",
    browseDesc: "Discover interesting books",
    reserve: "Reserve a book",
    reserveDesc: "Reserve a book online",
    borrow: "Borrow a book",
    borrowDesc: "Collect a book from the library",
    stats: "My books",
    statsDesc: "Track your reservations",
    newBooks: "Books in the catalog",
    filterPlaceholder: "Search by title or author...",
    allGenres: "All genres",
    classic: "Classic",
    children: "Children's literature",
    fantasy: "Fantasy",
    modern: "Modern",
    allBooks: "All books",
    availableOnly: "Available only",
    noResults: "No books found.",
    details: "View details",
    available: "Available",
    unavailable: "No available copies",
    copies: "copies",
    author: "Author",
    genre: "Genre",
    howTitle: "How does BookConnect work?",
    step1: "1. Find a book",
    step1Desc: "Search by title, author or topic.",
    step2: "2. Reserve",
    step2Desc: "Reserve your chosen book online.",
    step3: "3. Borrow",
    step3Desc: "Collect the book from the librarian.",
    step4: "4. Return",
    step4Desc: "Return the book before its due date.",
    myReservations: "My reservations",
    demoNote: "Real Supabase reservations for the signed-in user.",
    noReservations: "You have no reservations yet.",
    cancel: "Cancel",
    removeHistory: "Remove from history",
    removedHistory: "Record removed from history.",
    deleteError: "Deletion failed: ",
    cancelledStatus: "Cancelled",
    reserved: "Reserved",
    alreadyReserved: "You have already reserved this book.",
    reservationSuccess: "Book reserved successfully in Supabase.",
    reservationCancelled: "Reservation cancelled.",
    noCopies: "No copies are available for reservation.",
    aboutTitle: "About our library",
    aboutText: "BookConnect is a web application for managing a school library. Students can find and reserve books, while librarians manage loans and returns.",
    explore: "Explore books",
    footerDesc: "School library"
  }
};

function t(key) {
  return translations[language]?.[key] || key;
}

// Source of truth: public.books joined with genres and copies in Supabase.
const books = [];

let language = "bg";
let selectedBookId = null;
let reservations = []; // {id, book_id, copy_id, status}
let currentUser = null;
let pendingReservation = false;
function remainingCopies(book) {
  // Supabase copy status is authoritative, not localStorage.
  return Math.max(0, book.copies);
}
function hasReservation(bookId) {
  return reservations.some(item => item.book_id === bookId && item.status === "active");
}
async function loadReservations() {
  if (!currentUser) { reservations = []; renderReservations(); renderBooks(); return; }
  const {data,error} = await db.from("reservations")
    .select("id,book_id,copy_id,status,created_at")
    .eq("user_id",currentUser.id).order("created_at",{ascending:false});
  if (error) { console.error(error); showNotice(t("reservationError")+error.message); return; }
  reservations = data || [];
  renderReservations(); renderBooks();
}
function updateAccount() {
  document.getElementById("accountForm").hidden = Boolean(currentUser);
  document.getElementById("signOutBtn").hidden = !currentUser;
  document.getElementById("accountStatus").textContent =
    currentUser ? t("signedInAs") + (currentUser.email || currentUser.id) : t("signedOut");
  renderBooks();
}
// LANGUAGE SWITCHING

function setLanguage(lang) {
  language = lang;
  document.documentElement.lang = lang;
  window.bookConnectTheme?.updateButton?.();

  document.querySelectorAll("[data-i18n]").forEach(element => {
    element.textContent = t(element.dataset.i18n);
  });

  document.querySelectorAll("[data-placeholder]").forEach(element => {
    element.placeholder = t(element.dataset.placeholder);
  });

  document.getElementById("bgBtn")
    .classList.toggle("active", lang === "bg");

  document.getElementById("enBtn")
    .classList.toggle("active", lang === "en");

  renderBooks();
  renderReservations();
  updateAccount();

  if (selectedBookId !== null) {
    openBook(selectedBookId);
  }
}


async function loadBooksFromSupabase() {
  document.getElementById("noResults").textContent = language === "bg" ? "Зареждане на книгите..." : "Loading books...";
  document.getElementById("noResults").style.display = "block";
  const { data, error } = await db
    .from("books")
    .select(`
      *,
      genres(code),
      copies(status)
    `)
    .order("id");

  if (error) {
    console.error("Supabase error:", error);
    document.getElementById("noResults").textContent = language === "bg" ? "Неуспешно зареждане от базата данни." : "Database loading failed.";
    document.getElementById("noResults").style.display = "block";
    showNotice(language === "bg" ? "Грешка при зареждането на книгите от базата." : "Could not load books from the database.");
    return;
  }

  books.length = 0;
  document.getElementById("noResults").textContent = t("noResults");

  data.forEach(item => {
    books.push({
      id: item.id,
      title: {
        bg: item.title_bg,
        en: item.title_en
      },
      author: {
        bg: item.author_bg,
        en: item.author_en
      },
      genre: item.genres?.code || "classic",
      copies: (item.copies || []).filter(
        copy => copy.status === "available"
      ).length,
      cover: item.cover_url,
      description: {
        bg: item.description_bg,
        en: item.description_en
      }
    });
  });

  renderBooks();
  renderReservations();
}

// BOOK CATALOG

function renderBooks() {
  const query = document.getElementById("catalogSearch")
    .value.trim().toLocaleLowerCase();

  const genre = document.getElementById("genreFilter").value;
  const availability = document.getElementById("availabilityFilter").value;

  const filtered = books.filter(book => {
    const searchableText = [
      book.title.bg,
      book.title.en,
      book.author.bg,
      book.author.en,
      t(book.genre)
    ].join(" ").toLocaleLowerCase();

    return searchableText.includes(query)
      && (genre === "all" || book.genre === genre)
      && (availability === "all" || remainingCopies(book) > 0);
  });

  const grid = document.getElementById("bookGrid");
  grid.innerHTML = "";

  filtered.forEach(book => {
    const card = document.createElement("article");
    card.className = "book-card";

    const image = document.createElement("img");
    image.className = "book-cover";
    image.src = book.cover;
    image.alt = book.title[language];
    image.loading = "lazy";

    const title = document.createElement("h3");
    title.textContent = book.title[language];

    const author = document.createElement("div");
    author.className = "author";
    author.textContent = book.author[language];

    const genreTag = document.createElement("div");
    const genreInner = document.createElement("span");
    genreInner.className = "tag";
    genreInner.textContent = t(book.genre);
    genreTag.appendChild(genreInner);

    const count = document.createElement("div");
    const remaining = remainingCopies(book);

    count.className = remaining > 0 ? "available" : "unavailable";

    count.textContent = remaining > 0
      ? "● " + t("available") + " (" + remaining + " " + t("copies") + ")"
      : "● " + t("unavailable");

    const button = document.createElement("button");
    button.className = "btn";
    button.textContent = t("details");

    button.addEventListener("click", () => openBook(book.id));

    card.append(image, title, author, genreTag, count, button);
    grid.appendChild(card);
  });

  document.getElementById("noResults").style.display =
    filtered.length ? "none" : "block";
}

// HERO SEARCH

function heroSearch() {
  document.getElementById("catalogSearch").value =
    document.getElementById("heroSearch").value;

  renderBooks();

  document.getElementById("catalog")
    .scrollIntoView({ behavior: "smooth" });
}

// BOOK DETAILS MODAL

function openBook(id) {
  const book = books.find(book => book.id === id);
  if (!book) return;

  selectedBookId = id;

  document.getElementById("modalTitle").textContent =
    book.title[language];

  document.getElementById("modalCover").src = book.cover;

  document.getElementById("modalCover").alt =
    book.title[language];

  document.getElementById("modalAuthor").textContent =
    t("author") + ": " + book.author[language];

  document.getElementById("modalGenre").textContent =
    t("genre") + ": " + t(book.genre);

  document.getElementById("modalDescription").textContent =
    book.description[language];

  const remaining = remainingCopies(book);

  document.getElementById("modalAvailable").textContent =
    remaining > 0
      ? t("available") + ": " + remaining + " " + t("copies")
      : t("unavailable");

  const button = document.getElementById("reserveBtn");
  const alreadyReserved = hasReservation(id);

  button.textContent = alreadyReserved ? t("reserved") : t("reserve");
  button.disabled = pendingReservation || alreadyReserved || remaining === 0;
  button.style.opacity = button.disabled ? ".5" : "1";

  document.getElementById("bookModal").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("bookModal").classList.remove("open");
  document.body.style.overflow = "";
  selectedBookId = null;
}

function closeOnBackdrop(event) {
  if (event.target.id === "bookModal") {
    closeModal();
  }
}

// STAGE 3: REAL TRANSACTIONAL RESERVATIONS
async function reserveSelected() {
  if (selectedBookId === null || pendingReservation) return;
  if (!currentUser) {
    closeModal();
    document.getElementById("account").scrollIntoView({behavior:"smooth"});
    showNotice(t("reservationLogin"));
    return;
  }
  const bookId=selectedBookId;
  if (hasReservation(bookId)) { showNotice(t("alreadyReserved")); return; }
  pendingReservation=true;
  document.getElementById("reserveBtn").disabled=true;
  try {
    const {error}=await db.rpc("reserve_book",{p_book_id:bookId});
    if (error) throw error;
    closeModal();
    document.getElementById("myBooks").style.display="block";
    await Promise.all([loadBooksFromSupabase(),loadReservations()]);
    showNotice(t("reservationSuccess"));
  } catch (error) {
    console.error(error);
    showNotice(t("reservationError")+error.message);
  } finally { pendingReservation=false; if(selectedBookId!==null)openBook(selectedBookId); }
}
async function deleteCancelledReservation(reservationId) {
  if (!currentUser) return;
  const {data,error}=await db.from("reservations").delete()
    .eq("id",reservationId).eq("status","cancelled").select("id");
  if (error || !data?.length) {
    showNotice(t("deleteError")+(error?.message||"Permission denied"));
    return;
  }
  await loadReservations();
  showNotice(t("removedHistory"));
}
async function cancelReservation(reservationId) {
  if (!currentUser) return;
  const {error}=await db.rpc("cancel_my_reservation",{p_reservation_id:reservationId});
  if(error) {console.error(error);showNotice(t("cancelError")+error.message);return;}
  await Promise.all([loadBooksFromSupabase(),loadReservations()]);
  showNotice(t("reservationCancelled"));
}
function renderReservations() {
  const container=document.getElementById("reservationList");
  container.replaceChildren();
  if (!reservations.length) {
    const p=document.createElement("p");p.className="empty";p.textContent=t("noReservations");
    container.appendChild(p);return;
  }
  for (const reservation of reservations) {
    const book=books.find(item=>item.id===reservation.book_id);
    const row=document.createElement("div");row.className="my-item";
    const info=document.createElement("div");
    const title=document.createElement("strong");
    title.textContent=book ? book.title[language] : "#"+reservation.book_id;
    const status=document.createElement("p");
    const active=reservation.status==="active";
    status.textContent=t(active?"reserved":"cancelledStatus") + " · #"+reservation.id;
    info.append(title,status);
    const button=document.createElement("button");
    button.className="btn btn-outline";
    button.textContent=t(active?"cancel":"removeHistory");
    button.addEventListener("click",()=>active
      ? cancelReservation(reservation.id)
      : deleteCancelledReservation(reservation.id));
    row.append(info,button);container.append(row);
  }
}
function showMyBooks() {
  document.getElementById("myBooks").style.display="block";
  renderReservations();
}

// NOTIFICATIONS

let noticeTimeout;

function showNotice(message) {
  const element = document.getElementById("notice");

  element.textContent = message;
  element.style.display = "block";

  clearTimeout(noticeTimeout);

  noticeTimeout = setTimeout(() => {
    element.style.display = "none";
  }, 3500);
}

// EVENTS

document.getElementById("catalogSearch")
  .addEventListener("input", renderBooks);

document.getElementById("genreFilter")
  .addEventListener("change", renderBooks);

document.getElementById("availabilityFilter")
  .addEventListener("change", renderBooks);

document.getElementById("heroSearch")
  .addEventListener("keydown", event => {
    if (event.key === "Enter") {
      heroSearch();
    }
  });

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeModal();
  }
});

// ACCOUNT AUTHENTICATION
document.getElementById("accountForm").addEventListener("submit",async event=>{
  event.preventDefault();
  const email=document.getElementById("accountEmail").value.trim();
  const password=document.getElementById("accountPassword").value;
  const {error}=await db.auth.signInWithPassword({email,password});
  document.getElementById("accountPassword").value="";
  if(error)showNotice(t("authError")+error.message);
});
document.getElementById("signUpBtn").addEventListener("click",async ()=>{
  const form=document.getElementById("accountForm");
  if(!form.reportValidity())return;
  const email=document.getElementById("accountEmail").value.trim();
  const password=document.getElementById("accountPassword").value;
  const {data,error}=await db.auth.signUp({email,password});
  document.getElementById("accountPassword").value="";
  if(error)showNotice(t("authError")+error.message);
  else if(!data.session)showNotice(t("confirmEmail"));
});
document.getElementById("signOutBtn").addEventListener("click",async ()=>{
  const {error}=await db.auth.signOut();
  if(error)showNotice(t("authError")+error.message);
});
db.auth.onAuthStateChange((_event,session)=>{
  currentUser=session?.user||null;
  updateAccount();
  // Defer database calls outside the auth callback.
  setTimeout(()=>{loadReservations();loadBooksFromSupabase();},0);
});
setLanguage("bg");
loadBooksFromSupabase();
db.auth.getUser().then(({data,error})=>{
  currentUser=error?null:data.user;
  updateAccount();
  loadReservations();
});
