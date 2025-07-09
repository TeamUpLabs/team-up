import { NextRequest, NextResponse } from 'next/server'
import { CommitData } from '@/types/github/CommitData';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  const org = req.nextUrl.searchParams.get('org');
  const repo = req.nextUrl.searchParams.get('repo');

  if (!token || !org || !repo) {
    return NextResponse.json({ error: 'Missing GitHub token or org or repo' }, { status: 401 });
  }

  const url = `https://api.github.com/repos/${org}/${repo}/commits`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
  }

  try {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      return NextResponse.json({ error: 'GitHub API error' }, { status: res.status });
    }

    const commits = await res.json();

    const enrichedCommits = await Promise.all(
      commits.map(async (commit: CommitData) => {
        const [commitDetail] = await Promise.all([
          fetch(commit.url, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
        ]);

        return {
          ...commit,
          commitDetail,
        };
      })
    );
    return NextResponse.json({ commits: enrichedCommits });
  } catch (error) {
    return NextResponse.json({ error: `Failed to fetch commits: ${error}` }, { status: 500 });
  }
}