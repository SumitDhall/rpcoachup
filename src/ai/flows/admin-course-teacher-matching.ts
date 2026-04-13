'use server';
/**
 * @fileOverview An AI agent for administrators to suggest optimal matches between students, teachers, and courses.
 *
 * - matchStudentsTeachersCourses - A function that handles the matching process.
 * - AdminCourseTeacherMatchingInput - The input type for the matchStudentsTeachersCourses function.
 * - AdminCourseTeacherMatchingOutput - The return type for the matchStudentsTeachersCourses function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StudentInfoSchema = z.object({
  studentId: z.string().describe('Unique identifier for the student.'),
  interests: z.array(z.string()).describe('List of topics or subjects the student is interested in.'),
});

const TeacherInfoSchema = z.object({
  teacherId: z.string().describe('Unique identifier for the teacher.'),
  teachingInterests: z.array(z.string()).describe('List of topics or subjects the teacher is interested in teaching.'),
  availability: z.string().describe('General availability of the teacher (e.g., "weekdays evenings", "flexible").'),
});

const CourseInfoSchema = z.object({
  courseId: z.string().describe('Unique identifier for the course.'),
  title: z.string().describe('Title of the course.'),
  description: z.string().describe('Detailed description of the course content and topics.'),
});

const AdminCourseTeacherMatchingInputSchema = z.object({
  students: z.array(StudentInfoSchema).describe('List of available students with their interests.'),
  teachers: z.array(TeacherInfoSchema).describe('List of available teachers with their teaching interests and availability.'),
  courses: z.array(CourseInfoSchema).describe('List of available courses with their descriptions.'),
});
export type AdminCourseTeacherMatchingInput = z.infer<typeof AdminCourseTeacherMatchingInputSchema>;

const MatchSuggestionSchema = z.object({
  studentId: z.string().describe('The ID of the student suggested for this match.'),
  teacherId: z.string().optional().describe('The ID of the teacher suggested for this match, if applicable.'),
  courseId: z.string().optional().describe('The ID of the course suggested for this match, if applicable.'),
  reason: z.string().describe('A brief explanation for why this match is suggested.'),
});

const AdminCourseTeacherMatchingOutputSchema = z.object({
  matches: z.array(MatchSuggestionSchema).describe('A list of suggested optimal matches between students, teachers, and courses.'),
});
export type AdminCourseTeacherMatchingOutput = z.infer<typeof AdminCourseTeacherMatchingOutputSchema>;

export async function matchStudentsTeachersCourses(
  input: AdminCourseTeacherMatchingInput
): Promise<AdminCourseTeacherMatchingOutput> {
  return adminCourseTeacherMatchingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adminCourseTeacherMatchingPrompt',
  input: { schema: AdminCourseTeacherMatchingInputSchema },
  output: { schema: AdminCourseTeacherMatchingOutputSchema },
  prompt: `You are an AI assistant specialized in education resource allocation.
Your task is to analyze student interests, teacher interests and availability, and course descriptions to suggest optimal matches.
Provide a list of suggested matches, including the student ID, and either a teacher ID or a course ID, along with a clear reason for each match.
Prioritize matches that align closely with interests and availability.

Students:
{{#each students}}- ID: {{{studentId}}}, Interests: {{#each interests}}{{{this}}}{{^last}}, {{/last}}{{/each}}
{{/each}}

Teachers:
{{#each teachers}}- ID: {{{teacherId}}}, Teaching Interests: {{#each teachingInterests}}{{{this}}}{{^last}}, {{/last}}{{/each}}, Availability: {{{availability}}}
{{/each}}

Courses:
{{#each courses}}- ID: {{{courseId}}}, Title: {{{title}}}, Description: {{{description}}}
{{/each}}

Suggest optimal matches based on the above information. Output your suggestions in JSON format.`,
});

const adminCourseTeacherMatchingFlow = ai.defineFlow(
  {
    name: 'adminCourseTeacherMatchingFlow',
    inputSchema: AdminCourseTeacherMatchingInputSchema,
    outputSchema: AdminCourseTeacherMatchingOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
