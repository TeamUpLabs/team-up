import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  const org = req.nextUrl.searchParams.get('org');

  if (!token || !org) {
    return NextResponse.json({ error: 'Missing GitHub token or org' }, { status: 401 });
  }

  const url = `https://api.github.com/orgs/${org}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
  };

  try {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      return NextResponse.json({ error: 'GitHub API error' }, { status: res.status });
    }

    const orgData = await res.json();

    const [members, repos] = await Promise.all([
      fetch(orgData.url + '/members', { headers }).then(r => r.json()),
      fetch(orgData.repos_url, { headers }).then(r => r.json()),
    ])
    return NextResponse.json({ org: { ...orgData, members, repos } });
  } catch (error) {
    return NextResponse.json({ error: `Failed to fetch org: ${error}` }, { status: 500 });
  }
}