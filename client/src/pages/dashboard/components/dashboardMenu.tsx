import logOut from "../../../assets/svg/log-out.svg";
import dashboard from "../../../assets/svg/dashboard-icon.svg";
import pos from "../../../assets/svg/pos-icon.svg";
import product from "../../../assets/svg/product-icon.svg";
import inventory from "../../../assets/svg/inventory-icon.svg";
import users from "../../../assets/svg/users-icon.svg";
import { NavLink } from "react-router-dom";

const menuButtons = [
    { icon: dashboard, pageName: "Dashboard", alt: "dashboard button", path: "" },
    { icon: pos, pageName: "POS", alt: "pos button", path: "pos" },
    { icon: product, pageName: "Products", alt: "product button", path: "products" },
    { icon: inventory, pageName: "Inventory", alt: "inventory button", path: "inventory" },
    { icon: users, pageName: "Users", alt: "usesrs button", path: "users" },
]

const DashboardMenu = () => {
    const generateMenuButtons = menuButtons.map((menu, index) => (
        <NavLink to={`/dashboard/${menu.path}`} key={index}
        className={({isActive}) => `flex p-2.5 gap-2.5 w-full items-center text-lg rounded-2xl cursor-pointer 
            ${isActive ? "text-(--text) bg-(--bg-light) font-extrabold text-shadow-lg" : "text-(--text-muted) hover:bg-(--bg-light)"}`
        } 
        end={(menu.path === "")}>
            <img src={menu.icon} alt={menu.alt} />
            {menu.pageName}
        </NavLink>
    ));

    return (
        <div className="flex flex-col items-center h-dvh w-1/6 bg-(--bg)">
            <div className="p-5">
                <span className="text-3xl text-shadow-lg font-black tracking-tighter text-(--text)">
                    SariStore<span className="text-(--primary)">MS</span>
                </span>
            </div>

            <nav className="flex flex-1 flex-col p-2.5 pt-5 pb-5 gap-2.5 w-full border-t border-b border-t-(--highlight) border-b-(--highlight)">
                {generateMenuButtons}
            </nav>
                        
            <div className="p-2.5 justify-self-end w-full">
                <button type="button" className="flex p-2.5 gap-2.5 w-full items-center text-lg text-shadow-lg text-(--text) rounded-2xl cursor-pointer hover:bg-(--bg-light)">
                    <img src={logOut} alt="log out button" />
                    Log in
                </button>
            </div>
        </div>
    )
};

export default DashboardMenu;
