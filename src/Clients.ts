import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
  };
}

export const addClient = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) return res.status(401).json({ error: "Unauthorized" });

    const { name, email, phone, company, notes } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const cleanEmail = email.trim().toLowerCase();
    const existingClient = await prisma.client.findUnique({
      where: { email: cleanEmail },
    });

    if (existingClient) {
      return res.status(400).json({ error: "Client already exists" });
    }
    const newClient = await prisma.client.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        phone: phone.trim(),
        company: company?.trim(),
        notes: notes?.trim(),
        userId: req.user.id,
      },
    });

    res.status(201).json(newClient);
  } catch (error) {
    console.error("Error adding client:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getClients = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) return res.status(401).json({ error: "Unauthorized" });

    const clientCount = await prisma.client.count({
      where: { userId: req.user.id },
    });

    res.status(200).json({ count: clientCount });
  } catch (error) {
    console.error("Error getting clients:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const listClients = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) return res.status(401).json({ error: "Unauthorized" });

    const clients = await prisma.client.findMany({
      where: { userId: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        company: true,
        notes: true,
      }
    });
    
    res.status(200).json(clients);
  } catch (error) {
    console.error("Error listing clients:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteClient = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const clientId = parseInt(req.params.id);
    await prisma.client.delete({
      where: { id: clientId }
    });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting client:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateClient = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const clientId = parseInt(req.params.id);
    const { name, email, phone, company, notes } = req.body;
    const existingClient = await prisma.client.findUnique({
      where: { id: clientId }
    });

    if (!existingClient || existingClient.userId !== req.user?.id) {
      return res.status(404).json({ error: "Client not found" });
    }
    const updatedClient = await prisma.client.update({
      where: { id: clientId },
      data: {
        name: name?.trim() || existingClient.name,
        email: email?.trim().toLowerCase() || existingClient.email,
        phone: phone?.trim() || existingClient.phone,
        company: company?.trim() || existingClient.company,
        notes: notes?.trim() || existingClient.notes
      }
    });

    res.status(200).json(updatedClient);
  } catch (error) {
    console.error("Error updating client:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSingleClient = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const clientId = parseInt(req.params.id);
    
    if (!req.user?.id) return res.status(401).json({ error: "Unauthorized" });

    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        company: true,
        notes: true,
        userId: true
      }
    });

    if (!client || client.userId !== req.user.id) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.status(200).json(client);
  } catch (error) {
    console.error("Error fetching client:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};