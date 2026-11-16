
/*
 * BookConnect — Stage 2
 * Catalog, search, filters and BG/EN translations.
 * Reservations are currently a local demo.
 * Supabase integration will be added next.
 */

const translations = {
  bg: {
    home: "Начало",
    catalog: "Каталог",
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
    demoNote: "Демонстрационни резервации, запазени само в този браузър.",
    noReservations: "Все още нямаш резервации.",
    cancel: "Откажи",
    reserved: "Резервирана",
    alreadyReserved: "Вече си резервирал тази книга.",
    reservationSuccess: "Книгата е резервирана успешно (демо).",
    reservationCancelled: "Резервацията е отменена.",
    noCopies: "Няма свободни екземпляри за резервация.",
    aboutTitle: "За нашата библиотека",
    aboutText: "BookConnect е уеб система за управление на училищната библиотека. Учениците могат да откриват и резервират книги, а библиотекарят организира заеманията и връщанията.",
    explore: "Разгледай книгите",
    footerDesc: "Училищна библиотека"
  },

  en: {
    home: "Home",
    catalog: "Catalog",
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
    demoNote: "Demo reservations stored only in this browser.",
    noReservations: "You have no reservations yet.",
    cancel: "Cancel",
    reserved: "Reserved",
    alreadyReserved: "You have already reserved this book.",
    reservationSuccess: "Book reserved successfully (demo).",
    reservationCancelled: "Reservation cancelled.",
    noCopies: "No copies are available for reservation.",
    aboutTitle: "About our library",
    aboutText: "BookConnect is a web application for managing a school library. Students can find and reserve books, while librarians manage loans and returns.",
    explore: "Explore books",
    footerDesc: "School library"
  }
};

// Temporary sample data.
// In the next step these books will come from Supabase.

const books = [
  {
    id: 1,
    title: { bg: "Под игото", en: "Under the Yoke" },
    author: { bg: "Иван Вазов", en: "Ivan Vazov" },
    genre: "classic",
    copies: 3,
    cover: "https://placehold.co/360x500/e8d1a6/563c20?text=Pod+Igoto",
    description: {
      bg: "Класически български роман за живота и борбата за свобода преди Априлското въстание.",
      en: "A classic Bulgarian novel about life and the struggle for freedom before the April Uprising."
    }
  },
  {
    id: 2,
    title: { bg: "Малкият принц", en: "The Little Prince" },
    author: { bg: "Антоан дьо Сент-Екзюпери", en: "Antoine de Saint-Exupéry" },
    genre: "children",
    copies: 5,
    cover: "https://placehold.co/360x500/fce8bb/6d4c1c?text=The+Little+Prince",
    description: {
      bg: "Приказна история за приятелството, любовта и важните неща в живота.",
      en: "A poetic story about friendship, love and the things that truly matter."
    }
  },
  {
    id: 3,
    title: {
      bg: "Хари Потър и Философският камък",
      en: "Harry Potter and the Philosopher's Stone"
    },
    author: { bg: "Дж. К. Роулинг", en: "J. K. Rowling" },
    genre: "fantasy",
    copies: 2,
    cover: "https://placehold.co/360x500/18395b/ffffff?text=Harry+Potter",
    description: {
      bg: "Младо момче открива, че е магьосник, и започва обучението си в Хогуортс.",
      en: "A young boy discovers he is a wizard and begins studying at Hogwarts."
    }
  },
  {
    id: 4,
    title: { bg: "1984", en: "1984" },
    author: { bg: "Джордж Оруел", en: "George Orwell" },
    genre: "modern",
    copies: 4,
    cover: "https://placehold.co/360x500/9c3030/ffffff?text=1984",
    description: {
      bg: "Антиутопичен роман за общество, контролирано чрез наблюдение и пропаганда.",
      en: "A dystopian novel about a society controlled by surveillance and propaganda."
    }
  },
  {
    id: 5,
    title: { bg: "Бай Ганьо", en: "Bay Ganyo" },
    author: { bg: "Алеко Константинов", en: "Aleko Konstantinov" },
    genre: "classic",
    copies: 0,
    cover: "https://placehold.co/360x500/b2d0c5/173d37?text=Bay+Ganyo",
    description: {
      bg: "Сатирично произведение, представящо приключенията на Бай Ганьо.",
      en: "A satirical work following the adventures of Bay Ganyo."
    }
  },
  {
    id: 6,
    title: { bg: "Хобит", en: "The Hobbit" },
    author: { bg: "Дж. Р. Р. Толкин", en: "J. R. R. Tolkien" },
    genre: "fantasy",
    copies: 2,
    cover: "https://placehold.co/360x500/49704b/ffffff?text=The+Hobbit",
    description: {
      bg: "Фантастично приключение на Билбо Бегинс, който тръгва на пътешествие с джуджета.",
      en: "A fantasy adventure following Bilbo Baggins on a journey with dwarves."
    }
  }
];

let language = "bg";
let selectedBookId = null;
let reservations = [];

try {
  const saved = JSON.parse(
    localStorage.getItem("bookconnect_reservations") || "[]"
  );

  if (Array.isArray(saved)) {
    reservations = saved.filter(
      id => Number.isInteger(id) && books.some(book => book.id === id)
    );
  }
} catch (error) {
  reservations = [];
}

function t(key) {
  return translations[language][key] || key;
}

function saveReservations() {
  try {
    localStorage.setItem(
      "bookconnect_reservations",
      JSON.stringify(reservations)
    );
  } catch (error) {
    showNotice(
      language === "bg"
        ? "Браузърът не позволява запазване на резервации."
        : "Your browser could not save reservations."
    );
  }
}

function remainingCopies(book) {
  return Math.max(
    0,
    book.copies - (reservations.includes(book.id) ? 1 : 0)
  );
}

// LANGUAGE SWITCHING

function setLanguage(lang) {
  language = lang;
  document.documentElement.lang = lang;

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

  if (selectedBookId !== null) {
    openBook(selectedBookId);
  }
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
  const alreadyReserved = reservations.includes(id);

  button.textContent = alreadyReserved ? t("reserved") : t("reserve");
  button.disabled = alreadyReserved || remaining === 0;
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

// DEMO RESERVATIONS

function reserveSelected() {
  if (selectedBookId === null) return;

  const book = books.find(book => book.id === selectedBookId);
  if (!book) return;

  if (reservations.includes(book.id)) {
    showNotice(t("alreadyReserved"));
    return;
  }

  if (remainingCopies(book) <= 0) {
    showNotice(t("noCopies"));
    return;
  }

  reservations.push(book.id);
  saveReservations();

  renderBooks();
  renderReservations();
  closeModal();

  showNotice(t("reservationSuccess"));
}

function cancelReservation(id) {
  reservations = reservations.filter(bookId => bookId !== id);

  saveReservations();
  renderBooks();
  renderReservations();

  showNotice(t("reservationCancelled"));
}

function renderReservations() {
  const container = document.getElementById("reservationList");
  container.innerHTML = "";

  if (reservations.length === 0) {
    const message = document.createElement("p");
    message.className = "empty";
    message.textContent = t("noReservations");
    container.appendChild(message);
    return;
  }

  reservations.forEach(id => {
    const book = books.find(book => book.id === id);
    if (!book) return;

    const row = document.createElement("div");
    row.className = "my-item";

    const info = document.createElement("div");

    const title = document.createElement("strong");
    title.textContent = book.title[language];

    const status = document.createElement("p");
    status.textContent = t("reserved");

    info.append(title, status);

    const button = document.createElement("button");
    button.className = "btn btn-outline";
    button.textContent = t("cancel");

    button.addEventListener("click", () => {
      cancelReservation(id);
    });

    row.append(info, button);
    container.appendChild(row);
  });
}

function showMyBooks() {
  document.getElementById("myBooks").style.display = "block";
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

// INITIAL LANGUAGE

setLanguage("bg");
