/* TruckFixHub public master-manual enhancements. Public content and navigation remain present without JavaScript. */
(() => {
  const closeMenu = (button, menu) => {
    if (!button || !menu) return;
    button.setAttribute('aria-expanded', 'false');
    menu.dataset.open = 'false';
  };

  document.querySelectorAll('[data-manual-menu-toggle]').forEach((button) => {
    const menu = document.getElementById(button.getAttribute('aria-controls'));
    if (!menu) return;
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!open));
      menu.dataset.open = String(!open);
    });
    menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu(button, menu)));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMenu(button, menu);
        button.focus();
      }
    });
  });
})();
