Import([
  '[html]/com/sidebar.html',
  '[js]/Api.js',
], function (tpl, Api) {
  class Sidebar {
    element = null;

    constructor(element) {
      this.element = element;
      this.element.innerHTML = tpl;
      this.highlightActive();
      this.element
        .querySelector('.logout')
        .addEventListener('click', this.onLogout.bind(this));
    }

    highlightActive() {
      const path = window.location.pathname;
      const links = Array.from(this.element.querySelectorAll('a[data-route]'));

      let active = links.find(link => link.getAttribute('data-route') === path);

      if (!active) {
        let bestLength = -1;
        for (const link of links) {
          const route = link.getAttribute('data-route');
          if (route !== '/' && path.startsWith(route + '/') && route.length > bestLength) {
            active = link;
            bestLength = route.length;
          }
        }
      }

      if (active) {
        active.classList.add('active');
      }
    }

    async onLogout() {
      await Api.logout();
      window.location.href = '/login';
    }
  }

  return Sidebar;
});
