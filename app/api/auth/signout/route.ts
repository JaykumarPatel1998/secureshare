import createHttpError from 'http-errors';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
    const token = cookies().get('token')
    const refreshToken = cookies().get('refreshToken')

    try {
        if( refreshToken && token) {
            cookies().delete('token')
            cookies().delete('refreshToken')
        } else if(refreshToken) {
            cookies().delete('refreshToken')
        } else if(token) {
            cookies().delete('token')
        }
        return NextResponse.redirect(new URL('/signin', req.url))
    } catch (err) {
        return NextResponse.json({error: "Internal Server Error", statusCode: 500})
    }
}