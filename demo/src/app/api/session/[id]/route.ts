import { NextRequest, NextResponse } from 'next/server'
import { sessions } from '@/lib/sessions'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  sessions.delete(id)
  return NextResponse.json({ ok: true })
}
