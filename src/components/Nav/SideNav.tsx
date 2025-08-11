import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useAuth } from '../../hooks/useAuth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faBars,
    faTimes,
    faHome,
    faTable,
    faChartLine,
    faTachometerAlt,
    faRightFromBracket,
    faRightToBracket
} from '@awesome.me/kit-4fb5b5f5b6/icons/classic/solid'

export default function Sidebar() {
    const { isAuthenticated, logoutUrl } = useAuth()
    const [collapsed, setCollapsed] = useState(false)

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <aside
                className={`${collapsed ? 'w-16' : 'w-64'} bg-background text-black p-4 shadow-lg transition-all duration-300`}
            >
                {/* Toggle Button */}
                <button
                    className="mb-6 focus:outline-none text-text"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <FontAwesomeIcon icon={collapsed ? faBars : faTimes} />
                </button>

                <nav className="flex flex-col gap-4">
                    <NavItem to="/" label="Home" icon={faHome} collapsed={collapsed} />
                    <NavItem to="/demo/table" label="TanStack Table" icon={faTable} collapsed={collapsed} />
                    <NavItem to="/demo/tanstack-query" label="TanStack Query" icon={faChartLine} collapsed={collapsed} />
                    <NavItem to="/dashboard" label="Dashboard" icon={faTachometerAlt} collapsed={collapsed} />

                    <div className="font-bold mt-auto whitespace-nowrap overflow-hidden">
                        {isAuthenticated && logoutUrl ? (
                            <a href={logoutUrl} className='text-text'>
                                <FontAwesomeIcon icon={faRightFromBracket} className="mr-2" />
                                {!collapsed && 'Logout'}
                            </a>
                        ) : (
                            <a href="http://localhost:4000/self-service/login/browser" className='text-text'>
                                <FontAwesomeIcon icon={faRightToBracket} className="mr-2" />
                                {!collapsed && 'Login'}
                            </a>
                        )}
                    </div>
                </nav>
            </aside>
        </div>
    )
}

function NavItem({
    to,
    label,
    icon,
    collapsed
}: {
    to: string
    label: string
    icon: any
    collapsed: boolean
}) {
    return (
        <div className="font-bold">
            <Link to={to} className="flex text-text items-center gap-2 whitespace-nowrap overflow-hidden">
                <FontAwesomeIcon icon={icon} className="flex-shrink-0" />
                {!collapsed && <span className="truncate">{label}</span>}
            </Link>
        </div>
    )
}
