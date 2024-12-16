import { useContext } from "react";
import { UserContext } from "../contexts/user-context";


export function useUserInfo() {
    const context = useContext(UserContext);
    if(context === undefined){
        throw new Error("Context must be used within a Provider");
    }
    return context;
}