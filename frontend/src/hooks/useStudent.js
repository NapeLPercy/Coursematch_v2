import { getMyAiRecommededCourses } from "../services/studentService";
import { useQuery } from "@tanstack/react-query";

export function useGetMyRecommendedCourses() {
  return useQuery({
    queryKey: ["my_ai_recommeded_courses"],
    queryFn: getMyAiRecommededCourses,
  });
}
