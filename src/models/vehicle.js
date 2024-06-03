const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const vehicleSchema = new Schema({
    vehicle_no: {
        type: String,
        unique: true,
        required: true
    },
    cus_name: {
        type: String,
        required: true
    },
    v_type: {
        type: String,
        required: true
    },
    s_type: {
        type: String,
        required: true
    },
    s_date: {
        type: Date,
        required: true
    },
    nextS_date: {
        type: Date,
        default: null
    },
    replacedParts: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    }
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
