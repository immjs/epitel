import { ReactNode } from "react";
export interface App {
    name: string;
    base: string;
    routes: ReactNode;
}
export declare const apps: App[];
