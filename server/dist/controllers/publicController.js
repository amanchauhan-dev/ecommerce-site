"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetNewProducts = void 0;
const config_1 = __importDefault(require("../db/config"));
const GetNewProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [result] = yield config_1.default.query(`
            SELECT * FROM products 
            WHERE status = 1 ORDER BY id
            DESC LIMIT 30
            `);
        res.send({ result });
    }
    catch (error) {
        res.status(501).json(error);
        console.log('Error', error);
    }
});
exports.GetNewProducts = GetNewProducts;
