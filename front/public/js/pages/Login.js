Import([
  '[html]/pages/login.html',
  '[js]/Api.js',
], function (tpl, Api) {
  class Login {
    element = null;

    constructor(element) {
      this.element = element;
      this.element.innerHTML = tpl;
      this.form = this.element.querySelector('form');
      this.loginInput = this.element.querySelector('#login');
      this.passwordInput = this.element.querySelector('#password');
      this.errorEl = this.element.querySelector('.error');
      this.form.addEventListener('submit', this.onSubmit.bind(this));
    }

    async onSubmit(evt) {
      evt.preventDefault();
      this.errorEl.textContent = '';
      const res = await Api.login(
        this.loginInput.value.trim(),
        this.passwordInput.value
      );
      const data = res && res.data;
      if (data && data.success && data.token) {
        Api.setToken(data.token);
        window.location.href = '/';
      } else {
        this.errorEl.textContent = 'Identifiants invalides';
      }
    }
  }

  return Login;
});
