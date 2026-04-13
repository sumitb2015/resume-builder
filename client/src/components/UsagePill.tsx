import { usePlan } from '../contexts/PlanContext';
import type { QuotaFeatureKey } from '../shared/constants';

interface Props {
  feature: QuotaFeatureKey;
  style?: React.CSSProperties;
}

export default function UsagePill({ feature, style }: Props) {
  const { getRemainingUses, plan, dailyUsage } = usePlan();

  // Don't show for ultimate (unlimited) or when plan is unknown
  if (!plan || plan === 'ultimate') return null;

  const remaining = getRemainingUses(feature);
  if (remaining === null) return null; // unlimited

  // Calculate total limit to show X/Y
  const used = dailyUsage[feature] ?? 0;
  const total = remaining + used;

  // Color based on remaining as fraction of total — avoids permanent amber on low-limit plans
  const warnThreshold = Math.max(1, Math.ceil(total * 0.3));
  let color: string;
  let bg: string;
  if (remaining === 0) {
    color = '#ef4444';
    bg = 'rgba(239,68,68,0.12)';
  } else if (remaining <= warnThreshold && total > 1) {
    color = '#f59e0b';
    bg = 'rgba(245,158,11,0.12)';
  } else {
    color = '#22c55e';
    bg = 'rgba(34,197,94,0.10)';
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 8px',
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        background: bg,
        color,
        border: `1px solid ${color}30`,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {remaining}/{total} left today
    </span>
  );
}
