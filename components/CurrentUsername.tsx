import { createContext, useContext } from "react";

export const UsernameContext = createContext<string>("");

export const useCurrentUsername = () => useContext(UsernameContext);
