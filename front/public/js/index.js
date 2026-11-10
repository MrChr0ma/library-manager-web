Import([
  '[js]/Api.js',
  '[js]/com/Sidebar.js',
  '[html]/layout.html',
  '[js]/pages/Login.js',
  '[js]/pages/Dashboard.js',
  '[js]/pages/SearchBook.js',
  '[js]/pages/SearchAuthor.js',
  '[js]/pages/AddBook.js',
  '[js]/pages/AddAuthor.js',
  '[js]/pages/BookDetail.js',
  '[js]/pages/AuthorDetail.js',
  '[js]/pages/NotFound.js',
], function (
  Api, Sidebar, layoutTpl,
  Login, Dashboard, SearchBook, SearchAuthor,
  AddBook, AddAuthor, BookDetail, AuthorDetail, NotFound
) {
  const root = document.getElementById('root');
  const path = window.location.pathname;

  if (path === '/login') {
    new Login(root);
    return;
  }

  if (!Api.getToken()) {
    window.location.href = '/login';
    return;
  }

  root.innerHTML = layoutTpl;
  new Sidebar(document.getElementById('sidebar'));
  const main = document.getElementById('main');

  const bookMatch = path.match(/^\/books\/(\d+)$/);
  const authorMatch = path.match(/^\/authors\/(\d+)$/);

  if (path === '/' || path === '/dashboard') {
    new Dashboard(main);
  } else if (path === '/books') {
    new SearchBook(main);
  } else if (path === '/authors') {
    new SearchAuthor(main);
  } else if (path === '/books/new') {
    new AddBook(main);
  } else if (path === '/authors/new') {
    new AddAuthor(main);
  } else if (bookMatch) {
    new BookDetail(main, parseInt(bookMatch[1], 10));
  } else if (authorMatch) {
    new AuthorDetail(main, parseInt(authorMatch[1], 10));
  } else {
    new NotFound(main);
  }
});
