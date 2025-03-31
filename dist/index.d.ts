import "dotenv/config";
import { Dispatch, SetStateAction } from "react";
export type State<T, U = never> = [T, Dispatch<SetStateAction<T | U>>];
interface BaseMainContext {
    machineIsFrom: string;
}
export interface UserData {
}
export type AuthDetails = {
    fetch: typeof fetch;
    sessId: string;
};
interface MainContextAuthed extends BaseMainContext {
    auth: State<AuthDetails, null>;
    userData: State<UserData, null>;
}
interface MainContextUnauthed extends BaseMainContext {
    auth: State<null, AuthDetails>;
    userData: State<null, UserData>;
}
type MainContextType = MainContextAuthed | MainContextUnauthed;
export declare const mainContext: import("react").Context<MainContextType>;
export {};
