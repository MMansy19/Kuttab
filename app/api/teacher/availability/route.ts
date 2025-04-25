import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  // Only allow teachers to set availability
  const { teacherId, dayOfWeek, startTime, endTime, maxNum } = await req.json();
  if (!teacherId || dayOfWeek === undefined || !startTime || !endTime) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const availability = await prisma.availability.create({
    data: { teacherId, dayOfWeek, startTime, endTime, maxNum: maxNum || 1 },
  });
  return NextResponse.json({ availability });
}
