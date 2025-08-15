(() => {
  // Función para escapar HTML
  const escapeHtml = (str) => {
    if (!str) return '';
    return str.replace(/[&<>"']/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[tag] || tag));
  };

  const API = {
    products: '/api/products',
    texts: '/api/texts',
    register: '/api/register',
    login: '/api/login',
    me: '/api/me',
    upload: '/api/upload',
  };

  const token = () => localStorage.getItem('AUTH_TOKEN') || '';
  const setToken = (t = '') => localStorage.setItem('AUTH_TOKEN', t);
  
  async function getMe() {
    const token = localStorage.getItem('AUTH_TOKEN');
    if (!token) return null;
    
    try {
      const response = await fetch(API.me, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-store'
        }
      });
      
      if (!response.ok) {
        console.error('Error fetching user data:', response.status);
        return null;
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error in getMe:', error);
      return null;
    }
  }

  // ... (resto del código sin cambios, mantener el original) ...

  document.addEventListener('DOMContentLoaded', async () => {
    // Páginas que no requieren autenticación
    const publicPages = ['index.html', 'productos.html', 'acerca.html', 'login.html', 'carrito.html'];
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    
    if (publicPages.includes(currentPage)) {
      buildNavbar();
      updateLanguage(localStorage.getItem('language') === 'en');
      if (document.querySelector('.products-grid')) renderProducts('.products-grid');
      return;
    }

    // Para páginas privadas, verificar autenticación
    const me = await getMe();
    
    if (!me) {
      window.location.href = '/login.html';
      return;
    }
    
    // Si es admin y está en página de admin, redirigir
    if (me.isAdmin && !currentPage.includes('admin.html')) {
      window.location.href = '/admin.html';
    }
    
    buildNavbar();
    updateLanguage(localStorage.getItem('language') === 'en');
    
    if (document.querySelector('.products-grid')) renderProducts('.products-grid');
  });
})();