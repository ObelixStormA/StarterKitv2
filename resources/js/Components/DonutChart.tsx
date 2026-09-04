type Segment = {
    label: string;
    value: number;
    color: string;
};

export default function DonutChart({
    segments,
    centerLabel,
    centerValue,
}: {
    segments: Segment[];
    centerLabel: string;
    centerValue: string;
}) {
    const total = segments.reduce((sum, s) => sum + s.value, 0);
    const radius = 15.915;
    const circumference = 2 * Math.PI * radius;

    let cumulative = 0;

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-48 h-48">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r={radius} fill="none" stroke="var(--color-surface-100)" strokeWidth="4" />
                    {total > 0 &&
                        segments
                            .filter((s) => s.value > 0)
                            .map((segment) => {
                                const fraction = segment.value / total;
                                const dash = fraction * circumference;
                                const gap = circumference - dash;
                                const offset = -cumulative * circumference;
                                cumulative += fraction;

                                return (
                                    <circle
                                        key={segment.label}
                                        cx="18"
                                        cy="18"
                                        r={radius}
                                        fill="none"
                                        stroke={segment.color}
                                        strokeWidth="4"
                                        strokeDasharray={`${dash} ${gap}`}
                                        strokeDashoffset={offset}
                                        strokeLinecap="round"
                                    />
                                );
                            })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs text-secondary-500">{centerLabel}</span>
                    <span className="text-lg font-bold text-secondary-900">{centerValue}</span>
                </div>
            </div>

            <div className="w-full mt-4 space-y-2">
                {segments.map((segment) => (
                    <div key={segment.label} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: segment.color }} />
                            <span className="text-secondary-500">{segment.label}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
