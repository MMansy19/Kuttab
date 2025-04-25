import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { userId, teacherId, date, timeSlot } = await req.json();
  if (!userId || !teacherId || !date || !timeSlot) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const booking = await prisma.booking.create({
    data: {
      userId,
      teacherId,
      date: new Date(date),
      timeSlot,
      status: 'PENDING',
    },
  });
  return NextResponse.json({ booking });
}
