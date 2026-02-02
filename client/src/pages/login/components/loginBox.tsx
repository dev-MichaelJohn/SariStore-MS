import sariImg1 from "@assets/images/sari-store-1.jpg";
import sariImg2 from "@assets/images/sari-store-2.jpg";
import sariImg3 from "@assets/images/sari-store-3.jpg";
import sariImg4 from "@assets/images/sari-store-4.jpg";
import { useState, useEffect } from "react";

const fadeImages = [
    sariImg1, sariImg2, sariImg3, sariImg4
];

const LoginBox = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % fadeImages.length);
        }, 4000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex relative h-dvh w-1/3 overflow-hidden">
        {fadeImages.map((src, idx) => (
            <img src={src} key={idx} alt="sari-sari store" 
                className={`absolute inset-0 object-cover h-full w-full opacity-0 ${idx === index ? 'opacity-100': ''} duration-1000 transition-opacity ease-in-out `}/>
        ))}
        </div>
    )
};

export default LoginBox;
