"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const import_employees_1 = require("./import_employees");
const import_organizations_1 = require("./import_organizations");
const import_user_1 = require("./import_user");
if (process.argv[2] === '--import') {
    Promise.all([(0, import_user_1.import_user)(), (0, import_organizations_1.import_orgs)(), (0, import_employees_1.import_employees)()]);
}
if (process.argv[2] === '--delete') {
    Promise.all([(0, import_employees_1.delete_employees)(), (0, import_organizations_1.delete_orgs)(), (0, import_user_1.delete_user)()]);
}
