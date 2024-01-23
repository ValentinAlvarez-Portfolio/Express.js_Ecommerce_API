import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = "products";

const productsSchema = mongoose.Schema({

      title: {
            type: String,
            required: true,
      },

      description: {
            type: String,
            required: true,
      },

      code: {
            type: String,
            required: true,
      },

      price: {
            type: Number,
            required: true,
      },

      discount: {
            type: String,
      },

      status: {
            type: Boolean,
            required: true,
            default: true,
      },

      stock: {
            type: Number,
            required: true,
      },

      category: {
            type: String,
            required: true,
      },

      section: {
            type: String,
            required: true,
      },

      color: {
            type: String,
      },

      thumbnails: {
            type: Array,
            required: false,
      },

      id: {
            type: Number,
            required: true,
      },

      owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            validate: [ownerValidator, 'No se puede establecer un owner si adminOwner es true']
      },

      adminOwner: {
            type: Boolean,
            required: true,
            default: false,
      },

});

function ownerValidator(value) {

      if (this.adminOwner) {
            return value == null;
      }

      return true;

}

productsSchema.plugin(mongoosePaginate)

const productsModel = mongoose.model(productsCollection, productsSchema);

export default productsModel;