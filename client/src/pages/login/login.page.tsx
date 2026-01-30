import { useEffect } from "react";
import { CheckSession } from "@lib/request.lib";

const LoginPage = () => {
   useEffect(() => {
       CheckSession();
   }, []); 

   return (
       <div>
       </div>
   )
};

export default LoginPage;
