import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
    private startTime: number;

    constructor() {
        this.startTime = Date.now();
    }

    @Get('/health')
    getHealth() {
        const uptime = process.uptime();
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: uptime,
        };
    }
}