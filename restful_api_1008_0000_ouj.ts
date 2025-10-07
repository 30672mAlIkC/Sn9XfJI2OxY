// 代码生成时间: 2025-10-08 00:00:30
import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';
import { z } from 'zod';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Define the Express application
const app = express();
app.use(express.json());

// Define a schema for user input validation
const UserSchema = z.object({
  username: z.string().min(1).max(50),
  email: z.string().email(),
  password: z.string().min(6)
});

// Define error handling middleware
app.use((err: Error, req: Request, res: Response) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

// Define API endpoints
app.get('/users', async (req: Request, res: Response) => {
  // Retrieve all users from the database
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving users');
  }
});

app.post('/users', async (req: Request, res: Response) => {
  // Validate user input
  const { username, email, password } = req.body;
  const validate = UserSchema.parse({ username, email, password });
  
  // Create a new user
  try {
    const newUser = await prisma.user.create({
      data: {
        username: validate.username,
        email: validate.email,
        password: validate.password,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(400).send('Error creating user');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
