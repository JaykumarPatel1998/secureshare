"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import React, { useState } from 'react';
import { useToast } from "../ui/use-toast"

interface File {
  _id: string;
  bucket: string;
  fileName: string;
  key: string;
  size: number;
  fileUrl: string;
  userId: string;
  urlExpiryDate: Date;
}

export function ShareFile({ file }: { file: File }) {
  const [username, setUsername] = useState("");
  const [expiry, setExpiry] = useState("");
  const [response, setResponse] = useState(null);
  const {toast} = useToast()

  const handlePostRequest = async () => {
    try {
      const res = await fetch('/api/file/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          expiry,
          username,
          fileId: file._id,
        }),
      });
      const data = await res.json();
      setResponse(data);

      if (data.status === 400){
        toast({
          variant: "destructive",
          title: "Share failed",
          description: data.message,
        })
      }
      if (data.status === 200) {
        toast({
          variant: "default",
          title: "Shared",
          description: "Your file is shared with the user",
        })
      }
      
      
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Share</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Share File</SheetTitle>
          <SheetDescription>
            <pre>
            File Name: {file.fileName}<br/>
            File Size: {file.size} bytes<br/>
            </pre>
            
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              with
            </Label>
            <Input id="username" value={username} placeholder="friend's username" onChange={e => setUsername(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="expiry" className="text-right">
              Expiry (in min)
            </Label>
            <Input id="expiry" value={expiry} placeholder="10" onChange={e => setExpiry(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" onClick={handlePostRequest}>Share</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
