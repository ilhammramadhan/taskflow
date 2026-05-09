import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { signToken } from '../lib/jwt';

const router = Router();

const registerSchema = z.object({
  nama: z.string().min(1, 'Nama wajib diisi').max(100),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post('/register', async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return res.status(409).json({ message: 'Email sudah terdaftar' });
    }

    const hashed = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: { nama: data.nama, email: data.email, password: hashed },
      select: { id: true, nama: true, email: true },
    });

    return res.status(201).json({ message: 'Registrasi berhasil', user });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const token = signToken({ userId: user.id, email: user.email });

    return res.json({
      message: 'Login berhasil',
      token,
      user: { id: user.id, nama: user.nama, email: user.email },
    });
  } catch (err) {
    next(err);
  }
});

router.post('/logout', (_req, res) => {
  return res.json({ message: 'Logout berhasil' });
});

export default router;
