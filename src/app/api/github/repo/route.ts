import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  const org = req.nextUrl.searchParams.get('org');
  const repo = req.nextUrl.searchParams.get('repo');

  if (!token || !org || !repo) {
    return NextResponse.json({ error: 'Missing GitHub token or org or repo' }, { status: 401 });
  }

  const url = `https://api.github.com/repos/${org}/${repo}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
  }

  try {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      return NextResponse.json({ error: 'GitHub API error' }, { status: res.status });
    }

    const repo = await res.json();
    return NextResponse.json({ repo: repo });
  } catch (error) {
    return NextResponse.json({ error: `Failed to fetch repo: ${error}` }, { status: 500 });
  }
}