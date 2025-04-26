import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const addClient = async (req: Request, res: Response) => {
  try {
    console.log("Received body:", req.body);
    const { name, email, phone, company, notes } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const cleanEmail = email.trim().toLowerCase();

    const existingClient = await prisma.client.findUnique({
      where: { email: cleanEmail },
    });

    if (existingClient) {
      return res.status(400).json({
        error: "Client with this email already exists",
      });
    }

    const newClient = await prisma.client.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        phone: phone.trim(),
        company: company?.trim() || null,
        notes: notes?.trim() || null,
      },
    });

    res.status(201).json(newClient);
  } catch (error) {
    console.error("Error adding client:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
