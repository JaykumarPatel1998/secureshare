"use client"
import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DeleteIcon, Share2Icon, Trash2Icon } from 'lucide-react';
import { ShareFile } from '@/components/customui/ShareFile';
import UploadFile from '@/components/customui/UploadFile';

interface File {
  bucket: string;
  fileName: string;
  key: string;
  size: number;
  fileUrl: string;
  userId: string;
  urlExpiryDate: Date;
}

interface Message {
  message: string;
  read: boolean;
  from: string;
}

interface Data {
  files: File[];
  messages: Message[];
}

const FileList = () => {
  const [data, setData] = useState<Data>({ files: [], messages: [] });
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/file'); // Replace with your API route
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log(result)
        setData({ files: result.files, messages: result.messages });
        setUnreadCount(result.messages.filter((msg: Message) => !msg.read).length);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <h2>Unread Messages Count: {unreadCount}</h2>
      </div>
      <UploadFile />
      <div className='max-w-[350px] sm:max-w-[600px] md:max-w-[800px] overflow-auto'>
        <Table>
          <TableCaption>your files.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Download</TableHead>
              <TableHead>Share</TableHead>
              <TableHead>Delete</TableHead>
              <TableHead>Expiry Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.files.map((file) => (
              <TableRow key={file.key}>
                <TableCell>{file.fileName}</TableCell>

                <TableCell>{file.size} bytes</TableCell>

                <TableCell>
                  <Link href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                    <Button>
                      Download
                    </Button>
                  </Link>
                </TableCell>

                <TableCell>
                  <ShareFile />
                </TableCell>

                <TableCell>
                  <Link href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                    <Trash2Icon />
                  </Link>
                </TableCell>

                <TableCell>{file.urlExpiryDate.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>


    </div>
  );
};

export default FileList;
