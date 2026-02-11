import deleteIcon from "../../../assets/svg/delete-icon.svg";
import editIcon from "../../../assets/svg/edit-icon.svg";

const ProductTable = () => {
    return (
        <div className="flex flex-col flex-1 p-5 gap-2.5">
            <div className="flex items-center p-2.5 px-5 w-full bg-(--bg-light) rounded-tl-3xl rounded-tr-3xl border border-(--border) text-lg text-(--text) font-light">
                <h1 className="flex-1">Name</h1>
                <h1 className="w-1/6">Category</h1>
                <h1 className="w-1/8">Unit Type</h1>
                <h1 className="w-1/8">Sell Price</h1>
                <h1 className="w-1/8">Cost Price</h1>
                <h1 className="w-1/12">Action</h1>
            </div>
            <div className="flex flex-col flex-1 items-center w-full bg-(--bg-light) rounded-bl-3xl rounded-br-3xl border border-(--border)">
                <div className="flex-1 w-full">
                    <div className="flex justify-center items-center p-2.5 px-5 border-b border-b-(--border) w-full text-lg text-(--text) font-bold">
                        <h1>No Products found.</h1>
                    </div>
                    <div className="flex items-center p-2.5 px-5 border-b border-b-(--border) w-full text-lg text-(--text) font-bold">
                        <h1 className="flex-1">Sample Product</h1>
                        <h1 className="w-1/6">Sample Category</h1>
                        <h1 className="w-1/8">kg</h1>
                        <h1 className="w-1/8">$17.50</h1>
                        <h1 className="w-1/8">$15.00</h1>
                        <div className="flex gap-2.5 w-1/12">
                            <button className="flex justify-center items-center px-1.5 py-3 w-1/3 bg-green-500 hover:bg-(--warning) active:bg-green-300 rounded-4xl">
                                <img src={editIcon} alt="edit" className="size-4"/>
                            </button>
                            <button className="flex justify-center items-center px-1.5 py-3 w-1/3 bg-red-500 hover:bg-(--warning) active:bg-red-300 rounded-4xl">
                                <img src={deleteIcon} alt="delete" className="size-4"/>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center items-center self-end p-2.5 px-5 border-t border-t-(--border) w-full text-lg text-(--text) font-bold">
                    <h1>Page 1</h1>
                </div>
            </div>
        </div>
    );
};

export default ProductTable;
