import { jwtDecode } from "jwt-decode";
import { defineStore } from "pinia";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const user = ref(null);

    const token = ref(null);

    const isAuthenticated = computed(() => {
      return !!user.value && !!token.value;
    });

    const userRoles = computed(() => {
      const claim = jwtDecode(token.value);
      return claim?.metadata?.roles;
    });

    //   Setters
    const setUser = (newUser) => {
      user.value = newUser;
    };

    const setToken = (newToken) => {
      token.value = newToken;
    };

    const logout = () => {
      user.value = null;
    };

    return {
      user,
      isAuthenticated,
      token,
      logout,
      setUser,
      setToken,
      userRoles,
    };
  },
  { persist: true }
);
