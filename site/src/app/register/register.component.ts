import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { ServiceService } from '../service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
email: string = '';
username: string = '';
password: string = '';
errorMessage: string = '';

constructor(private serviceService: ServiceService, private router: Router) {}

onSignup(): void {
  if (!this.email || !this.username || !this.password) {
    this.errorMessage = 'Please fill in all fields';
    return;
  }

  const data = {
    email: this.email,
    username: this.username,
    password: this.password
  };

  this.serviceService.userSignUp(data).subscribe(
    (response: any) => {
      console.log('Login Successful.', response);
      if (response.status === 'success') {
        this.router.navigate(['/login']);
      } else {
        Swal.fire('There is an error, try again!');
      }
    },
    (error: any) => {
      if (error.status === 401) {
        Swal.fire('Email or Password is Incorrect.');
      } else {
        Swal.fire('An unexpected error occurred. Please try again later.');
      }
    }
  );
}
}




