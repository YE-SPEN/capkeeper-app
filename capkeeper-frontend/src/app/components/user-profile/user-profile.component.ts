import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../services/global.service';
import { ToastService } from '../../services/toast-service.service';
import { getAuth, updateEmail } from 'firebase/auth';
import { User } from '../../types';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  user: User | null = null;
  formData = {
    old_user_name: null as string | null,
    user_name: null as string | null,
    first_name: null as string | null,
    last_name: null as string | null,
    email: null as string | null,
    picture: null as string | null,
    uid: null as string | null
  };

  constructor(
    public globalService: GlobalService,
    private router: Router,
    private toastService: ToastService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.user = this.globalService.loggedInUser;
    console.log(this.user)
  }

  editUserFormSubmit(): void {
    if (this.user) {
      const submissionData = {
        old_user_id: this.user.user_name,
        user_name: this.formData.user_name ? this.formData.user_name : this.user.user_name,
        first_name: this.formData.first_name ? this.formData.first_name : this.user.first_name,
        last_name: this.formData.last_name ? this.formData.last_name : this.user.last_name,
        email: this.formData.email ? this.formData.email : this.user.email,
        picture: this.formData.picture ? this.formData.picture : this.user.picture,
        uid: this.user.uid 
      };
      
      const auth = getAuth();
      const oldEmail = this.user.email;
      const newEmail = this.formData.email;
  
      // Check if the email has changed
      if (newEmail && newEmail !== oldEmail) {
        const userAuth = auth.currentUser;
        console.log('Trying to update email for: ', userAuth)
  
        if (userAuth) {
          updateEmail(userAuth, newEmail).then(() => {
            console.log('Email updated in Firebase Authentication.');
            this.sendUserInfoToServer(submissionData);
            
          }).catch((error) => {
            console.error('Error updating email in Firebase:', error);
          });
        }
      } else {
        this.sendUserInfoToServer(submissionData);
      }
    }
  }
  
  sendUserInfoToServer(submissionData: any) {
    this.http.post('api/edit-user-info', submissionData)
      .subscribe({
        next: (response) => {
          console.log('User Info Updated Successfully:', response);
          this.router.navigate(['/user/' + submissionData.user_name]);
          this.toastService.showToast('User Information Updated Successfully!', true);
        },
        error: (error) => {
          console.error('Error recording action:', error);
        }
      });
  }

  uploadFile(event: any): boolean {
    const file: File = event.target.files[0];
  
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
  
      console.log('FormData contents:', formData.get('file')); 
  
      this.http.post('/api/upload', formData).subscribe({
        next: (response: any) => {
          console.log('File uploaded successfully:', response.fileUrl);
          if (this.user) {
            this.user.picture = response.fileUrl;
          }
          return true;
        },
        error: (error) => {
          console.error('File upload failed:', error);
          return false;
        },
        complete: () => {
          console.log('File upload process completed.');
        }
      });
    }
    return false;
  } 

}
