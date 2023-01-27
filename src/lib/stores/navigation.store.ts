import { writable } from "svelte/store";

export type Page = "home" | "top" | "map";

const page = writable<Page>("home");

export const navigationStore = {
  subscribe: page.subscribe,
  update: page.update,
  set: page.set,

  currentPage: function (currentPage: Page) {
    page.set(currentPage);
  }
};
