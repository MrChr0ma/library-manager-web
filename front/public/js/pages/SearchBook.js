Import([
  '[html]/pages/searchbook.html',
  '[js]/Api.js',
], function (tpl, Api) {
  class SearchBook {
    element = null;

    constructor(element) {
      this.element = element;
      this.element.innerHTML = tpl;
      this.searchInput = this.element.querySelector('#search');
      this.tbody = this.element.querySelector('tbody');
      this.element.querySelector('form').addEventListener('submit', this.onSubmit.bind(this));
      this.load('');
    }

    onSubmit(evt) {
      evt.preventDefault();
      this.load(this.searchInput.value.trim());
    }

    async load(search) {
      const res = await Api.getBooks(search);
      this.render((res && res.data) || []);
    }

    render(books) {
      if (!books.length) {
        this.tbody.innerHTML = '<tr><td colspan="3" class="empty">Aucun livre trouvé</td></tr>';
        return;
      }
      this.tbody.innerHTML = books.map(book => {
        const stateClass = book.state === 'emprunté' ? 'state-borrowed' : 'state-stock';
        const authorName = book.author ? book.author.name : '-';
        return `
          <tr>
            <td><a href="/books/${book.id}">${escapeHtml(book.title)}</a></td>
            <td>${escapeHtml(authorName)}</td>
            <td class="${stateClass}">${escapeHtml(book.state)}</td>
          </tr>
        `;
      }).join('');
    }
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  return SearchBook;
});
