Import([
  '[html]/pages/searchauthor.html',
  '[js]/Api.js',
], function (tpl, Api) {
  class SearchAuthor {
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
      const res = await Api.getAuthors(search);
      this.render((res && res.data) || []);
    }

    render(authors) {
      if (!authors.length) {
        this.tbody.innerHTML = '<tr><td colspan="2" class="empty">Aucun auteur trouvé</td></tr>';
        return;
      }
      this.tbody.innerHTML = authors.map(author => `
        <tr>
          <td><a href="/authors/${author.id}">${escapeHtml(author.name)}</a></td>
          <td class="center">${author.bookCount || 0}</td>
        </tr>
      `).join('');
    }
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  return SearchAuthor;
});
