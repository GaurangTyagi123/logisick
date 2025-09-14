import chai, { assert } from "chai";
import app from "../src/app";
import chaiHttp from "chai-http";
import userModel from "../src/models/user.model";
import { MongoMemoryServer } from "mongodb-memory-server";
import { connect, disconnect } from "mongoose";

// Use Chai-HTTP for making HTTP requests
chai.use(chaiHttp);

const request = chai.request;

let mongoServer: MongoMemoryServer;

// "before all" hook to connect to a temporary in-memory MongoDB
before(async function () {
	this.timeout(10000);
	mongoServer = await MongoMemoryServer.create();
	const mongoUri = mongoServer.getUri();
	await connect(mongoUri);
});

// "after each" hook to clean the user collection after each test
afterEach(async function () {
	this.timeout(10000);
	await userModel.deleteMany({});
});

// "after all" hook to disconnect from the database and stop the in-memory server
after(async function () {
	this.timeout(10000);
	await disconnect();
	await mongoServer.stop();
});

// --- Test Suite ---
suite("User Auth Test", function () {
	this.timeout(5000);

	test("should create a new user", async () => {
		const newUser = {
			name: "Kallu Mama",
			email: "mamakallu@gmail.com",
			password: "it's_mama_kallu",
			confirmPassword: "it's_mama_kallu",
		};

		const res = await request(app)
			.post("/api/v1/auth/signup")
			.send(newUser);

		// Assertions
		assert.equal(res.status, 201, "Status should be 201");
		assert.equal(
			res.body.status,
			"success",
			"Response status should be 'success'"
		);
		assert.isString(res.body.token, "Token should be a string");
		assert.property(
			res.body.data,
			"user",
			"Response data should have a user property"
		);

		const user = res.body.data.user;
		assert.equal(user.name, newUser.name, "User name should match");
		assert.equal(user.email, newUser.email, "User email should match");
		assert.isString(user._id, "User ID should be a string");
		assert.isBoolean(
			user.isVerified,
			"User isVerified should be a boolean"
		);
		assert.isString(user.role, "User role should be a string");
		assert.isString(user.avatar, "User avatar should be a string");
		assert.isString(user.createdAt, "User createdAt should be a string");
		assert.isString(user.updatedAt, "User updatedAt should be a string");

		// Cookie checks
		const rawCookies = res.header["set-cookie"];
		const cookies = Array.isArray(rawCookies) ? rawCookies : [rawCookies];
		const jwtCookie = cookies.find((c) => c.startsWith("jwt="));
		assert.exists(jwtCookie, "JWT cookie should exist");

		const jwtValue = jwtCookie!.split(";")[0].split("=")[1];
		assert.isString(jwtValue, "JWT value should be a string");
		assert.isAtLeast(
			jwtValue.length,
			11,
			"JWT value should be a string with length greater than 10"
		);

		// Optional cookie flags
		assert.include(
			jwtCookie,
			"HttpOnly",
			"Cookie should include HttpOnly flag"
		);
	});

	test("should not create a new user with invalid data", async () => {
		const newUser = {
			name: "jonny gaddar",
			password: "it's_jonny_gaddar",
			confirmPassword: "it's_gaddar_jonny",
		};

		const res = await request(app)
			.post("/api/v1/auth/signup")
			.send(newUser);

		// Assertions
		assert.equal(res.status, 400, "status should be 400");
		assert.property(res.body, "message", "Please provide valid details");
		assert.property(res.body, "status", "status should be in body");
		assert.equal(
			res.body.status,
			"error",
			"status message should be error"
		);
	});
});
