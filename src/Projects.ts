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

export const addProject = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) return res.status(401).json({ error: "Unauthorized" });
    const { title, budget, deadline, status, clientId } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: "Title is required" });
    if (isNaN(budget)) return res.status(400).json({ error: "Invalid budget" });
    if (!clientId || isNaN(clientId)) return res.status(400).json({ error: "Invalid client ID" });
    const client = await prisma.client.findUnique({
      where: { id: Number(clientId) },
    });
    
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }
    const validStatuses = ['PLANNING', 'IN_PROGRESS', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid project status" });
    }
    const project = await prisma.project.create({
      data: {
        title: title.trim(),
        budget: Number(budget),
        deadline: new Date(deadline),
        status,
        userId: req.user.id,
        clientId: Number(clientId),
      },
    });
    
    res.status(201).json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
};

export const getProjectsCount = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user?.id) return res.status(401).json({ error: "Unauthorized" });

    const count = await prisma.project.count({
      where: { userId: req.user.id },
    });
    res.json({ count });
  } catch (error) {
    console.error("Error getting project count:", error);
    res.status(500).json({ error: "Failed to get projects count" });
  }
};

export const listProjects = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user?.id) return res.status(401).json({ error: "Unauthorized" });

    const projects = await prisma.project.findMany({
      where: { userId: req.user.id },
      include: { client: true },
    });
    res.json(projects);
  } catch (error) {
    console.error("Error listing projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

export const deleteProject = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const projectId = parseInt(req.params.id);
    await prisma.project.delete({
      where: { id: projectId },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Failed to delete project" });
  }
};

export const updateProject = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const projectId = parseInt(req.params.id);
    const { title, budget, deadline, status } = req.body;
    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!existingProject || existingProject.userId !== req.user?.id) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Validate input
    if (!title?.trim()) return res.status(400).json({ error: "Title is required" });
    if (isNaN(budget)) return res.status(400).json({ error: "Invalid budget" });
    
    const validStatuses = ["PLANNING", "IN_PROGRESS", "COMPLETED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        title: title.trim(),
        budget: Number(budget),
        deadline: new Date(deadline),
        status,
      },
    });

    res.json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Failed to update project" });
  }
};