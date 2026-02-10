import ProductHeader from "./components/productHeader";
import ProductTable from "./components/productTable";

const ProductsPage = () => {
    return (
        <div className="flex flex-col w-full h-dvh p-5">
            <ProductHeader />
            <ProductTable />
        </div>
    );
};

export default ProductsPage;
