import {
    getDAOS
} from "../../daos/index.daos.js";
import {
    getDTOS
} from "../../dtos/index.dtos.js";

const {
    GetCartDTO,
    SaveCartDTO,
    DeleteCartDTO,
    AddProductDTO,
    UpdateProductQuantityDTO,
    DeleteProductFromCartDTO,
    PurchaseCartDTO
} = getDTOS();

const {
    cartsMongoDAO,
    usersMongoDAO
} = getDAOS();

export class CartsRepository {

    constructor() {

        this.dao = cartsMongoDAO;

    };

    async getAll() {

        return await this.dao.getAll();

    };

    async getOne(payload) {

        const dto = new GetCartDTO(payload);

        if (dto.errors) throw new Error(JSON.stringify(dto.errors));

        const cartPayload = await dto.prepareData();

        const cart = await this.dao.getOne(cartPayload);

        if (!cart) throw new Error('El carrito no existe');

        return cart;

    };

    async saveOne(email) {


        const existingCart = await this.dao.getOne({
            email: email
        });

        if (existingCart) throw new Error('El usuario ya tiene un carrito');

        const dto = new SaveCartDTO(email);

        const preparedCart = await dto.prepareData();

        const result = await this.dao.saveOne(preparedCart);

        if (!result) throw new Error('No se pudo guardar el carrito');

        return result;

    };

    async addProduct(code, productId, quantity, email) {

        const user = await usersMongoDAO.getOne({
            email: email
        });

        const dto = new AddProductDTO(code, productId, quantity, user);

        const preparedCart = await dto.prepareData();

        const result = await this.dao.addProduct(code, preparedCart);

        if (!result) throw new Error('No se pudo agregar el producto');

        return result;

    };

    async deleteCart(payload, user) {

        const payloadToDelete = new DeleteCartDTO(payload, user);

        const preparedCart = await payloadToDelete.prepareData();

        const result = await this.dao.deleteCart(preparedCart);

        if (!result) throw new Error('No se pudo eliminar el carrito');

        return result;

    }

    async deleteProduct(payload) {

        const dto = new DeleteProductFromCartDTO(payload);

        const payloadToDelete = await dto.prepareData();

        const result = await this.dao.addProduct(payload.code, payloadToDelete);

        if (!result) throw new Error('No se pudo eliminar el producto');

        return result;

    };

    async purchaseCart(payload) {

        const dto = new PurchaseCartDTO(payload);

        const result = await dto.prepareData();

        if (!result) throw new Error('No se pudo comprar el carrito');

        const buyedCart = await this.dao.updateCart(result.cart);

        return {
            cart: buyedCart,
            ticket: result.ticket
        };

    };

};