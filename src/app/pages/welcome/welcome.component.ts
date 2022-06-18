import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }

  validateForm!: FormGroup;

  submitForm(): void {
    if (this.validateForm.valid) {
      const val = this.validateForm.value;

      if (val.username && val.password) {
        this.authService.login(val.username, val.password)
          .subscribe(
            (res: any) => {
              if (res.roles.find((r: string) => r == "Cashier")) {
                this.authService.setSession(res.token, res.expiration, res.id, res.username);
                this.router.navigateByUrl('/workspace');
              } else {
                alert('This user does not have a Cashier role');
              }
            }
          );
      }
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
