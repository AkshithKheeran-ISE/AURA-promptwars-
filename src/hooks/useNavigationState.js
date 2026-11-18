import { useState, useEffect, useCallback } from 'react';

/**
 * Manages hash-based router navigation, sidebar state, and global keyboard shortcuts.
 * @param {Array<{id: string, label: string}>} navItems - Navigation items array
 */
export function useNavigationState(navItems) {
  const getInitialPage = useCallback(() => {
    try {
      if (typeof window === 'undefined' || !window.location) return 'command';
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      return navItems.some((item) => item.id === hash) ? hash : 'command';
    } catch {
      return 'command';
    }
  }, [navItems]);

  const [page, setPageState] = useState(getInitialPage);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      setPageState(getInitialPage());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [getInitialPage]);

  const setPage = (newPage) => {
    window.location.hash = `/${newPage}`;
    setPageState(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    page,
    setPage,
    sidebarCollapsed,
    setSidebarCollapsed,
    commandPaletteOpen,
    setCommandPaletteOpen
  };
}
