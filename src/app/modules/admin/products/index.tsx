import DataTable, { type TableColumn } from "react-data-table-component";
import type {
  IProduct,
  IProductList,
} from "../../../core/interfaces/product.interface";
import { useEffect, useState, useCallback } from "react";
import { getProductsRequest } from "../../../core/services/auth/product.service";

const Products = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<IProductList | null>(null);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getProductsRequest({ page, per_page: perPage });
      setProducts(data);
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, perPage]);

  const columns: TableColumn<IProduct>[] = [
    {
      name: "ID",
      selector: (row: IProduct) => row.id,
      sortable: true,
      width: "100px",
    },
    {
      name: "Name",
      selector: (row: IProduct) => row.attributes.name,
      sortable: true,
      style: {
        fontWeight: "bold",
      },
      width: "200px",
    },
    {
      name: "Description",
      selector: (row: IProduct) => row.attributes.description,
      sortable: true,
    },
  ];

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handlePerPageChange = (perPage: number) => {
    setPerPage(perPage);
  };

  useEffect(() => {
    const getProducts = setTimeout(() => {
      fetchProducts();
    }, 500);
    return () => clearTimeout(getProducts);
  }, [fetchProducts]);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-bold text-gray-900 dark:text-white">
        Products
      </h1>
      <div className="card bg-white p-4 rounded-lg shadow text-black">
        {loading ? (
          <div className="flex flex-col justify-center items-center">
            <span className="loading loading-dots loading-xl"></span>
            <span>Loading...</span>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={products?.data || []}
            pagination
            paginationServer
            paginationPerPage={perPage}
            paginationTotalRows={products?.meta?.total || 0}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handlePerPageChange}
          />
        )}
      </div>
    </div>
  );
};

export default Products;
