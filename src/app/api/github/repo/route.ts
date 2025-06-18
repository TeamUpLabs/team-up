import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  const repo = req.nextUrl.searchParams.get('repo');

  if (!token || !repo) {
    return NextResponse.json({ error: 'Missing GitHub token or repo' }, { status: 401 });
  }

  const owner = 'TeamUpLabs';

  const url = `https://api.github.com/repos/${owner}/${repo}`
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