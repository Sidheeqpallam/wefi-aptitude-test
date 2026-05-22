import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  headers: { 'Content-Type': 'application/json' },
});

export interface RegistrationCheck {
  id: string;
  name: string;
}

export interface RegistrationDetail {
  id: string;
  name: string;
  mobile: string;
  gender: string | null;
  email: string | null;
  place: string | null;
  entityId: string | null;
  memberId: string | null;
  dob: string | null;
  aptitudeTest: string | null;
  aptitudeResult: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AptitudeAnswer {
  question: string;
  answer: number;
  category: string;
}

export interface StudentSearchResult {
  id: string;
  name: string;
  mobile: string;
  email: string | null;
  gender: string | null;
  dob: string | null;
  place: string | null;
  entityId: string | null;
}

export interface ParticipantRegistrationPayload {
  name: string;
  mobile: string;
  email?: string;
  place?: string;
  entityId?: string;
  gender?: string;
  dob?: string;
  source?: string;
  sourceContext?: string;
}

export interface ParticipantRegistrationResponse {
  registrationId: string;
  hasAptitudeTest?: boolean;
  hasAptitudeResult?: boolean;
}

export async function registerParticipant(
  payload: ParticipantRegistrationPayload,
): Promise<ParticipantRegistrationResponse> {
  const { data } = await api.post('/career-aptitude', payload);
  return data.data as ParticipantRegistrationResponse;
}

export async function checkRegistration(
  mobile: string,
): Promise<RegistrationCheck> {
  const { data } = await api.get('/career-aptitude/check-by-phone', {
    params: { mobile },
  });
  return data.data as RegistrationCheck;
}

// ─── Get Full Registration ────────────────────────────────────────────────────
export async function getRegistration(id: string): Promise<RegistrationDetail> {
  const { data } = await api.get(`/career-aptitude/${id}`);
  return data.data as RegistrationDetail;
}

export async function submitAptitudeTest(
  participantId: string,
  aptitudeTest: AptitudeAnswer[],
): Promise<{ id: string }> {
  const { data } = await api.post('/career-aptitude/aptitude', {
    participantId,
    aptitudeTest,
  });
  return data.data as { id: string };
}

export async function saveTestResult(
  participantId: string,
  result: string,
): Promise<void> {
  await api.put(`/career-aptitude/aptitude/${participantId}/result`, { result });
}

export async function getAptitudeTestResult(
  participantId: string,
): Promise<{ result: string } | null> {
  try {
    const { data } = await api.get(`/career-aptitude/aptitude/${participantId}/result`);
    return data.data as { result: string };
  } catch {
    return null;
  }
}

export async function sendAptitudeReportToWhatsapp(
  participantId: string,
  file: Blob,
  filename: string,
): Promise<void> {
  const formData = new FormData();
  formData.append('file', file, filename);

  await api.post(`/career-aptitude/aptitude/${participantId}/send-whatsapp`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function counselorLogin(mobile: string): Promise<{ id: string; name: string }> {
  const { data } = await api.post('/educine/counselors/login', { mobile });
  return data.data as { id: string; name: string };
}

export async function getStudentByMobile(
  query: { id?: string; mobile?: string },
): Promise<RegistrationDetail & { aptitudeTest: unknown; result: string | null; notes: unknown[] }> {
  const params: Record<string, string> = {};
  if (query.id) params.id = query.id;
  if (query.mobile) params.mobile = query.mobile;
  const { data } = await api.get('/career-aptitude/counselors/participant', { params });
  return data.data;
}

export async function searchStudents(
  query: string,
): Promise<StudentSearchResult[]> {
  const { data } = await api.post('/career-aptitude/counselors/search', {
    query,
  });
  return data.data as StudentSearchResult[];
}

export async function saveNote(
  counselorId: string,
  participantId: string,
  note: string,
): Promise<void> {
  await api.post('/career-aptitude/counselors/notes', {
    counselorId,
    participantId,
    note,
  });
}

export interface CounselorNote {
  id: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  counselorName: string | null;
}

export async function getStudentNotes(participantId: string): Promise<CounselorNote[]> {
  const { data } = await api.get(`/career-aptitude/counselors/notes/${participantId}`);
  return data.data as CounselorNote[];
}

export async function findRegistrationByPhone(
  mobile: string,
): Promise<RegistrationCheck | null> {
  try {
    const { data } = await api.get('/career-aptitude/check-by-phone', { params: { mobile } });
    if (data?.data?.id) {
      return data.data as RegistrationCheck;
    }
  } catch {
    return null;
  }
  return null;
}
