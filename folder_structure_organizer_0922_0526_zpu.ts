// 代码生成时间: 2025-09-22 05:26:01
import { PrismaClient } from '@prisma/client';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

// 创建Prisma客户端实例
const prisma = new PrismaClient();

/**
 * 获取文件夹中所有文件和子文件夹，返回一个包含文件路径的数组
 * @param {string} dirPath - 文件夹路径
 * @returns {Promise<string[]>} 包含所有文件路径的数组
 */
async function getFolderContents(dirPath: string): Promise<string[]> {
  try {
    const files = await fs.readdir(dirPath, { withFileTypes: true });
    const filePaths = [];
    for (const file of files) {
      if (file.isDirectory()) {
        // 如果是文件夹，递归调用此函数
        const subFiles = await getFolderContents(path.join(dirPath, file.name));
        filePaths.push(...subFiles);
      } else if (file.isFile()) {
        // 如果是文件，添加到数组中
        filePaths.push(path.join(dirPath, file.name));
      }
    }
    return filePaths;
  } catch (error) {
    throw new Error(`Error reading directory: ${error.message}`);
  }
}

/**
 * 整理文件夹结构，确保每个文件都在正确的位置
 * @param {string[]} filePaths - 文件路径数组
 * @param {string} targetDir - 目标文件夹路径
 */
async function organizeFolderStructure(filePaths: string[], targetDir: string): Promise<void> {
  try {
    for (const filePath of filePaths) {
      // 检查文件是否已经存在于目标目录中
      const targetFilePath = path.join(targetDir, path.basename(filePath));
      if (await fs.access(targetFilePath).then(() => true, () => false)) {
        console.log(`File ${targetFilePath} already exists. Skipping...`);
        continue;
      }
      // 移动文件到目标目录
      await fs.rename(filePath, targetFilePath);
      console.log(`Moved ${filePath} to ${targetFilePath}`);
    }
  } catch (error) {
    throw new Error(`Error organizing folder structure: ${error.message}`);
  }
}

/**
 * 主函数，用于执行文件夹结构整理流程
 * @param {string} sourceDir - 源文件夹路径
 * @param {string} targetDir - 目标文件夹路径
 */
async function main(sourceDir: string, targetDir: string): Promise<void> {
  try {
    // 获取源文件夹中所有文件的路径
    const filePaths = await getFolderContents(sourceDir);
    // 整理文件夹结构
    await organizeFolderStructure(filePaths, targetDir);
    console.log('Folder structure organized successfully.');
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

// 程序入口点
const sourceDir = path.join(__dirname, 'source');
const targetDir = path.join(__dirname, 'target');
main(sourceDir, targetDir);
