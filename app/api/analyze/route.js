import { NextResponse } from 'next/server';
import { describeGithubProject } from '../../../moulis-cursor.js';

// This API route expects a POST with { repoUrl: string }
export async function POST(req) {
  const { repoUrl } = await req.json();
  if (!repoUrl) {
    return NextResponse.json({ error: 'Missing repoUrl' }, { status: 400 });
  }
  try {
    const result = await describeGithubProject(repoUrl);
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}
