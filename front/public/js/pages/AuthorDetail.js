Import([
  '[html]/pages/authordetail.html',
  '[js]/Api.js',
], function (tpl, Api) {
  class AuthorDetail {
    element = null;
    id = null;

    constructor(element, id) {
      this.element = element;
      this.id = id;
      this.element.innerHTML = tpl;
      this.nameInput = this.element.querySelector('#name');
      this.messageEl = this.element.querySelector('.message');
      this.tbody = this.element.querySelector('tbody');
      this.element.querySelector('form').addEventListener('submit', this.onSubmit.bind(this));
      this.load();
    }

    async load() {
      const res = await Api.getAuthor(this.id);
      const author = res && res.data;
      if (!author) {
        this.element.innerHTML = '<h1>Auteur introuvable</h1><p><a href="/authors">Retour</a></p>';
        return;
      }
      this.nameInput.value = author.name || '';
      this.renderBooks(author.books || []);
    }

    renderBooks(books) {
      if (!books.length) {
        this.tbody.innerHTML = '<tr><td colspan="2" class="empty">Aucun livre pour cet auteur</td></tr>';
        return;
      }
      this.tbody.innerHTML = books.map(book => {
        const stateClass = book.state === 'emprunté' ? 'state-borrowed' : 'state-stock';
        return `
          <tr>
            <td><a href="/books/${book.id}">${escapeHtml(book.title)}</a></td>
            <td class="${stateClass}">${escapeHtml(book.state)}</td>
          </tr>
        `;
      }).join('');
    }

    async onSubmit(evt) {
      evt.preventDefault();
      this.messageEl.className = 'message';
      const name = this.nameInput.value.trim();
      if (!name) {
        this.messageEl.classList.add('error');
        this.messageEl.textContent = 'Le nom est requis';
        return;
      }
      const res = await Api.editAuthor(this.id, { name });
      if (res && res.data) {
        this.messageEl.textContent = 'Modifications enregistrées';
      } else {
        this.messageEl.classList.add('error');
        this.messageEl.textContent = 'Erreur lors de la modification';
      }
    }
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  return AuthorDetail;
});
