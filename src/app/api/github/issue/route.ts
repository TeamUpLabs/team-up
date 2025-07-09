import { NextRequest, NextResponse } from 'next/server';
import { IssueData } from '@/types/github/IssueData';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  const org = req.nextUrl.searchParams.get('org');
  const repo = req.nextUrl.searchParams.get('repo');

  if (!token || !org || !repo) {
    return NextResponse.json({ error: 'Missing GitHub token or org or repo' }, { status: 401 });
  }

  const url = `https://api.github.com/repos/${org}/${repo}/issues?state=all`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
  }

  try {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      return NextResponse.json({ error: 'GitHub API error' }, { status: res.status });
    }

    const issues = await res.json() as IssueData[];
    const issuesOnly = issues.filter((item) => !item.pull_request);
    return NextResponse.json({ issues: issuesOnly });
  } catch (error) {
    return NextResponse.json({ error: `Failed to fetch issues: ${error}` }, { status: 500 });
  }
}