import createHttpError from "http-errors";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import RefreshToken from "@/models/refreshToken";
import jwt from 'jsonwebtoken';
import { connect } from "@/dbConfig/dbConfig";
import { cookies } from "next/headers";


connect()

export async function GET(req: NextRequest) {
    const requestToken = cookies().get('refreshToken')?.value;
    if (!requestToken) {
        redirect('/signin')
    }

    try {
        const refreshToken = await RefreshToken.findOne({ token: requestToken });

        if (!refreshToken) {
            return NextResponse.redirect(new URL('/signin', req.url))
        } else {
            if (refreshToken.verifyExpiration()) {
                RefreshToken.findByIdAndDelete(refreshToken._id, { useFindAndModify: false }).exec();

                return NextResponse.redirect(new URL('/signin', req.url))
            }

            const token = jwt.sign({ sub: refreshToken.user._id }, process.env.JWT_SECRET!, {
                expiresIn: parseInt(process.env.JWT_TOKEN_EXPIRY!),
            });

            cookies().set('token', token, {
                httpOnly:true,
                sameSite: 'lax'
            })
    
            cookies().set('refreshToken', refreshToken.token, {
                httpOnly:true,
                sameSite: 'lax'
            })

            
        }
    } catch (error) {
        console.log(error)
        throw createHttpError(500, "Internal Server Error")
    }

    redirect("/")
}
