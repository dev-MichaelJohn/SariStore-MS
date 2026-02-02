import { CheckSession } from "@lib/request.lib";
import { useEffect } from "react";

const Dashboard = () => {
    useEffect(() => {
        CheckSession();
    }, []);

    return (
        <div>Welcome to login</div>
    )
};

export default Dashboard;
