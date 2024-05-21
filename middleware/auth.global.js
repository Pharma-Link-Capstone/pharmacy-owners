import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore();

  if (to.path.includes("/app") && !auth.isAuthenticated) {
    return navigateTo("/login");
  }

  return;
});
