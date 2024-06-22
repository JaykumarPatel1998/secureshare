"use client"
import React, { useState, useEffect } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface FileUploadError {
  message: string;
}

type UploadStatus = 'idle' | 'uploading' | 'success' | 'failed';

const UploadFile = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<UploadStatus>('idle');
  const [uploadError, setUploadError] = useState<FileUploadError | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(event.target.files){
        setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      setUploadError({ message: 'Please select a file to upload.' });
      return;
    }  

    setIsLoading('uploading');
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/file', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const data = await response.json();

      setUploadSuccess('File uploaded successfully!');
      console.log('Uploaded file details:', data);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError({ message: (error as Error).message });
    } finally {
      setIsLoading('idle');
    }
  };

  useEffect(() => {
    // Cleanup function to clear error messages on unmount
    return () => setUploadError(null);
  }, []);

  return (
    <form className="grid w-full max-w-sm items-center gap-1.5" onSubmit={handleSubmit}>
      <Label htmlFor="file">Upload a file</Label>
      <Input id='file' name='file' type="file" onChange={handleFileChange} />
      <Button type="submit" disabled={isLoading === 'uploading'}>
        {isLoading === 'uploading' ? 'Uploading...' : 'Upload File'}
      </Button>
      {uploadError && <p className="error">{uploadError.message}</p>}
      {uploadSuccess && <p className="success">{uploadSuccess}</p>}
    </form>
  );
};

export default UploadFile;
