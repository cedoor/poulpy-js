import { Card } from '@/components/atoms/Card'
import { Chip } from '@/components/atoms/Chip'
import { Btn } from '@/components/atoms/Btn'
import { ByteViewer } from '@/components/atoms/ByteViewer'
import { StripePlaceholder } from '@/components/atoms/StripePlaceholder'
import { StepHeader } from '@/components/atoms/StepHeader'
import { formatBytes } from '@/lib/pack'
import type { Phase } from '@/lib/fhe-types'

interface Step1KeygenProps {
  skPreview: Uint8Array | null
  ekBytes: Uint8Array | null
  sessionId: string | null
  phase: Phase
  onGenerate: () => void
}

function KeyIcon({ color, outline }: { color: string; outline?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <circle
        cx="6"
        cy="9"
        r="3.5"
        fill={outline ? 'none' : color}
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M 9.5 9 L 16 9 M 14 9 L 14 12 M 12 9 L 12 11.5"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function Step1Keygen({ skPreview, ekBytes, sessionId, phase, onGenerate }: Step1KeygenProps) {
  const busy = phase !== 'idle'
  const done = !!ekBytes && !!sessionId

  return (
    <Card accent="var(--key)">
      <StepHeader
        n="1"
        title="Generate a key pair"
        subtitle="Client-side. Your secret key never leaves this browser."
        accent="var(--key)"
        done={done}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        {/* Secret key card */}
        <div
          style={{
            border: '1px solid var(--rule)',
            borderRadius: 10,
            padding: 12,
            background: skPreview ? 'var(--key-soft)' : 'var(--bg-tint)',
            opacity: skPreview ? 1 : 0.55,
            transition: 'all 0.4s ease',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 8,
              flexWrap: 'wrap',
            }}
          >
            <KeyIcon color="oklch(0.35 0.12 290)" />
            <span style={{ fontWeight: 500, fontSize: 13 }}>Secret key</span>
            <Chip tone="key" style={{ fontSize: 10 }}>sk</Chip>
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--ink-soft)', marginBottom: 8 }}>
            Stays on the client. Used only for decryption.
          </div>
          {skPreview ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <ByteViewer bytes={skPreview} accent="oklch(0.35 0.12 290)" />
              <div style={{ fontSize: 11, color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)' }}>
                seed preview · LWE n=630
              </div>
            </div>
          ) : (
            <StripePlaceholder label="sk — not yet generated" height={52} />
          )}
        </div>

        {/* Evaluation key card */}
        <div
          style={{
            border: '1px solid var(--rule)',
            borderRadius: 10,
            padding: 12,
            background: ekBytes ? 'var(--key-soft)' : 'var(--bg-tint)',
            opacity: ekBytes ? 1 : 0.55,
            transition: 'all 0.4s ease',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 8,
              flexWrap: 'wrap',
            }}
          >
            <KeyIcon color="oklch(0.35 0.12 290)" outline />
            <span style={{ fontWeight: 500, fontSize: 13 }}>Evaluation key</span>
            <Chip tone="key" style={{ fontSize: 10 }}>ek</Chip>
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--ink-soft)', marginBottom: 8 }}>
            Shipped to the server. Enables homomorphic ops, reveals nothing.
          </div>
          {ekBytes ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <ByteViewer bytes={ekBytes} accent="oklch(0.35 0.12 290)" />
              <div style={{ fontSize: 11, color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)' }}>
                {formatBytes(ekBytes.byteLength)} · bootstrapping key
              </div>
            </div>
          ) : (
            <StripePlaceholder label="ek — not yet generated" height={52} />
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Btn onClick={onGenerate} disabled={busy} primary tone="key">
          {phase === 'keygen' ? 'Generating…' : done ? 'Regenerate keys' : 'Generate keys'}
        </Btn>
        <span style={{ fontSize: 12, color: 'var(--ink-faint)' }}>
          CGGI over the torus · σ ≈ 2<sup>−15</sup> · plaintext space: 32 bits
        </span>
      </div>
    </Card>
  )
}
