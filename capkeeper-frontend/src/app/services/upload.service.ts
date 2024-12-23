import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(
    private http: HttpClient
  ) { }

  uploadFile(event: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const file: File = event.target.files[0];
  
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
  
        this.http.post('/api/upload', formData).subscribe({
          next: (response: any) => {
            console.log('File uploaded successfully:', response.fileUrl);
            resolve(response.fileUrl); 
          },
          error: (error) => {
            console.error('File upload failed:', error);
            reject('0'); 
          }
        });
      } else {
        reject('0');
      }
    });
  }
  
}
