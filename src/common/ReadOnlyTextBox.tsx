'use client';

export default function ReadOnlyTextBox({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-row" style={{ gap: '20px' }}>
      <div
        style={{
          fontWeight: 600,
          fontSize: '1.25rem',
          lineHeight: '1.75rem',
          width: '120px',
        }}
      >
        {label}
      </div>
      <div
        className="grow"
        style={{
          backgroundColor: '#4b5563',
          borderRadius: '5px',
          paddingLeft: '5px',
        }}
      >
        {value}
      </div>
    </div>
  );
}
