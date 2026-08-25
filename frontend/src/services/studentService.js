import { api, handleApiError } from "./api";

export async function getStudentDashboard() {
  const res = await api.get(`/api/student/dashboard`);
  return res;
}

export async function getCompleteStudentInfo() {
  const res = await api.get(`/api/student/profile`);
  return res;
}

export async function addCompleteStudentInfo(profileData) {
  const res = await api.patch(`/api/student/profile`, { profileData });
  return res;
}

export async function getMyMatches() {
  const res = await api.get(`/api/student/matched`);
  return res;
}

export async function getMyAiRecommededCourses() {
  const res = await api.get("/api/student/courses/ai-recommended");
  return res?.data;
}
