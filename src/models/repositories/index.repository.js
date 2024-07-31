
import {
      ProductsRepository
} from "./products/products.repository.js";
import {
      CartsRepository
} from "./carts/carts.repository.js";

const productsRepository = new ProductsRepository();
const cartsRepository = new CartsRepository();

export const getRepositories = () => ({
      productsRepository,
      cartsRepository
});