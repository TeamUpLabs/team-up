import { NextRequest, NextResponse } from 'next/server';
import { PrDataBase } from '@/types/github/PrData';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  const org = req.nextUrl.searchParams.get('org');
  const repo = req.nextUrl.searchParams.get('repo');

  if (!token || !org || !repo) {
    return NextResponse.json({ error: 'Missing GitHub token or org or repo' }, { status: 401 });
  }

  const url = `https://api.github.com/repos/${org}/${repo}/pulls?state=all&per_page=300`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
  };

  try {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      return NextResponse.json({ error: 'GitHub API error' }, { status: res.status });
    }

    const prs = await res.json();

    const enrichedPRs = await Promise.all(
      prs.map(async (pr: PrDataBase) => {
        const [commits, files, reviews, comments] = await Promise.all([
          fetch(pr.commits_url, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
          fetch(pr.url + '/files', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
          fetch(pr.url + '/reviews', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
          fetch(pr.comments_url, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
        ]);
  
        return {
          ...pr,
          commits,
          files,
          reviews,
          comments,
          commitCount: commits.length,
          fileCount: files.length,
        };
      })
    );
    return NextResponse.json({ prs: enrichedPRs });
  } catch (error) {
    return NextResponse.json({ error: `Failed to fetch prs: ${error}` }, { status: 500 });
  }
}