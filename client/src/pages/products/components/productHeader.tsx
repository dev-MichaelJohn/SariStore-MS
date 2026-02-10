import search from "../../../assets/svg/search-icon.svg";
import dropdown from "../../../assets/svg/dropdown-icon.svg";
import add from "../../../assets/svg/add-icon.svg";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

const ProductHeader = () => {
    return (
        <div className="w-full flex items-center gap-2.5">
            <h1 className="flex-1 text-3xl font-extrabold text-(--text)">Products</h1>
            <div className="flex w-1/4 bg-(--bg) p-2.5 px-5 rounded-3xl">
                <input type="text" placeholder="Search" className="flex-1 placeholder:text-(--text-muted) text-(--text) font-light text-lg outline-0" />
                <img src={search} alt="search icon" />
            </div>
            <Menu as="div">
                <MenuButton className="flex items-center justify-evenly gap-2.5 bg-(--primary) p-2.5 px-5 rounded-3xl outline-0 text-(--text) font-bold text-shadow-lg">
                    Product Category
                    <img src={dropdown} alt="dropdown icon"/>
                </MenuButton>
                <MenuItems transition anchor="bottom end"
                className="mt-2 w-56 origin-top rounded-2xl bg-(--bg) border border-(--border) p-2.5 focus:outline-0">
                    <MenuItem>
                        <button className="text-(--text) group flex w-full items-center rounded-xl px-3 py-2 text-sm transition-colors duration-250 hover:bg-(--bg-light)">
                            Category #3
                        </button>
                    </MenuItem>
                    <MenuItem>
                        <button className="text-(--text) group flex w-full items-center rounded-xl px-3 py-2 text-sm transition-colors duration-250 hover:bg-(--bg-light)">
                            Category #2
                        </button>
                    </MenuItem>
                    <MenuItem>
                        <button className="text-(--text) group flex w-full items-center rounded-xl px-3 py-2 text-sm transition-colors duration-250 hover:bg-(--bg-light)">
                            Category #1
                        </button>
                    </MenuItem>
                </MenuItems>
            </Menu>
            <button 
            className="flex items-center gap-2.5 bg-(--primary) p-2.5 px-5 rounded-3xl outline-0 text-(--text) font-bold text-shadow-lg hover:bg-(--secondary) active:bg-(--highlight)">
                <img src={add} alt="add icon" />
                New Product
            </button>
        </div>
    );
};

export default ProductHeader;
