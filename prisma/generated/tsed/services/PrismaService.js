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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const di_1 = require("@tsed/di");
const logger_1 = require("@tsed/logger");
const client_1 = require("../client");
let PrismaService = class PrismaService extends client_1.PrismaClient {
    constructor(settings) {
        super(settings.get('prisma'));
    }
    async $onInit() {
        this.logger.info("Connection to prisma database");
        await this.$connect();
    }
    async $onDestroy() {
        this.logger.info("Disconnection from prisma database");
        await this.$disconnect();
    }
};
__decorate([
    (0, di_1.Inject)(),
    __metadata("design:type", logger_1.Logger)
], PrismaService.prototype, "logger", void 0);
PrismaService = __decorate([
    (0, di_1.Injectable)(),
    __param(0, (0, di_1.Configuration)()),
    __metadata("design:paramtypes", [Object])
], PrismaService);
exports.PrismaService = PrismaService;
