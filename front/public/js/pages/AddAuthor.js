Import([
  '[html]/pages/addauthor.html',
  '[js]/Api.js',
], function (tpl, Api) {
  class AddAuthor {
    element = null;

    constructor(element) {
      this.element = element;
      this.element.innerHTML = tpl;
      this.nameInput = this.element.querySelector('#name');
      this.messageEl = this.element.querySelector('.message');
      this.element.querySelector('form').addEventListener('submit', this.onSubmit.bind(this));
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
      const res = await Api.createAuthor({ name });
      if (res && res.data && res.data.id !== undefined) {
        window.location.href = '/authors/' + res.data.id;
      } else {
        this.messageEl.classList.add('error');
        this.messageEl.textContent = 'Erreur lors de la création';
      }
    }
  }

  return AddAuthor;
});
