import { Configuration, OnInit, OnDestroy } from "@tsed/di";
import { Logger } from "@tsed/logger";
import { PrismaClient } from "../client";
export declare class PrismaService extends PrismaClient implements OnInit, OnDestroy {
    protected logger: Logger;
    constructor(settings: Configuration);
    $onInit(): Promise<void>;
    $onDestroy(): Promise<void>;
}
