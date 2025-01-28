import categories from "../../data/categories.json";

export type CategoryName = keyof typeof categories;

export type Category = {
  label: string;
  order: number;
};
