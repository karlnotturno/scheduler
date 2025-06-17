"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const coffees_1 = __importDefault(require("./routes/coffees"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.get('/', (_req, res) => {
    res.json('Hello strange one!');
});
app.use('/api/coffees', coffees_1.default);
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hill-scheduler';
mongoose_1.default.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
