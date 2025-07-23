import { NextResponse } from 'next/server';
import { describeGithubProject } from '../../../moulis-cursor.js';

// This API route expects a POST with { repoUrl: string }
export async function POST(req) {
  console.log('POST /api/analyze called');
  const { repoUrl } = await req.json();
  console.log('Request body:', repoUrl);
  if (!repoUrl) {
    console.warn('Missing repoUrl in request');
    return NextResponse.json({ error: 'Missing repoUrl' }, { status: 400 });
  }
  try {
    const result = await describeGithubProject(repoUrl);
    console.log('describeGithubProject result:', result);
    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error in /api/analyze:', error);
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}
