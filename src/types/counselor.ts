export interface Counselor {
  id: string;
  name: string;
  place?: string;
  mobile: string;
}

export interface Student {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  place?: string;
  aptitudeTest?: string | { aptitudeTest?: string; result?: string } | null;
  result?: string | null;
  notes: CounselorNote[];
}

export interface StudentDetails {
  [key: string]: unknown;
}

export interface AptitudeTest {
  aptitudeTest?: string;
  result?: string;
}

export interface CounselorNote {
  id: string;
  note: string;
  createdAt: string;
  counselorName?: string;
}

export interface NoteRequest {
  counselorId: string;
  participantId: string;
  note: string;
}