Import([
  '[html]/pages/dashboard.html',
  '[js]/Api.js',
], function (tpl, Api) {
  class Dashboard {
    element = null;

    constructor(element) {
      this.element = element;
      this.element.innerHTML = tpl;
      this.load();
    }

    async load() {
      const res = await Api.getStats();
      const stats = (res && res.data) || {};
      this.element.querySelector('#book-count').textContent = stats.bookCount || 0;
      this.element.querySelector('#author-count').textContent = stats.authorCount || 0;
      this.element.querySelector('#borrowed-count').textContent = stats.borrowedCount || 0;
    }
  }

  return Dashboard;
});
