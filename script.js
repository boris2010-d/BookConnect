
const books = [
    {
        title: "Под игото",
        author: "Иван Вазов",
        genre: "Роман",
        available: true
    },
    {
        title: "Бай Ганьо",
        author: "Алеко Константинов",
        genre: "Сатира",
        available: true
    },
    {
        title: "Немили-недраги",
        author: "Иван Вазов",
        genre: "Повест",
        available: false
    },
    {
        title: "Железният светилник",
        author: "Димитър Талев",
        genre: "Роман",
        available: true
    },
    {
        title: "Тютюн",
        author: "Димитър Димов",
        genre: "Роман",
        available: false
    }
];

const bookList = document.getElementById("book-list");
const searchInput = document.getElementById("search");

function displayBooks(bookArray) {
    bookList.innerHTML = "";

    if (bookArray.length === 0) {
        bookList.textContent = "Няма намерени книги.";
        return;
    }

    bookArray.forEach(function(book) {
        const card = document.createElement("div");
        card.className = "book-card";

        const title = document.createElement("h3");
        title.textContent = book.title;

        const author = document.createElement("p");
        author.textContent = "Автор: " + book.author;

        const genre = document.createElement("p");
        genre.textContent = "Жанр: " + book.genre;

        const status = document.createElement("p");
        status.textContent = book.available
            ? "Налична"
            : "Заета";

        status.className = book.available
            ? "available"
            : "unavailable";

        card.appendChild(title);
        card.appendChild(author);
        card.appendChild(genre);
        card.appendChild(status);

        bookList.appendChild(card);
    });
}

function searchBooks() {
    const query = searchInput.value
        .toLocaleLowerCase("bg-BG")
        .trim();

    const filteredBooks = books.filter(function(book) {
        return book.title.toLocaleLowerCase("bg-BG").includes(query) ||
               book.author.toLocaleLowerCase("bg-BG").includes(query);
    });

    displayBooks(filteredBooks);
}

searchInput.addEventListener("input", searchBooks);

displayBooks(books);
