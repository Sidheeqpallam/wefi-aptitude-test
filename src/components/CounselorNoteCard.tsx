import { Clock, User } from 'lucide-react';

type NoteLike = {
  id: string;
  note: string;
  createdAt: string;
  counselorName?: string | null;
};

function defaultFormatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function CounselorNoteCard({
  note,
  formatDate = defaultFormatDate,
}: {
  note: NoteLike;
  formatDate?: (dateString: string) => string;
}) {
  return (
    <div className="note-card">
      <p style={{ color: '#1e293b', fontSize: '0.9rem', lineHeight: 1.55, margin: 0, whiteSpace: 'pre-line' }}>
        {note.note}
      </p>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.75rem',
          marginTop: '0.5rem',
          paddingTop: '0.4rem',
          borderTop: '1px solid #e7f0ff',
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.72rem',
            color: '#1158a8',
            fontWeight: 600,
          }}
        >
          <User className="w-3 h-3" />
          {note.counselorName || 'Counselor'}
        </span>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.72rem',
            color: '#94a3b8',
          }}
        >
          <Clock className="w-3 h-3" />
          {formatDate(note.createdAt)}
        </span>
      </div>
    </div>
  );
}