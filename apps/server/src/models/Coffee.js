"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coffee = void 0;
const mongoose_1 = require("mongoose");
const CoffeeSchema = new mongoose_1.Schema({
    requesterName: { type: String, required: true },
    requesterEmail: { type: String, required: true },
    requestedTime: { type: Date, required: true },
    requestedLocation: { type: String, required: true }
});
exports.Coffee = (0, mongoose_1.model)('Coffee', CoffeeSchema);
