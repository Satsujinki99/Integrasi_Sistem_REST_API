import { Schema, model } from "mongoose";

const ItemSchema = new Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
});

export default model("Item", ItemSchema);
