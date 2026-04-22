import { randomUUID } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { Evaluator } from 'poulpy-js/server'
import { sessions } from '@/lib/sessions'

const PARAMS_SET = process.env.POULPY_PARAMS_SET ?? 'test'

export async function POST(req: NextRequest) {
  const body = await req.arrayBuffer()
  if (!body.byteLength) {
    return NextResponse.json({ error: 'expected binary evaluation key body' }, { status: 400 })
  }
  let evaluator: Evaluator
  try {
    evaluator = Evaluator.load(Buffer.from(body), PARAMS_SET)
  } catch (err) {
    return NextResponse.json(
      { error: `invalid evaluation key: ${(err as Error).message}` },
      { status: 400 },
    )
  }
  const sessionId = randomUUID()
  sessions.set(sessionId, evaluator)
  return NextResponse.json({ sessionId })
}
