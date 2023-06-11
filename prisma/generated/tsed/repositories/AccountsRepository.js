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
exports.AccountsRepository = void 0;
const core_1 = require("@tsed/core");
const json_mapper_1 = require("@tsed/json-mapper");
const di_1 = require("@tsed/di");
const PrismaService_1 = require("../services/PrismaService");
const models_1 = require("../models");
let AccountsRepository = class AccountsRepository {
    get collection() {
        return this.prisma.accounts;
    }
    get groupBy() {
        return this.collection.groupBy.bind(this.collection);
    }
    deserialize(obj) {
        return (0, json_mapper_1.deserialize)(obj, { type: models_1.AccountsModel, collectionType: (0, core_1.isArray)(obj) ? Array : undefined });
    }
    async findUnique(args) {
        const obj = await this.collection.findUnique(args);
        return this.deserialize(obj);
    }
    async findFirst(args) {
        const obj = await this.collection.findFirst(args);
        return this.deserialize(obj);
    }
    async findMany(args) {
        const obj = await this.collection.findMany(args);
        return this.deserialize(obj);
    }
    async create(args) {
        const obj = await this.collection.create(args);
        return this.deserialize(obj);
    }
    async update(args) {
        const obj = await this.collection.update(args);
        return this.deserialize(obj);
    }
    async upsert(args) {
        const obj = await this.collection.upsert(args);
        return this.deserialize(obj);
    }
    async delete(args) {
        const obj = await this.collection.delete(args);
        return this.deserialize(obj);
    }
    deleteMany(args) {
        return this.collection.deleteMany(args);
    }
    updateMany(args) {
        return this.collection.updateMany(args);
    }
    aggregate(args) {
        return this.collection.aggregate(args);
    }
};
__decorate([
    (0, di_1.Inject)(),
    __metadata("design:type", PrismaService_1.PrismaService)
], AccountsRepository.prototype, "prisma", void 0);
AccountsRepository = __decorate([
    (0, di_1.Injectable)()
], AccountsRepository);
exports.AccountsRepository = AccountsRepository;
