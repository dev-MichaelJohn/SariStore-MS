import { CheckSession } from "@lib/request.lib";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
    
    useEffect(() => {

        const verify = async() => {
            const result = await CheckSession();
            if(!result.success) navigate(result.redirectTo as string);
        };

        verify();
    }, [navigate]);

    return (
        <div>Welcome to login</div>
    )
};

export default Dashboard;
