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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailVerify = void 0;
const emailConfig_1 = require("./emailConfig");
const EmailVerify = (_a) => __awaiter(void 0, [_a], void 0, function* ({ emailId, url }) {
    try {
        const response = yield emailConfig_1.transport.sendMail({
            from: '"From Backend 👨‍💼" <BazzarVibe>',
            to: emailId,
            subject: "Email verification", // Subject line
            html: `
            <!doctype html>
            <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </head>
            <body>
                <h1 class="text-align:center; font-size:1.5rem;background-color:blue;color:white;">Email Verification</h1>
                <br/>
                <a href='${url}' >Click To verify</a>
            </body>
            </html>
            `,
        });
        return response;
    }
    catch (error) {
        console.log(error);
        return error;
    }
});
exports.EmailVerify = EmailVerify;
