import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  const user = req.nextUrl.searchParams.get('user');

  if (!token || !user) {
    return NextResponse.json({ error: 'Missing GitHub token or user' }, { status: 401 });
  }

  const url = `https://api.github.com/user`
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
  }

  try {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      return NextResponse.json({ error: 'GitHub API error' }, { status: res.status });
    }

    const user = await res.json();
    return NextResponse.json({ user: user });
  } catch (error) {
    return NextResponse.json({ error: `Failed to fetch user: ${error}` }, { status: 500 });
  }
}