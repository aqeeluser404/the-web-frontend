import { defineStore } from 'pinia';

export const useCategoryLockStore = defineStore('categoryLock', {
  state: () => ({
    lockedCategory: null,
    selectedCategory: null
  }),
  actions: {
    setCategory(category) {
      this.lockedCategory = category;
      this.selectedCategory = category;
    },
    clearCategory() {
      this.lockedCategory = null;
      this.selectedCategory = null;
    }
  }
});
