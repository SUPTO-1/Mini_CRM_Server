import { Request, Response } from "express";
import { PrismaClient } from "./generated/prisma";
const prisma = new PrismaClient();
export const addReminder = async (req: Request, res: Response) => {
  const { title, dueDate, notes, clientId, projectId } = req.body;
  const userId = (req as any).user.id;
  try {
    if (!title || !dueDate) {
      return res.status(400).json({ error: "Title and due date are required" });
    }

    const reminder = await prisma.reminder.create({
      data: {
        title,
        dueDate: new Date(dueDate),
        notes: notes || "",
        userId,
        clientId: clientId ? Number(clientId) : null,
        projectId: projectId ? Number(projectId) : null,
      },
      include: {
        client: true,
        project: true,
      },
    });
    res.json(reminder);
  } catch (error) {
    console.error("Reminder creation error:", error);
    res.status(500).json({
      error: "Failed to create reminder",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getWeeklyReminders = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const start = new Date();
    start.setHours(0, 0, 0, 0); // Start of today
    const end = new Date();
    end.setDate(end.getDate() + 7);
    end.setHours(23, 59, 59, 999); // End of 7th day
  
    try {
      const reminders = await prisma.reminder.findMany({
        where: {
          userId,
          dueDate: {
            gte: start,
            lte: end
          },
          status: "PENDING"
        },
        include: {
          client: true,
          project: true
        },
        orderBy: { dueDate: 'asc' }
      });
      res.json(reminders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reminders" });
    }
  };