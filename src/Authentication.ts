import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "./generated/prisma";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

// Signup function
const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password, location } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        location,
        password: hashedPassword,
      },
    });

    return res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Login function
const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        userId: user.id
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h"
      }
    );

    const {password: _, ...userWithoutPassword} = user;
    return res.status(200).json(
      {
        message: "Login successful",
        user: userWithoutPassword,
        token
      }
    );
  } catch (error: any)
  {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { signup, login };
