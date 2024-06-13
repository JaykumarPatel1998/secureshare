import { connect } from "@/dbConfig/dbConfig";
import { generateEmbeddingFromS3Doc } from "@/fileUtils/generateToken";
import createPresignedUrlWithClient from "@/fileUtils/presignedUrl";
import { uploadFileToS3 } from "@/fileUtils/upload";
import FileModel from "@/models/file";
import UserModel from "@/models/user";
import createHttpError from "http-errors";
import { NextRequest, NextResponse } from "next/server";
import { decodeJwt } from "@/lib/utils";

interface ExtendedRequest extends NextRequest {
    id?: string;
}

connect()

export async function GET(req: ExtendedRequest) {
    try {
        const decodedJwt =  await decodeJwt(req)
        const requestUserId = decodedJwt.sub

        const files = await FileModel.find({ userId: requestUserId! }).lean().exec();
        
        for (let i = 0; i < files.length; i++) {
            const temp = files[i].urlExpiryDate;
            if (temp && (temp < Date.now())) {

                const presignedUrl = await createPresignedUrlWithClient(files[i].bucket!, files[i].key!)

                //really nice decision by me 😄
                const date = new Date();
                const seconds = date.getSeconds()
                date.setSeconds(seconds + Number.parseInt(process.env.EXPIRY_PRESIGNED_URL_USER!))
                await FileModel.findByIdAndUpdate(files[i]._id, { urlExpiryDate: date, fileUrl: presignedUrl })
            }
        }
        const user = await UserModel.findById(requestUserId!);
        const messagesNotRead = user?.messageArray.filter((message: any) => message.read === false)

        return NextResponse.json({ userId: user?.username, files, messages: messagesNotRead })
    } catch (error) {
        console.log(error)
        throw createHttpError(500, 'Internal server error')
    }
}

export async function POST(req: ExtendedRequest) {
    try {
        const data = await req.formData()
        const decodedJwt =  await decodeJwt(req)
        const requestUserId = decodedJwt.sub
        const fileBody: File = data.get('file') as File

        const uploadedPayload = await uploadFileToS3(fileBody, fileBody.name, requestUserId!)

        if (uploadedPayload.key && uploadedPayload.uploaded) {

            const bucket = process.env.S3_BUCKET!
            const key = uploadedPayload.key
            console.log('file uploaded : ', uploadedPayload.uploaded)

            const presignedUrl = await createPresignedUrlWithClient(process.env.S3_BUCKET!, uploadedPayload.key!)
            const date = new Date();
            const seconds = date.getSeconds()
            date.setSeconds(seconds + Number.parseInt(process.env.EXPIRY_PRESIGNED_URL_USER!))

            const file = new FileModel({
                bucket: bucket,
                fileName: fileBody.name,
                key: key,
                size: fileBody.size,
                fileUrl: presignedUrl,
                userId: requestUserId,
                urlExpiryDate: date
            })

            await file.save()

            // lets implement embedding logic in file embeddings section separately
            // const filenameArray = fileBody.name.split('.')
            // if (filenameArray[filenameArray.length - 1] === "pdf") {
            //     const embedding = await generateEmbeddingFromS3Doc(presignedUrl);

            //     await new FileEmbedding({
            //         embedding: embedding,
            //         fileId: file._id,
            //         userId: requestUserId?.toString()
            //     }).save()
            //     console.log("file submitted")
            // } else {
            //     console.log('File Embedding failed but uploaded successfully')
            // }

            return NextResponse.json({
                bucket,
                key,
                presignedUrl
            })

        } else {
            throw createHttpError(400, 'File upload failed')
        }

    } catch (error) {
        console.log(error)
    }
}