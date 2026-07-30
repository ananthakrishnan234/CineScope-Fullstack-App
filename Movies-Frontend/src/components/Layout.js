import { Outlet } from 'react-router-dom';
import Header from './header/Header';

/**
 * Layout wraps all pages with the Header and an <Outlet>.
 * <Outlet> is where the matched child route renders.
 * Header reads auth state from AuthContext directly — no props needed.
 */
const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;