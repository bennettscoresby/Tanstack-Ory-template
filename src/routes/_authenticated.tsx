import { createFileRoute, redirect, Outlet, useRouter } from "@tanstack/react-router";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

function AuthenticatedLayout() {
    // Use useAuth directly to get reactive state updates
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    // Handle authentication state changes after component mounts
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.navigate({ to: "/" });
        }
    }, [loading, isAuthenticated, router]);

    // Show loading spinner while authentication is being determined
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    // If not authenticated after loading completes, don't render content
    // (the useEffect above will handle the redirect)
    if (!isAuthenticated) {
        return null;
    }

    return <Outlet />;
}

export const Route = createFileRoute("/_authenticated")({
    component: AuthenticatedLayout,
    beforeLoad: async ({ context }) => {
        const { isAuthenticated, loading } = context.authentication;

        // Only redirect if loading is complete AND user is not authenticated
        // This handles the case where auth is already loaded when route is accessed
        if (!loading && !isAuthenticated) {
            throw redirect({ to: "/" });
        }
    },
});