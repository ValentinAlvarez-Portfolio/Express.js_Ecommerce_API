

import {
      GetProductDTO,
      SaveProductDTO,
} from "./products/products.dto.js";

import {
      GetCartDTO,
      SaveCartDTO,
      DeleteCartDTO,
      AddProductDTO,
      DeleteProductFromCartDTO,
      PurchaseCartDTO
} from "./carts/carts.dto.js";

export const getDTOS = () => ({
      GetCartDTO,
      SaveCartDTO,
      DeleteCartDTO,
      AddProductDTO,
      DeleteProductFromCartDTO,
      PurchaseCartDTO,
      GetProductDTO,
      SaveProductDTO,
});