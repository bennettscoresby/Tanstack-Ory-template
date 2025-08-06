import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
    beforeLoad: async ({ context }) => {
        const { isAuthenticated } = context.authentication;
        if (!isAuthenticated) {
            console.log(context)
            throw redirect({ to: "/" });
        }
    },
});