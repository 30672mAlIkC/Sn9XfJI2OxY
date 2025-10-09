// 代码生成时间: 2025-10-09 22:49:54
// system_resource_monitor.ts
// This TypeScript program uses the PRISMA framework to monitor system resources.

import { PrismaClient } from '@prisma/client';
import { promises as fs } from 'fs';
import { cpu } from 'node-os-utils';
import { memory } from 'node-os-utils';
import { disk } from 'node-os-utils';
import { network } from 'node-os-utils';

class SystemResourceMonitor {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  // Monitor CPU usage
  async monitorCpuUsage(): Promise<void> {
    try {
      const cpuUsage = await cpu.usage();
      const cpuRecord = {
        cpuUsagePercentage: cpuUsage,
        timestamp: new Date().toISOString(),
      };
      await this.prisma.resource.create({
        data: {
          type: 'cpu',
          value: cpuUsage,
          timestamp: cpuRecord.timestamp,
        },
      });
      console.log(`CPU Usage: ${cpuUsage}%`);
    } catch (error) {
      console.error('Failed to monitor CPU usage:', error);
    }
  }

  // Monitor Memory usage
  async monitorMemoryUsage(): Promise<void> {
    try {
      const freeMemory = await memory.freeMemMb();
      const totalMemory = await memory.totalMemMb();
      const memoryRecord = {
        freeMemory,
        totalMemory,
        timestamp: new Date().toISOString(),
      };
      await this.prisma.resource.create({
        data: {
          type: 'memory',
          value: freeMemory,
          timestamp: memoryRecord.timestamp,
        },
      });
      console.log(`Free Memory: ${freeMemory} MB of ${totalMemory} MB`);
    } catch (error) {
      console.error('Failed to monitor Memory usage:', error);
    }
  }

  // Monitor Disk usage
  async monitorDiskUsage(): Promise<void> {
    try {
      const diskUsage = await disk.usage();
      const diskRecord = {
        used: diskUsage.usedGb,
        total: diskUsage.totalGb,
        timestamp: new Date().toISOString(),
      };
      await this.prisma.resource.create({
        data: {
          type: 'disk',
          value: diskUsage.usedGb,
          timestamp: diskRecord.timestamp,
        },
      });
      console.log(`Disk Usage: ${diskUsage.usedGb} GB of ${diskUsage.totalGb} GB`);
    } catch (error) {
      console.error('Failed to monitor Disk usage:', error);
    }
  }

  // Monitor Network usage
  async monitorNetworkUsage(): Promise<void> {
    try {
      const networkUsage = await network.io();
      const networkRecord = {
        received: networkUsage.received,
        sent: networkUsage.sent,
        timestamp: new Date().toISOString(),
      };
      await this.prisma.resource.create({
        data: {
          type: 'network',
          value: networkUsage.received + networkUsage.sent,
          timestamp: networkRecord.timestamp,
        },
      });
      console.log(`Network Usage: ${networkUsage.received + networkUsage.sent} bytes`);
    } catch (error) {
      console.error('Failed to monitor Network usage:', error);
    }
  }

  // Main function to run the monitoring process
  async run(): Promise<void> {
    try {
      await this.monitorCpuUsage();
      await this.monitorMemoryUsage();
      await this.monitorDiskUsage();
      await this.monitorNetworkUsage();
    } catch (error) {
      console.error('Error running system resource monitor:', error);
    }
  }
}

// Entry point of the program
const monitor = new SystemResourceMonitor();
monitor.run();