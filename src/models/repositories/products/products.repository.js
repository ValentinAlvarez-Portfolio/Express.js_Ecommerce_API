import {
    getDAOS
} from "../../daos/index.daos.js";
import {
    getDTOS
} from "../../dtos/index.dtos.js";

const {
    GetProductDTO,
    SaveProductDTO,
    LoadProductDTO,
    UpdateProductDTO,
    DeleteProductDTO
} = getDTOS();

const {
    productsMongoDAO,
    usersMongoDAO
} = getDAOS();

export class ProductsRepository {

    constructor() {

        this.dao = productsMongoDAO;
        this.usersDao = usersMongoDAO;

    };

    async getAll({
        limit = 10,
        page = 1,
        sort,
        query
    }) {

        return await this.dao.getAll({
            limit,
            page,
            sort,
            query
        })

    };

    async getById(id) {

        const product = await this.dao.getById(id);

        const preparedProduct = new GetProductDTO(product);

        if (preparedProduct.errors) throw new Error(JSON.stringify(preparedProduct.errors));

        return preparedProduct;

    };

    async addOne(payload, user) {

        const product = new SaveProductDTO(payload, user);

        const preparedProduct = await product.prepareData();

        return await this.dao.saveProduct(preparedProduct);

    };

    async updateOne(id, product, userPayload) {

        const user = await this.usersDao.getOne(userPayload);

        if (!userPayload.role === 'ADMIN' || !userPayload.role === 'PREMIUM') {
            throw new Error('No tienes permisos para realizar esta acción')
        }

        const productToUpdate = await this.getById(id);

        if (!productToUpdate) {
            throw new Error('El producto no existe');
        };

        const adminOwner = productToUpdate.payload.adminOwner || productToUpdate.adminOwner;
        const owner = productToUpdate.payload.owner || productToUpdate.owner || null;

        if (adminOwner === true) {
            if (userPayload.role !== 'ADMIN') {
                throw new Error('No tienes permisos para realizar esta acción')
            }
        }

        if (owner && userPayload.role !== 'ADMIN') {
            if (owner.toString() !== user._id.toString()) {
                throw new Error('El producto no te pertenece');
            }
        }

        const result = await this.dao.updateById(id, product);

        const updatedProduct = await this.getById(id);

        return updatedProduct;

    };

    async deleteOne(id, userPayload) {

        const user = await this.usersDao.getOne(userPayload);

        if (!userPayload.role === 'ADMIN' || !userPayload.role === 'PREMIUM') {
            throw new Error('No tienes permisos para realizar esta acción')
        }

        const productToDelete = await this.getById(id);

        if (!productToDelete) {
            throw new Error('El producto no existe');
        };

        const adminOwner = productToDelete.payload.adminOwner || productToDelete.adminOwner;
        const owner = productToDelete.payload.owner || productToDelete.owner || null;

        if (adminOwner === true) {
            if (userPayload.role !== 'ADMIN') {
                throw new Error('No tienes permisos para realizar esta acción')
            }
        }

        if (owner && userPayload.role !== 'ADMIN') {
            if (owner.toString() !== user._id.toString()) {
                throw new Error('El producto no te pertenece');
            }
        }

        const email = userPayload.role === 'PREMIUM' ? user.email : undefined;

        const result = await this.dao.deleteById(id);

        return {
            ...productToDelete,
            email: email
        };

    };

}