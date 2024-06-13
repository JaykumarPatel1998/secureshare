import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import * as jwt from 'jose'
import { NextRequest } from "next/server"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function decodeJwt(request : NextRequest) : Promise<jwt.JWTPayload> {
  const token = request.cookies.get('token')?.value
  const decodedJwt = jwt.decodeJwt(token!)
  return decodedJwt
}
