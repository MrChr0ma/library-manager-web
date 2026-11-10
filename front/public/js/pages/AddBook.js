Import([
  '[html]/pages/addbook.html',
  '[js]/Api.js',
], function (tpl, Api) {
  class AddBook {
    element = null;

    constructor(element) {
      this.element = element;
      this.element.innerHTML = tpl;
      this.titleInput = this.element.querySelector('#title');
      this.authorSelect = this.element.querySelector('#author');
      this.stateSelect = this.element.querySelector('#state');
      this.messageEl = this.element.querySelector('.message');
      this.element.querySelector('form').addEventListener('submit', this.onSubmit.bind(this));
      this.loadAuthors();
    }

    async loadAuthors() {
      const res = await Api.getAuthors();
      const authors = (res && res.data) || [];
      this.authorSelect.innerHTML = '<option value="">Nom d\'un auteur</option>' +
        authors.map(a => `<option value="${a.id}">${escapeHtml(a.name)}</option>`).join('');
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
      const res = await Api.createBook({
        title,
        authorId: parseInt(authorId, 10),
        state: this.stateSelect.value,
      });
      if (res && res.data && res.data.id !== undefined) {
        window.location.href = '/books/' + res.data.id;
      } else {
        this.messageEl.classList.add('error');
        this.messageEl.textContent = 'Erreur lors de la création';
      }
    }
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  return AddBook;
});
