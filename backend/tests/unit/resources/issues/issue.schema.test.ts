import { describe, it, expect } from 'vitest';
import {
  createIssueSchema,
  updateIssueSchema,
  listIssuesQuerySchema,
} from '@/resources/issues/issue.schema';

describe('createIssueSchema', () => {
  it('accepts valid create payload', () => {
    const result = createIssueSchema.safeParse({
      body: { title: 'Fix bug', priority: 2 },
      params: { teamId: 'team-1' },
    });

    expect(result.success).toBe(true);
  });

  it.each(['backlog', 'todo', 'in_progress', 'done', 'canceled'])('accepts state %s', (state) => {
    const result = createIssueSchema.safeParse({
      body: { title: 'Fix bug', state },
      params: { teamId: 'team-1' },
    });

    expect(result.success).toBe(true);
  });

  it.each(['invalid', 'in progress', ''])('rejects invalid state %s', (state) => {
    const result = createIssueSchema.safeParse({
      body: { title: 'Fix bug', state },
      params: { teamId: 'team-1' },
    });

    expect(result.success).toBe(false);
  });

  it.each([0, 1, 2, 3, 4])('accepts priority %i', (priority) => {
    const result = createIssueSchema.safeParse({
      body: { title: 'Fix bug', priority },
      params: { teamId: 'team-1' },
    });

    expect(result.success).toBe(true);
  });

  it.each([-1, 5, 1.5])('rejects invalid priority %s', (priority) => {
    const result = createIssueSchema.safeParse({
      body: { title: 'Fix bug', priority },
      params: { teamId: 'team-1' },
    });

    expect(result.success).toBe(false);
  });

  it('rejects empty title', () => {
    const result = createIssueSchema.safeParse({
      body: { title: '' },
      params: { teamId: 'team-1' },
    });

    expect(result.success).toBe(false);
  });

  it('rejects missing teamId', () => {
    const result = createIssueSchema.safeParse({
      body: { title: 'Fix bug' },
      params: { teamId: '' },
    });

    expect(result.success).toBe(false);
  });
});

describe('updateIssueSchema', () => {
  it('accepts partial update with at least one field', () => {
    const result = updateIssueSchema.safeParse({
      body: { title: 'Updated title' },
      params: { issueId: 'issue-1' },
    });

    expect(result.success).toBe(true);
  });

  it.each(['backlog', 'todo', 'in_progress', 'done', 'canceled'])('accepts state %s', (state) => {
    const result = updateIssueSchema.safeParse({
      body: { state },
      params: { issueId: 'issue-1' },
    });

    expect(result.success).toBe(true);
  });

  it.each(['invalid', 'in progress', ''])('rejects invalid state %s', (state) => {
    const result = updateIssueSchema.safeParse({
      body: { state },
      params: { issueId: 'issue-1' },
    });

    expect(result.success).toBe(false);
  });

  it.each([0, 1, 2, 3, 4])('accepts priority %i', (priority) => {
    const result = updateIssueSchema.safeParse({
      body: { priority },
      params: { issueId: 'issue-1' },
    });

    expect(result.success).toBe(true);
  });

  it.each([-1, 5, 1.5])('rejects invalid priority %s', (priority) => {
    const result = updateIssueSchema.safeParse({
      body: { priority },
      params: { issueId: 'issue-1' },
    });

    expect(result.success).toBe(false);
  });

  it('rejects empty body update', () => {
    const result = updateIssueSchema.safeParse({
      body: {},
      params: { issueId: 'issue-1' },
    });

    expect(result.success).toBe(false);
  });
});

describe('listIssuesQuerySchema', () => {
  it('accepts optional query filters', () => {
    const result = listIssuesQuerySchema.safeParse({
      query: { state: 'todo', search: 'bug' },
    });

    expect(result.success).toBe(true);
  });

  it('accepts empty query', () => {
    const result = listIssuesQuerySchema.safeParse({ query: {} });

    expect(result.success).toBe(true);
  });
});
