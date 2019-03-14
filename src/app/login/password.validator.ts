import { AbstractControl } from '@angular/forms';

export class PasswordValidation {

    static matchPassword(AC: AbstractControl): any {
       const password = AC.get('password').value; // to get value in input tag
       const confirmPassword = AC.get('confirmPassword').value; // to get value in input tag
        if (password !== confirmPassword) {
            AC.get('confirmPassword').setErrors( {mismatch: true} );
        } else {
            return null;
        }
    }
}
