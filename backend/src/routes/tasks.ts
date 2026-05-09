import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

const router = Router();

const taskSchema = z.object({
  judul: z.string().min(1, 'Judul wajib diisi').max(200),
  deskripsi: z.string().optional(),
  deadline: z.string().datetime().optional().nullable(),
  categoryId: z.number().int().positive().optional().nullable(),
});

// GET /tasks?categoryId=1&deadline=with|without|all
router.get('/', async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { categoryId, deadline } = req.query;

    const where: Record<string, unknown> = { userId };

    if (categoryId) {
      where.categoryId = Number(categoryId);
    }

    if (deadline === 'with') {
      where.deadline = { not: null };
    } else if (deadline === 'without') {
      where.deadline = null;
    }

    const tasks = await prisma.task.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ data: tasks });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const data = taskSchema.parse(req.body);

    const task = await prisma.task.create({
      data: {
        judul: data.judul,
        deskripsi: data.deskripsi,
        deadline: data.deadline ? new Date(data.deadline) : null,
        categoryId: data.categoryId ?? null,
        userId,
      },
      include: { category: true },
    });

    return res.status(201).json({ data: task });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const id = Number(req.params.id);

    const task = await prisma.task.findFirst({
      where: { id, userId },
      include: { category: true },
    });

    if (!task) {
      return res.status(404).json({ message: 'Task tidak ditemukan' });
    }

    return res.json({ data: task });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const id = Number(req.params.id);
    const data = taskSchema.parse(req.body);

    const existing = await prisma.task.findFirst({ where: { id, userId } });
    if (!existing) {
      return res.status(404).json({ message: 'Task tidak ditemukan' });
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        judul: data.judul,
        deskripsi: data.deskripsi,
        deadline: data.deadline ? new Date(data.deadline) : null,
        categoryId: data.categoryId ?? null,
      },
      include: { category: true },
    });

    return res.json({ data: task });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/toggle', async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const id = Number(req.params.id);

    const existing = await prisma.task.findFirst({ where: { id, userId } });
    if (!existing) {
      return res.status(404).json({ message: 'Task tidak ditemukan' });
    }

    const task = await prisma.task.update({
      where: { id },
      data: { status: existing.status === 'SELESAI' ? 'BELUM' : 'SELESAI' },
      include: { category: true },
    });

    return res.json({ data: task });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const id = Number(req.params.id);

    const existing = await prisma.task.findFirst({ where: { id, userId } });
    if (!existing) {
      return res.status(404).json({ message: 'Task tidak ditemukan' });
    }

    await prisma.task.delete({ where: { id } });

    return res.json({ message: 'Task berhasil dihapus' });
  } catch (err) {
    next(err);
  }
});

export default router;
