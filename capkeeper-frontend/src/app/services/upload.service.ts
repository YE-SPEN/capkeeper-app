import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(
    private http: HttpClient
  ) { }

  uploadFile(event: any): string {
    const file: File = event.target.files[0];
  
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
  
      console.log('FormData contents:', formData.get('file')); 
  
      this.http.post('/api/upload', formData).subscribe({
        next: (response: any) => {
          console.log('File uploaded successfully:', response.fileUrl);
          return response.fileUrl;
        },
        error: (error) => {
          console.error('File upload failed:', error);
          return '0';
        },
        complete: () => {
          console.log('File upload process completed.');
        }
      });
    }
    return '0';
  } 
}
