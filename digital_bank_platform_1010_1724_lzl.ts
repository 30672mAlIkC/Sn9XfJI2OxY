// 代码生成时间: 2025-10-10 17:24:04
 * @author [Your Name]
 * @version 1.0
 */

// Import necessary modules
import { PrismaClient } from '@prisma/client';

// Initialize the Prisma client
const prisma = new PrismaClient();

// Define a class for the Digital Bank
class DigitalBank {
  // Method to create a new user
  async createUser(data: { name: string; email: string; password: string }): Promise<void> {
    try {
      // Check if user already exists with the same email
      const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
      if (existingUser) {
        throw new Error('User with this email already exists.');
      }
      // Create a new user
      await prisma.user.create({ data });
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Method to create a new account
  async createAccount(data: { ownerEmail: string; accountNumber: string; balance: number }): Promise<void> {
    try {
      // Check if account already exists with the same account number
      const existingAccount = await prisma.account.findUnique({ where: { accountNumber: data.accountNumber } });
      if (existingAccount) {
        throw new Error('Account with this number already exists.');
      }
      // Check if the owner email exists in the user table
      const owner = await prisma.user.findUnique({ where: { email: data.ownerEmail } });
      if (!owner) {
        throw new Error('Owner not found.');
      }
      // Create a new account
      await prisma.account.create({ data });
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  }

  // Method to deposit money into an account
  async deposit(data: { accountNumber: string; amount: number }): Promise<void> {
    try {
      // Check if the account exists
      const account = await prisma.account.findUnique({ where: { accountNumber: data.accountNumber } });
      if (!account) {
        throw new Error('Account not found.');
      }
      // Update the account balance
      await prisma.account.update({
        where: { accountNumber: data.accountNumber },
        data: { balance: { increment: data.amount } }
      });
    } catch (error) {
      console.error('Error depositing money:', error);
      throw error;
    }
  }

  // Method to withdraw money from an account
  async withdraw(data: { accountNumber: string; amount: number }): Promise<void> {
    try {
      // Check if the account exists
      const account = await prisma.account.findUnique({ where: { accountNumber: data.accountNumber } });
      if (!account) {
        throw new Error('Account not found.');
      }
      // Check if the account has enough balance
      if (account.balance < data.amount) {
        throw new Error('Insufficient funds.');
      }
      // Update the account balance
      await prisma.account.update({
        where: { accountNumber: data.accountNumber },
        data: { balance: { decrement: data.amount } }
      });
    } catch (error) {
      console.error('Error withdrawing money:', error);
      throw error;
    }
  }
}

// Example usage of the DigitalBank class
const bank = new DigitalBank();

// Create a new user
bank.createUser({ name: 'John Doe', email: 'john@example.com', password: 'password123' })
  .then(() => console.log('User created successfully.'))
  .catch((error) => console.error('Failed to create user:', error));

// Create a new account for the user
bank.createAccount({ ownerEmail: 'john@example.com', accountNumber: '1234567890', balance: 1000 })
  .then(() => console.log('Account created successfully.'))
  .catch((error) => console.error('Failed to create account:', error));

// Deposit money into the account
bank.deposit({ accountNumber: '1234567890', amount: 500 })
  .then(() => console.log('Money deposited successfully.'))
  .catch((error) => console.error('Failed to deposit money:', error));

// Withdraw money from the account
bank.withdraw({ accountNumber: '1234567890', amount: 200 })
  .then(() => console.log('Money withdrawn successfully.'))
  .catch((error) => console.error('Failed to withdraw money:', error));