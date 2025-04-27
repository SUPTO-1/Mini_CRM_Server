import { Request, Response } from "express";
import { PrismaClient } from "./generated/prisma";
const prisma = new PrismaClient();

export const addInteraction = async (req: Request, res: Response) => {
    const { date, type, notes, clientId, projectId } = req.body;
    const userId = (req as any).user.id;
  
    if (!clientId && !projectId) {
      return res.status(400).json({ error: "Must be linked to a client or project" });
    }
  
    try {
      const interaction = await prisma.interaction.create({
        data: {
          date: new Date(date),
          type,
          notes,
          userId,
          clientId: clientId ? Number(clientId) : null,
          projectId: projectId ? Number(projectId) : null
        },
        include: {
          client: true,
          project: true
        }
      });
      res.json(interaction);
    } catch (error) {
      console.error("Detailed error:", error);
      res.status(500).json({ error: "Failed to create interaction" });
    }
  };
export const getInteractions = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  try {
    const interactions = await prisma.interaction.findMany({
      where: { userId },
      include: {
        client: true,
        project: true
      },
      orderBy: { date: 'desc' }
    });
    res.json(interactions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch interactions" });
  }
};

export const deleteInteraction = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.interaction.delete({
      where: { id: Number(id) }
    });
    res.json({ message: "Interaction deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete interaction" });
  }
};

export const getInteractionsCount = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  try {
    const count = await prisma.interaction.count({
      where: { userId }
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: "Failed to count interactions" });
  }
};