import { AbstractControl, ValidatorFn } from '@angular/forms';

export function noFutureDateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (!control.value) {
            return null;
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(control.value);
        return selectedDate > today ? { futureDate: { value: control.value } } : null;
    };
}
