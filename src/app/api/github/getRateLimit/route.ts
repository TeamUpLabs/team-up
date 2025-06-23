import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ error: 'Missing GitHub token' }, { status: 401 });
  }

  const url = `https://api.github.com/rate_limit`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
  }

  try {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      return NextResponse.json({ error: 'GitHub API error' }, { status: res.status });
    }

    const rateLimit = await res.json();
    return NextResponse.json({ rateLimit });
  } catch (error) {
    return NextResponse.json({ error: `Failed to fetch rate limit: ${error}` }, { status: 500 });
  }
}