import { Link } from '@tanstack/react-router'
import { useAuth } from '../hooks/useAuth'

export default function Header() {
  const { isAuthenticated, logoutUrl } = useAuth()

  return (
    <header className="p-2 flex gap-2 bg-white text-black justify-between">
      <nav className="flex flex-row">
        <div className="px-2 font-bold">
          <Link to="/">Home</Link>
        </div>

        <div className="px-2 font-bold">
          <Link to="/demo/table">TanStack Table</Link>
        </div>

        <div className="px-2 font-bold">
          <Link to="/demo/tanstack-query">TanStack Query</Link>
        </div>
        <div className="px-2 font-bold">
          <Link to="/dashboard">Dashboard</Link>
        </div>

        <div className="px-2 font-bold">
          {isAuthenticated && logoutUrl ? (
            <a href={logoutUrl}>Logout</a>
          ) : (
            <a href="http://localhost:4000/self-service/login/browser">Login</a>
          )}
        </div>
      </nav>
    </header>
  )
}
