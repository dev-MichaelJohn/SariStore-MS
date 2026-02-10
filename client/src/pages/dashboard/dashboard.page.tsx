import { CheckSession } from "@lib/request.lib";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import DashboardMenu from "./components/dashboardMenu";
import { Outlet, useNavigate } from "react-router-dom";


const DashboardPage = () => {
    const navigate = useNavigate();
    
    useEffect(() => {

        const verify = async() => {
            const result = await CheckSession();
            if(!result.success) navigate(result.redirectTo as string);
        };

        //verify();
    }, [navigate]);

    return (
        <div className="flex h-dvh w-full flex-wrap bg-(--bg-dark)">
            <Toaster />
            <DashboardMenu />
            <div className="flex-1 h-dvh w-full">
                <Outlet />
            </div>
        </div>
    )
};

export default DashboardPage;
