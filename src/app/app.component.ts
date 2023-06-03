import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
interface Calc {
  amount: FormControl;
  currency: FormControl;
  period: FormControl;
}
interface Currency {
  val: number;
  name: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'test-calc';
  calculatedValue = 0;
  formGroup: FormGroup<Calc> = new FormGroup({
    amount: new FormControl('$1,000', [
      Validators.required,
      this.minMaxValidation(),
      this.onlyDigits(),
    ]),
    currency: new FormControl('', [Validators.required]),
    period: new FormControl('', [Validators.required]),
  });
  currency: Currency[] = [
    { val: 12, name: 'TUSD (Test US Dollar)' },
    { val: 13, name: 'TEUR (Test Euro)' },
    { val: 20, name: 'TCNY (Test Chinese Yuan)' },
    { val: 33, name: 'TINR (Test Indian Rupee)' },
    { val: 21, name: 'TBRL (Test Brazilian Real)' },
    { val: 80, name: 'TIDR (Test Indonesian Rupiah)' },
  ];
  period = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  minMaxValidation() {
    return (control: AbstractControl): ValidationErrors | null => {
      const valNumber = control.value.replace(/[\$,]/g, '');
      if (Number(valNumber) < 1000) {
        return {
          custom: {
            value: control.value,
            message: `can't be smaller then 1000`,
          },
        };
      } else if (Number(valNumber) > 1000000) {
        return {
          custom: {
            value: control.value,
            message: `can't be bigger then 1000000`,
          },
        };
      } else {
        return null;
      }
    };
  }
  onlyDigits() {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern = /^[0-9.,\$]+$/;
      if (!pattern.test(control.value)) {
        return {
          custom: {
            value: control.value,
            message: `can be valid only numbers`,
          },
        };
      } else {
        return null;
      }
    };
  }

  testSearch(term: string, item: Currency) {
    console.log(item);
    console.log(term);
    return item.name.startsWith(term);
  }
  filterSelectOptions(select: NgSelectComponent, value: Event): void {
    const val = (value.target as HTMLInputElement)?.value;
    select.filter(val);
  }
  mathOpt(value: number) {
    const amount =
      Number(this.formGroup.value.amount.replace(/[,\$]/g, '')) + value;
    const val = amount.toString();
    const regexPattern = /\B(?=(\d{3})+(?!\d))/g;
    const formattedValue = val.replace(regexPattern, ',');
    this.formGroup.patchValue({
      amount: `$${formattedValue}`,
    });
    this.calculate();
  }
  calculate() {
    if (this.formGroup.valid) {
      this.calculatedValue =
        (Number(this.formGroup.value.amount.replace(/[,\$]/g, '')) / 100) *
        this.formGroup.value.currency *
        this.formGroup.value.period;
    }
  }
}
