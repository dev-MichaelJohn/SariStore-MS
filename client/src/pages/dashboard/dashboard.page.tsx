import { CheckSession } from "@lib/request.lib";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
    
    useEffect(() => {

        const verify = async() => {
            const result = await CheckSession();
            if(result.success) navigate(result.redirectTo as string);
        };

        verify();
    }, [navigate]);

    return (
        <div>
            <Toaster />
        </div>
    )
};

export default Dashboard;
