// ========================================
// 智学助手 SmartStudy Agent — 主应用逻辑
// ========================================

function initApp() {
  // View switching
  const navItems = document.querySelectorAll('.nav-item');
  const views = document.querySelectorAll('.view');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const viewName = item.dataset.view;

      // Update nav
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      // Update view
      views.forEach(v => v.classList.remove('active'));
      const targetView = document.getElementById(`view-${viewName}`);
      if (targetView) {
        targetView.classList.add('active');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', initApp);
