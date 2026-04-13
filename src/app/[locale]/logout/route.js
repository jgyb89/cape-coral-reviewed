// src/app/logout/route.js
import { logoutUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request) {
  await logoutUser();
  
  const loginUrl = new URL('/login', request.url);
  
  return NextResponse.redirect(loginUrl);
}
