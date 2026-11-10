Import([
  '[html]/pages/bookdetail.html',
  '[js]/Api.js',
], function (tpl, Api) {
  class BookDetail {
    element = null;
    id = null;

    constructor(element, id) {
      this.element = element;
      this.id = id;
      this.element.innerHTML = tpl;
      this.titleInput = this.element.querySelector('#title');
      this.authorSelect = this.element.querySelector('#author');
      this.stateSelect = this.element.querySelector('#state');
      this.messageEl = this.element.querySelector('.message');
      this.element.querySelector('form').addEventListener('submit', this.onSubmit.bind(this));
      this.load();
    }

    async load() {
      const [bookRes, authorsRes] = await Promise.all([
        Api.getBook(this.id),
        Api.getAuthors(),
      ]);
      const book = bookRes && bookRes.data;
      const authors = (authorsRes && authorsRes.data) || [];
      if (!book) {
        this.element.innerHTML = '<h1>Livre introuvable</h1><p><a href="/books">Retour</a></p>';
        return;
      }
      this.titleInput.value = book.title || '';
      this.authorSelect.innerHTML = '<option value="">Nom d\'un auteur</option>' +
        authors.map(a => {
          const sel = a.id === book.authorId ? ' selected' : '';
          return `<option value="${a.id}"${sel}>${escapeHtml(a.name)}</option>`;
        }).join('');
      this.stateSelect.value = book.state === 'emprunté' ? 'emprunté' : 'en stock';
    }

    async onSubmit(evt) {
      evt.preventDefault();
      this.messageEl.className = 'message';
      const title = this.titleInput.value.trim();
      const authorId = this.authorSelect.value;
      if (!title || authorId === '') {
        this.messageEl.classList.add('error');
        this.messageEl.textContent = 'Tous les champs sont requis';
        return;
      }
      const res = await Api.editBook(this.id, {
        title,
        authorId: parseInt(authorId, 10),
        state: this.stateSelect.value,
      });
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

  return BookDetail;
});
