import { fetchAccountAPI } from "@/services/api";
import { createContext, useContext, useEffect, useState } from "react";
import HashLoader from "react-spinners/HashLoader";

interface IAppContext {
    isAuthenticated: boolean;
    setIsAuthenticated: (v: boolean) => void;
    setCurrentUser: (v: IUser | null) => void;
    currentUser: IUser | null;
    isAppLoading: boolean;
    setIsAppLoading: (v: boolean) => void;
    carts: ICart[];
    setCarts: (v: ICart[]) => void;
}

const CurrentAppContext = createContext<IAppContext | null>(null);

type TProps = {
    children: React.ReactNode
}

export const AppProvider = (props: TProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<IUser | null>(null);
    const [isAppLoading, setIsAppLoading] = useState<boolean>(true);
    const [carts, setCarts] = useState<ICart[]>([]);

    useEffect(() => {
        const fetchAccount = async () => {
            const res = await fetchAccountAPI();
            const carts = localStorage.getItem("carts");
            if (res.data) {
                setCurrentUser(res.data.user);
                setIsAuthenticated(true);
                if (carts) {
                    setCarts(JSON.parse(carts));
                }
            }
            setIsAppLoading(false)
        }

        fetchAccount();
    }, [])

    return (
        <>
            {isAppLoading === false ?
                <CurrentAppContext.Provider value={{
                    isAuthenticated, currentUser, setIsAuthenticated, setCurrentUser,
                    isAppLoading, setIsAppLoading, carts, setCarts
                }}>
                    {props.children}
                </CurrentAppContext.Provider>
                :
                <div style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)"
                }}>
                    <HashLoader
                        size={30}
                        color="#36d6b4"
                    />
                </div>
            }

        </>

    );
};

export const useCurrentApp = () => {
    const currentAppContext = useContext(CurrentAppContext);

    if (!currentAppContext) {
        throw new Error(
            "useCurrentApp has to be used within <CurrentAppContext.Provider>"
        );
    }

    return currentAppContext;
};

