import crypto from 'crypto';
import cartsModel from "../../schemas/carts.schema.js";
import productsModel from "../../schemas/products.schema.js";
import ticketModel from "../../schemas/ticket.schema.js";

export class GetCartDTO {

    constructor(payload) {

        this.code = payload.code;
        this.email = payload.email;

    }

    async prepareData() {

        const cart = await cartsModel.findOne({

            code: this.code

        }).populate('products.product').lean();

        if (!cart) {

            throw new Error('El carrito no existe');

        }

        if (cart.user.email !== this.email) {

            throw new Error('Este carrito no te pertenece');

        };

        return cart;

    };

}

export class SaveCartDTO {

    constructor(user) {

        this.user = user;

    }

    async prepareData() {

        const code = crypto.randomBytes(10).toString('hex');

        const cart = new cartsModel({
            code: code,
            user: {
                email: this.user
            },
            products: []
        });

        return cart;

    }

}

export class DeleteCartDTO {

    constructor(code, user) {
        this.code = code;
        this.email = user.email;
        this.role = user.role;
    }

    async prepareData() {

        const cart = await cartsModel.findOne({

            code: this.code

        });

        if (!cart) {

            throw new Error('El carrito no existe');

        };

        if (cart.user.email !== this.email && this.role !== 'ADMIN') {

            throw new Error('Este carrito no te pertenece');

        };

        return cart;

    };

};

export class AddProductDTO {

    constructor(code, productId, quantity, user) {

        this.code = code;
        this.productId = productId;
        this.quantity = quantity;
        this.user = user;

    };

    async prepareData() {

        const product = await productsModel.findOne({

            _id: this.productId

        });

        if (!product) {

            throw new Error('El producto no existe');

        };

        const cart = await cartsModel.findOne({

            code: this.code

        })

        const productQuantityInCart = cart.products.find(p => p.product.toString() === this.productId);

        const totalQuantity = productQuantityInCart ? productQuantityInCart.quantity + this.quantity : this.quantity;

        if (product.stock === 0 || totalQuantity > product.stock) {

            throw new Error('No hay suficiente stock del producto');

        };

        if (!cart) {

            throw new Error('El carrito no existe');

        };

        const owner_id = product.owner ? product.owner.toString() : product.adminOwner;

        const user_id = this.user._id ? this.user._id.toString() : 'ADMIN';

        if (this.user.role === 'ADMIN' || this.user.role === 'PREMIUM') {

            if (owner_id === true && this.user.role === 'ADMIN') {

                throw new Error('No puedes comprar tus propios productos');
            }

            if (owner_id === user_id) {

                throw new Error('No puedes comprar tus propios productos');

            };

        };

        const price = product.price;
        const productId = product._id;

        const productInCart = cart.products.find(p => p.product.toString() === this.productId);

        if (productInCart) {

            productInCart.quantity += Number(this.quantity);

        } else {

            const productToAdd = {
                product: productId,
                price: price,
                quantity: Number(this.quantity)
            };

            cart.products.push(productToAdd);

        }

        return cart;

    };

};


export class DeleteProductFromCartDTO {

    constructor(payload) {
        this.code = payload.code;
        this.productId = payload.productId;
        this.email = payload.email;
        this.role = payload.role;
    }

    async prepareData() {

        const cart = await cartsModel.findOne({

            code: this.code

        });

        const productPayload = await productsModel.findOne({

            _id: this.productId

        });

        if (!cart) {

            throw new Error('El carrito no existe');

        };

        if (cart.user.email !== this.email && this.role !== 'ADMIN') {

            throw new Error('Este carrito no te pertenece');

        };

        if (cart.products.length === 0) {

            throw new Error('El carrito está vacío');

        };

        const productsInCart = cart.products.map(p => ({
            product: p.product.toString(),
            quantity: p.quantity,
            price: p.price
        }));

        if (!productsInCart.find(p => p.product === this.productId)) {

            throw new Error('El producto no está en el carrito');

        };

        const productInCart = productsInCart.find(p => p.product === this.productId);

        if (productInCart.quantity > 1) {

            productsInCart.map(p => {

                if (p.product === this.productId) {

                    p.quantity -= 1;

                };

            });

        } else {

            productsInCart.splice(productsInCart.indexOf(productInCart), 1);

        };

        cart.products = productsInCart;

        return cart;


    };

};

export class PurchaseCartDTO {

    constructor(payload) {

        this.cart = payload.cart.payload;
        this.products = payload.cart.payload.products;
        this.email = payload.cart.payload.user.email;

    }

    async prepareData() {

        if (this.products.length === 0) {

            throw new Error('El carrito está vacío');

        };

        if (this.cart.user.email !== this.email) {

            throw new Error('Este carrito no te pertenece');

        };

        let amount = 0;

        this.products.map(p => {

            amount += p.price * p.quantity;

        });

        const productsIds = this.products.map(p => p.product);

        productsIds.map(async (id) => {

            const product = await productsModel.findOne({

                _id: id

            });

            const productInCart = this.products.find(p => p.product === id);

            product.stock -= productInCart.quantity;

            if (product.stock === 0) {

                await productsModel.findOneAndDelete({
                    _id: id
                });

            } else {

                await productsModel.findOneAndUpdate({
                    _id: id
                }, product);

            };

        });

        const newCart = {
            ...this.cart,
            products: []
        }

        const purchase = {

            code: crypto.randomBytes(10).toString('hex'),
            purchase_datetime: new Date(),
            amount: amount,
            purchaser: this.email,
            products: productsIds

        };

        const ticket = new ticketModel(purchase);
        await ticket.save();

        return {
            ticket: ticket,
            cart: newCart
        };

    }
};