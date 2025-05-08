document.addEventListener("DOMContentLoaded", () => {
  // Array to store books (initially loaded from localStorage)
  let books = JSON.parse(localStorage.getItem("books")) || [];

  // DOM elements
  const bookForm = document.getElementById("bookForm");
  const searchForm = document.getElementById("searchBook");
  const searchInput = document.getElementById("searchBookTitle");
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");
  const bookFormSubmitButton = document.getElementById("bookFormSubmit");

  // Function to generate a unique ID for each book
  const generateId = () => {
    return +new Date();
  };

  // Function to save books to localStorage
  const saveBooks = () => {
    localStorage.setItem("books", JSON.stringify(books));
  };

  // Function to create a book element based on the template
  const createBookElement = (book) => {
    const bookItem = document.createElement("div");
    bookItem.setAttribute("data-bookid", book.id);
    bookItem.setAttribute("data-testid", "bookItem");

    bookItem.innerHTML = `
        <h3 data-testid="bookItemTitle">${book.title}</h3>
        <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
        <p data-testid="bookItemYear">Tahun: ${book.year}</p>
        <div>
          <button data-testid="bookItemIsCompleteButton">
            ${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}
          </button>
          <button data-testid="bookItemDeleteButton">Hapus Buku</button>
          <button data-testid="bookItemEditButton">Edit Buku</button>
        </div>
      `;

    // Add event listeners for buttons
    bookItem
      .querySelector('[data-testid="bookItemIsCompleteButton"]')
      .addEventListener("click", () => {
        toggleBookCompletion(book.id);
      });

    bookItem
      .querySelector('[data-testid="bookItemDeleteButton"]')
      .addEventListener("click", () => {
        deleteBook(book.id);
      });

    bookItem
      .querySelector('[data-testid="bookItemEditButton"]')
      .addEventListener("click", () => {
        editBook(book.id);
      });

    return bookItem;
  };

  // Function to render books to the appropriate list
  const renderBooks = (searchTerm = "") => {
    // Clear existing lists
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";

    // Filter books based on search term (case-insensitive)
    const filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // If no books match the search, show a message
    if (filteredBooks.length === 0 && searchTerm) {
      const noResultMessage = document.createElement("p");
      noResultMessage.textContent =
        "Tidak ada buku yang cocok dengan pencarian.";
      incompleteBookList.appendChild(noResultMessage);
      return;
    }

    // Render filtered books to their respective lists
    filteredBooks.forEach((book) => {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        completeBookList.appendChild(bookElement);
      } else {
        incompleteBookList.appendChild(bookElement);
      }
    });
  };

  // Function to add a new book
  const addBook = (title, author, year, isComplete) => {
    const newBook = {
      id: generateId(),
      title,
      author,
      year: parseInt(year),
      isComplete,
    };
    books.push(newBook);
    saveBooks();
    renderBooks();
  };

  // Function to toggle book completion status
  const toggleBookCompletion = (bookId) => {
    const book = books.find((b) => b.id === bookId);
    if (book) {
      book.isComplete = !book.isComplete;
      saveBooks();
      renderBooks(searchInput.value); // Preserve search term during render
    }
  };

  // Function to delete a book
  const deleteBook = (bookId) => {
    books = books.filter((b) => b.id !== bookId);
    saveBooks();
    renderBooks(searchInput.value); // Preserve search term during render
  };

  // Function to edit a book
  const editBook = (bookId) => {
    const book = books.find((b) => b.id === bookId);
    if (book) {
      const newTitle = prompt("Masukkan judul baru:", book.title);
      const newAuthor = prompt("Masukkan penulis baru:", book.author);
      const newYear = prompt("Masukkan tahun baru:", book.year);

      if (newTitle && newAuthor && newYear) {
        book.title = newTitle;
        book.author = newAuthor;
        book.year = parseInt(newYear);
        saveBooks();
        renderBooks(searchInput.value); // Preserve search term during render
      }
    }
  };

  // Event listener for book form submission
  bookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = document.getElementById("bookFormYear").value;
    const isComplete = document.getElementById("bookFormIsComplete").checked;

    addBook(title, author, year, isComplete);
    bookForm.reset();
    searchInput.value = ""; // Clear search input after adding a new book
  });

  // Event listener for search form submission
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();
    renderBooks(searchTerm);
  });

  // Real-time search as the user types
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.trim();
    renderBooks(searchTerm);
  });

  // Update the submit button text based on the checkbox
  document
    .getElementById("bookFormIsComplete")
    .addEventListener("change", (e) => {
      const span = bookFormSubmitButton.querySelector("span");
      span.textContent = e.target.checked
        ? "Selesai dibaca"
        : "Belum selesai dibaca";
    });

  // Initial render
  renderBooks();
});
