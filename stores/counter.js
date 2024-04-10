// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  function increment() {
    count.value++
  }

  return { count, increment }
})

if (import.meta.hot) {
  // import.meta.hot.accept(acceptHMRUpdate(useCounter, import.meta.hot))
}
