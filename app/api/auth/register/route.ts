import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hash, compare } from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { name, email, password, role, bio, experience } = await req.json();
  if (!email || !password || !role) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'User already exists' }, { status: 409 });
  }
  const hashed = await hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name: name || '',
      email,
      password: hashed,
      role,
      ...(role === 'TEACHER' && {
        teacher: {
          create: {
            bio: bio || '',
            experience: experience || 0,
            isPaid: false,
          },
        },
      }),
    },
    include: { teacher: true },
  });
  // TODO: Issue JWT/session here
  return NextResponse.json({ user });
}
