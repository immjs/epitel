import { ReactNode } from "react";
import { Cri } from "../apps/cri/index.js";

export interface App {
  name: string;
  base: string;
  routes: ReactNode;
}

export const apps: App[] = [
  Cri,
];
