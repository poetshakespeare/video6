import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Movies } from './pages/Movies';
import { TVShows } from './pages/TVShows';
import { Anime } from './pages/Anime';
import { SearchPage } from './pages/Search';
import { MovieDetail } from './pages/MovieDetail';
import { TVDetail } from './pages/TVDetail';
import { Cart } from './pages/Cart';
import { AdminPanel } from './pages/AdminPanel';

function App() {
  // Detectar dispositivo y aplicar optimizaciones universales
  React.useEffect(() => {
    const detectAndOptimizeDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const platform = navigator.platform.toLowerCase();
      const maxTouchPoints = navigator.maxTouchPoints || 0;
      const screenWidth = window.screen.width;
      
      // Aplicar clases CSS específicas según el dispositivo
      const body = document.body;
      
      // Limpiar clases previas
      body.classList.remove('mobile-device', 'tablet-device', 'laptop-device', 'desktop-device');
      body.classList.remove('ios-device', 'android-device', 'windows-device', 'macos-device', 'linux-device');
      body.classList.remove('chrome-browser', 'firefox-browser', 'safari-browser', 'edge-browser');
      
      // Detectar tipo de dispositivo
      if ((screenWidth <= 768) && maxTouchPoints > 0) {
        body.classList.add('mobile-device');
      } else if ((screenWidth <= 1024 && screenWidth > 768) && maxTouchPoints > 0) {
        body.classList.add('tablet-device');
      } else if (screenWidth <= 1366 && screenWidth > 1024) {
        body.classList.add('laptop-device');
      } else {
        body.classList.add('desktop-device');
      }
      
      // Detectar sistema operativo
      if (userAgent.includes('android')) {
        body.classList.add('android-device');
      } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
        body.classList.add('ios-device');
      } else if (userAgent.includes('mac')) {
        body.classList.add('macos-device');
      } else if (userAgent.includes('win')) {
        body.classList.add('windows-device');
      } else if (userAgent.includes('linux')) {
        body.classList.add('linux-device');
      }
      
      // Detectar navegador
      if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
        body.classList.add('chrome-browser');
      } else if (userAgent.includes('firefox')) {
        body.classList.add('firefox-browser');
      } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
        body.classList.add('safari-browser');
      } else if (userAgent.includes('edg')) {
        body.classList.add('edge-browser');
      }
    };

    detectAndOptimizeDevice();
    window.addEventListener('resize', detectAndOptimizeDevice);
    window.addEventListener('orientationchange', detectAndOptimizeDevice);
    
    return () => {
      window.removeEventListener('resize', detectAndOptimizeDevice);
      window.removeEventListener('orientationchange', detectAndOptimizeDevice);
    };
  }, []);

  // Detectar refresh y redirigir a la página principal
  React.useEffect(() => {
    const handleBeforeUnload = () => {
      // Marcar que la página se está recargando
      sessionStorage.setItem('pageRefreshed', 'true');
    };

    const handleLoad = () => {
      // Si se detecta que la página fue recargada, redirigir a la página principal
      if (sessionStorage.getItem('pageRefreshed') === 'true') {
        sessionStorage.removeItem('pageRefreshed');
        // Solo redirigir si no estamos ya en la página principal
        if (window.location.pathname !== '/') {
          window.location.href = 'https://tvalacarta.vercel.app/';
          return;
        }
      }
    };

    // Verificar al montar el componente si fue un refresh
    if (sessionStorage.getItem('pageRefreshed') === 'true') {
      sessionStorage.removeItem('pageRefreshed');
      if (window.location.pathname !== '/') {
        window.location.href = 'https://tvalacarta.vercel.app/';
        return;
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  // Deshabilitar zoom con teclado y gestos en todos los dispositivos y navegadores
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Deshabilitar Ctrl/Cmd + Plus/Minus/0 para zoom en todos los navegadores
      if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '0')) {
        e.preventDefault();
        return false;
      }
      // Deshabilitar F11 (pantalla completa) en algunos casos
      if (e.key === 'F11') {
        e.preventDefault();
        return false;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      // Deshabilitar Ctrl/Cmd + scroll para zoom en todos los navegadores
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        return false;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      // Deshabilitar pinch-to-zoom en todos los dispositivos táctiles
      if (e.touches.length > 1) {
        e.preventDefault();
        return false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Deshabilitar pinch-to-zoom en todos los dispositivos táctiles
      if (e.touches.length > 1) {
        e.preventDefault();
        return false;
      }
    };

    const handleGestureStart = (e: Event) => {
      // Deshabilitar gestos de zoom en Safari (iOS/macOS)
      e.preventDefault();
      return false;
    };

    const handleGestureChange = (e: Event) => {
      // Deshabilitar gestos de zoom en Safari (iOS/macOS)
      e.preventDefault();
      return false;
    };

    const handleGestureEnd = (e: Event) => {
      // Deshabilitar gestos de zoom en Safari (iOS/macOS)
      e.preventDefault();
      return false;
    };
    // Agregar event listeners universales
    document.addEventListener('keydown', handleKeyDown, { passive: false });
    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('gesturestart', handleGestureStart, { passive: false });
    document.addEventListener('gesturechange', handleGestureChange, { passive: false });
    document.addEventListener('gestureend', handleGestureEnd, { passive: false });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('gesturestart', handleGestureStart);
      document.removeEventListener('gesturechange', handleGestureChange);
      document.removeEventListener('gestureend', handleGestureEnd);
    };
  }, []);

  // Optimizaciones específicas para diferentes navegadores y SO
  React.useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Optimizaciones para Safari (iOS y macOS)
    if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
      document.body.style.webkitTextSizeAdjust = '100%';
      document.body.style.webkitTouchCallout = 'none';
    }
    
    // Optimizaciones para Chrome en Android
    if (userAgent.includes('chrome') && userAgent.includes('android')) {
      document.body.style.touchAction = 'manipulation';
    }
    
    // Optimizaciones para Firefox en cualquier SO
    if (userAgent.includes('firefox')) {
      (document.body.style as any).mozTextSizeAdjust = '100%';
      (document.body.style as any).mozUserSelect = 'none';
    }
    
    // Optimizaciones para Edge en Windows
    if (userAgent.includes('edg')) {
      (document.body.style as any).msTextSizeAdjust = '100%';
      (document.body.style as any).msUserSelect = 'none';
    }
    
    // Configurar meta viewport dinámicamente para mejor compatibilidad
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      let viewportContent = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no';
      
      // Agregar viewport-fit=cover para dispositivos con notch
      if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
        viewportContent += ', viewport-fit=cover';
      }
      
      viewport.setAttribute('content', viewportContent);
    }
  }, []);
  return (
    <AdminProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/*" element={
                <>
                  <Header />
                  <main>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/movies" element={<Movies />} />
                      <Route path="/tv" element={<TVShows />} />
                      <Route path="/anime" element={<Anime />} />
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="/movie/:id" element={<MovieDetail />} />
                      <Route path="/tv/:id" element={<TVDetail />} />
                      <Route path="/cart" element={<Cart />} />
                    </Routes>
                  </main>
                </>
              } />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AdminProvider>
  );
}

export default App;