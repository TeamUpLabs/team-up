import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    return NextResponse.json({ error: 'Missing GitHub token' }, { status: 401 })
  }

  const owner = 'TeamUpLabs'
  const repo = 'team-up'

  const url = `https://api.github.com/repos/${owner}/${repo}/commits`
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
  }

  try {
    const res = await fetch(url, { headers })
    if (!res.ok) {
      return NextResponse.json({ error: 'GitHub API error' }, { status: res.status })
    }

    const commits = await res.json()
    return NextResponse.json({ commits: commits })
  } catch (error) {
    return NextResponse.json({ error: `Failed to fetch commits: ${error}` }, { status: 500 })
  }
}