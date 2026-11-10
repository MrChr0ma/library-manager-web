Import([
  '[html]/pages/notfound.html',
], function (tpl) {

  class NotFound {
    element = null;

    constructor(element) {
      this.element = element;
      this.element.innerHTML = tpl;
    }
  }

  return NotFound;
});
