import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { FrontendApi, Configuration, type Session } from "@ory/client-fetch"

const basePath = import.meta.env.VITE_ORY_SDK_URL || "http://localhost:4000"

// Initialize Ory client
const ory = new FrontendApi(
    new Configuration({
        basePath,
        credentials: "include",
    }),
)

export interface AuthState {
    session: Session | null
    logoutUrl: string | null
    loading: boolean
    isAuthenticated: boolean
    logout: () => void
    refetchSession: () => Promise<void>
}

// Create the Auth Context
const AuthContext = createContext<AuthState | undefined>(undefined)

// AuthProvider component
export function AuthProvider({ children }: { children: ReactNode }) {
    // State variables
    const [session, setSession] = useState<Session | null>(null)
    const [logoutUrl, setLogoutUrl] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setSession(session)
    }, [session])

    // Fetch session function
    const fetchSession = async () => {
        try {
            setLoading(true)
            // Browser automatically includes cookies in the request
            const sessionResponse = await ory.toSession()
            setSession(sessionResponse)

            try {
                const { logout_url } = await ory.createBrowserLogoutFlow()
                setLogoutUrl(logout_url)
            } catch (logoutError) {
                console.error("Error creating logout flow:", logoutError)
            }
        } catch (err) {
            setSession(null)
            setLogoutUrl(null)
            // Don't automatically redirect - let individual routes handle this
        } finally {
            setLoading(false)
        }
    }

    // Logout function
    const logout = () => {
        if (logoutUrl) {
            window.location.href = logoutUrl
        }
    }

    // Initial session fetch
    useEffect(() => {
        fetchSession()
    }, [])

    const value: AuthState = {
        session,
        logoutUrl,
        loading,
        isAuthenticated: !!session?.identity,
        logout,
        refetchSession: fetchSession,
    }

    return <AuthContext.Provider value={value}> {children} </AuthContext.Provider>
}

// Custom hook to use the Auth Context
export function useAuth(): AuthState {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}