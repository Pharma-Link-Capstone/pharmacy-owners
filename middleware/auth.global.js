import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore();

  if (
    (to.path.includes("/app") || to.path.includes("/pharmacy")) &&
    !auth.isAuthenticated
  ) {
    return navigateTo("/login");
  }

  if (
    (to.path.includes("/login") || to.path.includes("/register")) &&
    auth.isAuthenticated
  ) {
    return navigateTo("/app");
  }

  return;
});
