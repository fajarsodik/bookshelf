const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APP";
const SESSION_TITLE = "SESSION_TITLE";

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Your browser does not support local storage");
    return false;
  }
  return true;
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function loadDataFromStorage() {
  const serializeData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializeData);
  if (data !== null) {
    for (let book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function addBook() {
  let title = document.getElementById("title").value;
  let author = document.getElementById("author").value;
  let year = document.getElementById("year").value;
  let isComplete = document.getElementById("status").checked;
  const generatedId = generateId();
  const bookObject = generateBookObject(
    generatedId,
    title,
    author,
    parseInt(year),
    isComplete
  );
  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  cleanForm();
}

function cleanForm() {
  let form = document.getElementById("form");
  form.reset();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function addBookToRead(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget === null) return;
  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addBookToUnread(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget === null) return;
  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function editBook(bookId, title, author, year, isComplete) {
  // let bookTarget = findBook(bookId);
  let bookIndex = findBookIndex(bookId);
  if (bookIndex !== -1) {
    let titlenya = typeof books[bookIndex].year;
    console.log(
      `target ${titlenya} ${bookIndex} ${books[bookIndex]} ${books[bookIndex].isComplete} ${books[bookIndex].title}`
    );
    books[bookIndex].title = title;
    books[bookIndex].author = author;
    books[bookIndex].year = year;
    books[bookIndex].isComplete = isComplete;
    // saveData();
    // document.dispatchEvent(new Event(RENDER_EVENT));
  }
}

function modalEdit(bookId) {
  const bookTarget = findBook(bookId);
  let title = document.getElementById("title-edit");
  let author = document.getElementById("author-edit");
  let year = document.getElementById("year-edit");
  let modal = document.getElementById("editBook");
  let closeModal = document.getElementById("closeModalEdit");
  let isComplete = document.getElementById("status-edit");
  let submitEdit = document.getElementById("submit-edit-btn");
  modal.classList.remove("hidden");
  author.value = bookTarget.author;
  title.value = bookTarget.title;
  year.value = bookTarget.year;
  if (bookTarget.isComplete) {
    isComplete.checked = true;
  } else {
    isComplete.checked = false;
  }
  closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
  });
  submitEdit.addEventListener("click", () => {
    console.log("klik submit edit");
    editBook(
      bookId,
      title.value,
      author.value,
      parseInt(year.value),
      isComplete.checked
    );
    cleanForm();
    modal.classList.add("hidden");
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.add("hidden");
    }
  });
}

function deleteBook(bookId) {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function modalDelete(id) {
  let modal = document.getElementById("modalDelete");
  let isDelete = document.getElementById("delete");
  let closeModal = document.getElementById("closeModalDelete");
  modal.classList.remove("hidden");
  closeModal.onclick = function () {
    modal.classList.add("hidden");
  };
  isDelete.addEventListener("click", function () {
    deleteBook(id);
    modal.classList.add("hidden");
  });
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.add("hidden");
    }
  });
}

function makeBook(bookObject) {
  const { id, title, author, year, isComplete } = bookObject;

  const cardBook = document.createElement("div");
  cardBook.classList.add(
    "rounded-lg",
    "border",
    "hover:shadow-md",
    "transition",
    "duration-100",
    "p-4",
    "my-2"
  );
  const cardTitleContainer = document.createElement("div");
  cardTitleContainer.classList.add("flex", "w-full");

  const cardTitle = document.createElement("h2");
  cardTitle.classList.add("flex", "break-all", "text-balance", "w-5/6");
  cardTitle.innerText = title;

  const cardIconAnchor = document.createElement("a");
  cardIconAnchor.classList.add("inline-flex", "ml-auto", "justify-end");
  cardIconAnchor.setAttribute("href", "#");
  cardIconAnchor.setAttribute("id", "edit-book");
  cardIconAnchor.addEventListener("click", () => {
    modalEdit(id);
  });

  const cardIcon = document.createElement("i");
  cardIcon.classList.add(
    "fas",
    "fa-pen",
    "hover:bg-blue-800",
    "hover:text-white",
    "p-2",
    "rounded"
  );
  cardIcon.setAttribute("id", id);

  const cardWriter = document.createElement("p");
  cardWriter.innerText = `Penulis: ${author}`;

  const cardYear = document.createElement("p");
  cardYear.innerText = `Tahun: ${year}`;

  const cardAction = document.createElement("div");
  cardAction.classList.add("flex", "gap-4");

  const cardStatusBookBtn = document.createElement("a");
  cardStatusBookBtn.classList.add(
    "rounded-2xl",
    "border",
    "transition",
    "duration-100",
    "p-2",
    "hover:shadow-md",
    "hover:bg-blue-800",
    "hover:text-white"
  );
  if (isComplete) {
    cardStatusBookBtn.innerText = "Belum Selesai Dibaca";
    cardStatusBookBtn.addEventListener("click", () => {
      addBookToUnread(id);
    });
  } else {
    cardStatusBookBtn.innerText = "Selesai Dibaca";
    cardStatusBookBtn.addEventListener("click", () => {
      addBookToRead(id);
    });
  }
  cardStatusBookBtn.setAttribute("href", "#");

  const cardDeleteBookBtn = document.createElement("a");
  cardDeleteBookBtn.classList.add(
    "rounded-2xl",
    "border",
    "transition",
    "duration-100",
    "p-2",
    "hover:shadow-md",
    "hover:bg-danger-color",
    "hover:text-white"
  );
  cardDeleteBookBtn.innerText = "Hapus Buku";
  cardDeleteBookBtn.setAttribute("href", "#");
  cardDeleteBookBtn.addEventListener("click", function () {
    modalDelete(id);
  });

  cardAction.append(cardStatusBookBtn);
  cardAction.append(cardDeleteBookBtn);
  cardTitleContainer.append(cardTitle);
  // cardTitleContainer.append(cardIconAnchor);
  cardIconAnchor.append(cardIcon);
  cardBook.append(cardTitleContainer);
  cardBook.append(cardWriter);
  cardBook.append(cardYear);
  cardBook.append(cardAction);
  return cardBook;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(`testkeun ${localStorage.getItem(STORAGE_KEY)}`);
});

document.addEventListener("DOMContentLoaded", function () {
  if (isStorageExist()) {
    loadDataFromStorage();
  }
  if (sessionStorage.getItem(SESSION_TITLE) === null) {
    sessionStorage.setItem(SESSION_TITLE, "");
  }
  const submitBook = document.getElementById("submit-btn");
  let openModal = document.getElementById("openModalAddBook");
  let closeModal = document.getElementById("closeModal");
  let modal = document.getElementById("addBook");
  let search = document.getElementById("searchButton");
  let searchInput = document.getElementById("searchBox");

  search.addEventListener("click", () => {
    sessionStorage.setItem(SESSION_TITLE, searchInput.value);
    document.dispatchEvent(new Event(RENDER_EVENT));
    console.log(`hasil ${sessionStorage.getItem(SESSION_TITLE)}`);
  });

  openModal.onclick = function () {
    modal.classList.remove("hidden");
  };
  closeModal.onclick = function () {
    modal.classList.add("hidden");
  };
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.add("hidden");
    }
  });

  submitBook.addEventListener("click", function () {
    addBook();
    modal.classList.add("hidden");
  });
});

document.addEventListener(RENDER_EVENT, function () {
  const unreadBookList = document.getElementById("unread-books");
  const readBookList = document.getElementById("read-books");
  const emptyBook = document.createElement("h1");
  const titleUnread = document.createElement("h1");
  const titleRead = document.createElement("h1");

  unreadBookList.innerHTML = "";
  readBookList.innerHTML = "";
  let filterBook;
  if (
    sessionStorage.getItem(SESSION_TITLE) !== null &&
    sessionStorage.getItem(SESSION_TITLE) !== ""
  ) {
    filterBook = books.filter((el) =>
      el.title
        .toLowerCase()
        .includes(sessionStorage.getItem(SESSION_TITLE).toLowerCase())
    );
  } else {
    filterBook = books;
  }

  if (filterBook.length === 0) {
    emptyBook.innerText = "Data kosong";
    emptyBook.classList.add("text-center", "text-xl", "font-semibold");
    unreadBookList.classList.add("hidden");
    readBookList.append(emptyBook);
    console.log(`buku kosong ${filterBook.length}`);
  } else {
    titleRead.innerText = "Data Kosong";
    titleRead.classList.add("text-center", "pb-2");
    readBookList.append(titleRead);
    titleUnread.innerText = "Data Kosong";
    titleUnread.classList.add("text-center", "pb-2");
    unreadBookList.append(titleUnread);
    for (const bookItem of filterBook) {
      const bookElement = makeBook(bookItem);
      unreadBookList.classList.remove("hidden");
      if (bookItem.isComplete) {
        titleRead.innerText = "Selesai Dibaca";
        readBookList.append(bookElement);
      } else {
        titleUnread.innerText = "Belum Selesai Dibaca";
        unreadBookList.append(bookElement);
      }
    }
  }
});
