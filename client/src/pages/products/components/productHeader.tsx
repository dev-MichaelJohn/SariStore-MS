import search from "../../../assets/svg/search-icon.svg";
import dropdown from "../../../assets/svg/dropdown-icon.svg";
import add from "../../../assets/svg/add-icon.svg";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import axios from "axios";
import { SERVER_API_URL } from "@lib/request.lib";
import { useEffect, useState } from "react";
import type { AppResponse } from "../../../types/AppResponse";
import toast from "react-hot-toast";

type IProductCategory = {
    id: string,
    name: string,
    description: string,
};

const ProductHeader = () => {
    const [categories, setCategories] = useState<IProductCategory[]>([]);
    const [category, setCategory] = useState<IProductCategory>({
        id: "",
        name: "",
        description: ""
    });

    const handleChangeCategory = (category: IProductCategory) => setCategory((prev) => category);

    const generateProductCategories = categories?.map((cat, index) => (
        <MenuItem key={index}>
            <button title={cat.description}
            onClickCapture={() => handleChangeCategory(cat)}
            className={`${category.name === cat.name && "bg-(--secondary) text-shadow-lg font-bold"}
            text-(--text) group flex w-full items-center rounded-xl px-3 py-2 cursor-pointer text-sm transition-colors duration-100 hover:bg-(--bg-light)`}>
                {cat.name} 
            </button>
        </MenuItem>
    ));

    useEffect(() => {
        const getCategories = async () => {
            try {
                const response = await axios.get(`${SERVER_API_URL}/v1/products/categories`);
                const payload: AppResponse = response.data;
                
                // Optional: Add a check if payload.data exists before casting
                if (payload.data?.productCategories) {
                    setCategories(payload.data.productCategories as IProductCategory[]);
                }
            } catch (error) {
                toast.error(`Failed to fetch categories: ${error}`);
                // You could set an error state here to show a toast message
            }
        };

        getCategories();
    }, []);

    return (
        <div className="w-full flex items-center gap-2.5">
            <h1 className="flex-1 text-3xl font-extrabold text-(--text)">Products</h1>
            <div className="flex w-1/4 bg-(--bg) p-2.5 px-5 rounded-3xl border border-(--border)">
                <input type="text" placeholder="Search" className="flex-1 placeholder:text-(--text-muted) text-(--text) font-light text-lg outline-0" />
                <img src={search} alt="search icon" />
            </div>
            <Menu as="div" className="w-1/5">
                <MenuButton 
                className="flex w-full items-center justify-between gap-2.5 bg-(--primary) p-2.5 px-5 rounded-3xl outline-0 text-(--text) font-bold text-shadow-lg cursor-pointer">
                    {(category.name !== "") ? category.name : "Product Category"}
                    <img src={dropdown} alt="dropdown icon"/>
                </MenuButton>
                <MenuItems transition anchor="bottom end"
                className="mt-2 w-56 origin-top rounded-2xl bg-(--bg) border border-(--border) p-2.5 focus:outline-0">
                    {category.name !== "" &&
                    <MenuItem> 
                        <button onClickCapture={() => handleChangeCategory({
                            id: "", name: "", description: ""
                        })}
                        className="text-(--text) flex w-full items-center rounded-xl px-3 py-2 cursor-pointer text-sm transition-colors duration-100 font-bold hover:bg-(--danger)">
                            Reset Filter
                        </button>
                    </MenuItem>
                    }
                    {generateProductCategories}
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
