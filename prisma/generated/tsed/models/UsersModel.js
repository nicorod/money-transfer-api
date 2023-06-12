"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModel = void 0;
const schema_1 = require("@tsed/schema");
const enums_1 = require("../enums");
const AccountsModel_1 = require("./AccountsModel");
class UsersModel {
}
__decorate([
    (0, schema_1.Property)(Number),
    (0, schema_1.Integer)(),
    (0, schema_1.Required)(),
    __metadata("design:type", Number)
], UsersModel.prototype, "id", void 0);
__decorate([
    (0, schema_1.Property)(String),
    (0, schema_1.Required)(),
    __metadata("design:type", String)
], UsersModel.prototype, "name", void 0);
__decorate([
    (0, schema_1.Property)(String),
    (0, schema_1.Required)(),
    __metadata("design:type", String)
], UsersModel.prototype, "email", void 0);
__decorate([
    (0, schema_1.Property)(String),
    (0, schema_1.Required)(),
    __metadata("design:type", String)
], UsersModel.prototype, "password", void 0);
__decorate([
    (0, schema_1.Required)(),
    (0, schema_1.Enum)(enums_1.Role),
    __metadata("design:type", String)
], UsersModel.prototype, "role", void 0);
__decorate([
    (0, schema_1.CollectionOf)(() => AccountsModel_1.AccountsModel),
    (0, schema_1.Required)(),
    __metadata("design:type", Array)
], UsersModel.prototype, "accounts", void 0);
exports.UsersModel = UsersModel;
