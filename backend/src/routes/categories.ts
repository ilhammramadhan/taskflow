import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

const router = Router();

const categorySchema = z.object({
  namaCategory: z.string().min(1, 'Nama kategori wajib diisi').max(100),
});

router.get('/', async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const categories = await prisma.category.findMany({
      where: { userId },
      orderBy: { id: 'asc' },
    });
    return res.json({ data: categories });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const data = categorySchema.parse(req.body);

    const category = await prisma.category.create({
      data: { namaCategory: data.namaCategory, userId },
    });

    return res.status(201).json({ data: category });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const id = Number(req.params.id);

    const category = await prisma.category.findFirst({ where: { id, userId } });
    if (!category) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan' });
    }

    const inUse = await prisma.task.count({ where: { categoryId: id } });
    if (inUse > 0) {
      return res.status(409).json({
        message: 'Kategori tidak dapat dihapus karena masih digunakan oleh task',
      });
    }

    await prisma.category.delete({ where: { id } });

    return res.json({ message: 'Kategori berhasil dihapus' });
  } catch (err) {
    next(err);
  }
});

export default router;
