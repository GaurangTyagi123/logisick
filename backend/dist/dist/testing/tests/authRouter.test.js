"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importStar(require("chai"));
const app_1 = __importDefault(require("../../src/app"));
const chai_http_1 = __importDefault(require("chai-http"));
const user_model_1 = __importDefault(require("../../src/models/user.model"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = require("mongoose");
// Use Chai-HTTP for making HTTP requests
chai_1.default.use(chai_http_1.default);
const request = chai_1.default.request;
let mongoServer;
// "before all" hook to connect to a temporary in-memory MongoDB
before(async function () {
    this.timeout(10000);
    mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await (0, mongoose_1.connect)(mongoUri);
});
// "after each" hook to clean the user collection after each test
afterEach(async function () {
    this.timeout(10000);
});
// "after all" hook to disconnect from the database and stop the in-memory server
after(async function () {
    this.timeout(10000);
    await user_model_1.default.deleteMany({});
    await (0, mongoose_1.disconnect)();
    await mongoServer.stop();
});
let loginCookie;
// --- Test Suite ---
suite("User Auth Test", function () {
    this.timeout(5000);
    suite("User creation tests", () => {
        test("should create a new user", async () => {
            const newUser = {
                name: "Kallu Mama",
                email: "mamakallu@gmail.com",
                password: "it's_mama_kallu",
                confirmPassword: "it's_mama_kallu",
            };
            const res = await request(app_1.default)
                .post("/api/v1/auth/signup")
                .send(newUser);
            // Assertions
            chai_1.assert.equal(res.status, 201, "Status should be 201");
            chai_1.assert.equal(res.body.status, "success", "Response status should be 'success'");
            chai_1.assert.isString(res.body.token, "Token should be a string");
            chai_1.assert.property(res.body.data, "user", "Response data should have a user property");
            const user = res.body.data.user;
            chai_1.assert.equal(user.name, newUser.name, "User name should match");
            chai_1.assert.equal(user.email, newUser.email, "User email should match");
            chai_1.assert.isString(user._id, "User ID should be a string");
            chai_1.assert.isBoolean(user.isVerified, "User isVerified should be a boolean");
            chai_1.assert.isString(user.avatar, "User avatar should be a string");
            chai_1.assert.isString(user.createdAt, "User createdAt should be a string");
            chai_1.assert.isString(user.updatedAt, "User updatedAt should be a string");
            // Cookie checks
            const rawCookies = res.header["set-cookie"];
            const cookies = Array.isArray(rawCookies)
                ? rawCookies
                : [rawCookies];
            const jwtCookie = cookies.find((c) => c.startsWith("jwt="));
            chai_1.assert.exists(jwtCookie, "JWT cookie should exist");
            const jwtValue = res.body.token;
            chai_1.assert.isString(jwtValue, "JWT value should be a string");
            chai_1.assert.isAtLeast(jwtValue.length, 11, "JWT value should be a string with length greater than 10");
            // Optional cookie flags
            chai_1.assert.include(jwtCookie, "HttpOnly", "Cookie should include HttpOnly flag");
        });
        test("should not create a new user with invalid data", async () => {
            const newUser = {
                name: "jonny gaddar",
                password: "it's_jonny_gaddar",
                confirmPassword: "it's_gaddar_jonny",
            };
            const res = await request(app_1.default)
                .post("/api/v1/auth/signup")
                .send(newUser);
            // Assertions
            chai_1.assert.equal(res.status, 400, "status should be 400");
            chai_1.assert.property(res.body, "message", "Please provide valid details");
            chai_1.assert.property(res.body, "status", "status should be in body");
            chai_1.assert.equal(res.body.status, "error", "status message should be error");
        });
    });
    suite("User login tests", () => {
        test("should login successfully", async () => {
            const loginData = {
                email: "mamakallu@gmail.com",
                password: "it's_mama_kallu",
            };
            const res = await request(app_1.default)
                .post("/api/v1/auth/login")
                .send(loginData);
            chai_1.assert.equal(res.status, 200, "Status should be 200");
            chai_1.assert.equal(res.body.status, "success", "Response status should be 'success'");
            chai_1.assert.isString(res.body.token, "Token should be a string");
            chai_1.assert.property(res.body.data, "user", "Response data should have a user property");
            const user = res.body.data.user;
            chai_1.assert.equal(user.name, "Kallu Mama", "User name should match");
            chai_1.assert.equal(user.email, loginData.email, "User email should match");
            chai_1.assert.isString(user._id, "User ID should be a string");
            chai_1.assert.isBoolean(user.isVerified, "User isVerified should be a boolean");
            chai_1.assert.isString(user.avatar, "User avatar should be a string");
            chai_1.assert.isString(user.createdAt, "User createdAt should be a string");
            chai_1.assert.isString(user.updatedAt, "User updatedAt should be a string");
            // Cookie checks
            const rawCookies = res.header["set-cookie"];
            const cookies = Array.isArray(rawCookies)
                ? rawCookies
                : [rawCookies];
            const jwtCookie = cookies.find((c) => c.startsWith("jwt="));
            chai_1.assert.exists(jwtCookie, "JWT cookie should exist");
            const jwtValue = res.body.token;
            loginCookie = jwtValue;
            chai_1.assert.isString(jwtValue, "JWT value should be a string");
            chai_1.assert.isAtLeast(jwtValue.length, 11, "JWT value should be a string with length greater than 10");
            // Optional cookie flags
            chai_1.assert.include(jwtCookie, "HttpOnly", "Cookie should include HttpOnly flag");
        });
        test("should not login (incomplete data)", async () => {
            const loginData = {
                email: "mamakallu@gmail.com",
            };
            const res = await request(app_1.default)
                .post("/api/v1/auth/login")
                .send(loginData);
            chai_1.assert.equal(res.status, 400, "status should be 400");
            chai_1.assert.property(res.body, "message", "Please provide a valid email and password");
            chai_1.assert.property(res.body, "status", "status should be in body");
            chai_1.assert.equal(res.body.status, "error", "status message should be error");
        });
        test("should not login (invalid data)", async () => {
            const loginData = {
                email: "kallumama@gmail.com",
                password: "its_mama_kallu",
            };
            const res = await request(app_1.default)
                .post("/api/v1/auth/login")
                .send(loginData);
            // Assertions
            chai_1.assert.equal(res.status, 401, "status should be 401");
            chai_1.assert.property(res.body, "message", "No such user exists");
            chai_1.assert.property(res.body, "status", "status should be in body");
            chai_1.assert.equal(res.body.status, "error", "status message should be error");
        });
    });
    suite("User logout tests", () => {
        test("successfull user logout", async () => {
            const res = await request(app_1.default)
                .get("/api/v1/auth/logout")
                .set("Cookie", `jwt=${loginCookie}`);
            chai_1.assert.equal(res.status, 200, "status should be 200");
            chai_1.assert.property(res.body, "status", "status should be in body");
            chai_1.assert.equal(res.body.status, "success", "status should be success");
        });
        test("unsuccessfull user logout (without token / invalid token)", async () => {
            const res = await request(app_1.default).get("/api/v1/auth/logout");
            chai_1.assert.equal(res.status, 401, "status should be 401");
            chai_1.assert.property(res.body, "status", "status should be in body");
            chai_1.assert.equal(res.body.status, "error", "status should be error");
            chai_1.assert.property(res.body, "message", "message should be in body");
            chai_1.assert.oneOf(res.body.message, ["Invalid Token", "Password updated recently"], "error message should be one of given");
        });
    });
});
