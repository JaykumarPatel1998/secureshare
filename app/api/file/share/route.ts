import { connect } from "@/dbConfig/dbConfig";
import createPresignedUrlWithClient from "@/fileUtils/presignedUrl";
import FileModel from "@/models/file";
import UserModel from "@/models/user";
import createHttpError from "http-errors";
import { NextRequest, NextResponse } from "next/server";

interface ExtendedRequest extends NextRequest {
    id?: string;
}

connect()

export async function POST(req: ExtendedRequest) {
    try {
        const data = await req.json()
        console.log(data)
        const expiry = data['expiry']
        const username = data['username']
        const fileId = data['fileId']
        const file = await FileModel.findById(fileId).exec()
        const toUser = await UserModel.findOne({ username: username }).exec()

        if (file && toUser) {
            const presignedUrl = await createPresignedUrlWithClient(file.bucket, file.key!, parseInt(expiry as string) * 60)
            toUser.messageArray.push({
                message: presignedUrl,
                read: false,
                from: req.id
            })
            await toUser.save()
            return NextResponse.json({
                status: 200,
                sent: true
            })
        } else {
            return NextResponse.json({
                status: 400,
                message: 'File/user not found'
            })
        }

    } catch (error) {
        console.log(error);
    }
}