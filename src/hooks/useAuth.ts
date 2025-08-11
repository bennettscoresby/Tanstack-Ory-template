import { useState, useEffect } from "react"
import { FrontendApi, Configuration, type Session } from "@ory/client-fetch"

const basePath = import.meta.env.VITE_ORY_SDK_URL || "http://localhost:4000"

// Initialize Ory client
const ory = new FrontendApi(
    new Configuration({
        basePath,
        credentials: "include",
    }),
)

// Global auth state to persist across component mounts
let globalAuthState = {
    session: null as Session | null,
    logoutUrl: null as string | null,
    loading: true,
    initialized: false
}

// Subscribers for state changes
const subscribers = new Set<() => void>()

export interface AuthState {
    session: Session | null
    logoutUrl: string | null
    loading: boolean
    isAuthenticated: boolean
    logout: () => void
    refetchSession: () => Promise<void>
}

// Function to notify all subscribers of state changes
const notifySubscribers = () => {
    subscribers.forEach(callback => callback())
}

// Function to update global auth state
const updateGlobalAuthState = (updates: Partial<typeof globalAuthState>) => {
    globalAuthState = { ...globalAuthState, ...updates }
    notifySubscribers()
}

export function useAuth(): AuthState {
    // Local state that syncs with global state
    const [localState, setLocalState] = useState(globalAuthState)

    // Subscribe to global state changes
    useEffect(() => {
        const updateLocalState = () => setLocalState({ ...globalAuthState })
        subscribers.add(updateLocalState)

        return () => {
            subscribers.delete(updateLocalState)
        }
    }, [])

    // Fetch session function
    const fetchSession = async () => {
        try {
            updateGlobalAuthState({ loading: true })
            // Browser automatically includes cookies in the request
            const sessionResponse = await ory.toSession()

            try {
                const { logout_url } = await ory.createBrowserLogoutFlow()
                updateGlobalAuthState({
                    session: sessionResponse,
                    logoutUrl: logout_url,
                    loading: false,
                    initialized: true
                })
            } catch (logoutError) {
                console.error("Error creating logout flow:", logoutError)
                updateGlobalAuthState({
                    session: sessionResponse,
                    logoutUrl: null,
                    loading: false,
                    initialized: true
                })
            }
        } catch (err) {
            updateGlobalAuthState({
                session: null,
                logoutUrl: null,
                loading: false,
                initialized: true
            })
        }
    }

    // Logout function
    const logout = () => {
        if (localState.logoutUrl) {
            window.location.href = localState.logoutUrl
        }
    }

    // Initial session fetch (only if not already initialized)
    useEffect(() => {
        if (!globalAuthState.initialized) {
            fetchSession()
        }
    }, [])

    return {
        session: localState.session,
        logoutUrl: localState.logoutUrl,
        loading: localState.loading,
        isAuthenticated: !!localState.session?.identity,
        logout,
        refetchSession: fetchSession,
    }
}