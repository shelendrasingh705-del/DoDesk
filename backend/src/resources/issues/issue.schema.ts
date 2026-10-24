import { z } from 'zod';

const issueStateSchema = z.enum(['backlog', 'todo', 'in_progress', 'done', 'canceled']);
const issuePrioritySchema = z.number().int().min(0).max(4);

export const createIssueSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    state: issueStateSchema.optional(),
    priority: issuePrioritySchema.optional(),
    labels: z.array(z.string()).optional(),
    dueDate: z.string().optional(),
    assigneeId: z.string().optional(),
  }),
  params: z.object({
    teamId: z.string().min(1),
  }),
});

export const updateIssueSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    state: issueStateSchema.optional(),
    priority: issuePrioritySchema.optional(),
    labels: z.array(z.string()).optional(),
    dueDate: z.string().optional(),
    assigneeId: z.string().nullable().optional(),
    notes: z.string().optional(),
  }).refine(
    (data) => Object.values(data).some((v) => v !== undefined),
    { message: 'No valid fields to update' },
  ),
  params: z.object({
    issueId: z.string().min(1),
  }),
});

export const listIssuesQuerySchema = z.object({
  query: z.object({
    state: z.string().optional(),
    assignee: z.string().optional(),
    priority: z.string().optional(),
    search: z.string().optional(),
  }),
});
