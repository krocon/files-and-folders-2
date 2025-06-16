import {AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormGroup, ValidatorFn} from "@angular/forms";

export class FormGroupTyped<T> extends FormGroup {

  override value: T | undefined;

  constructor(
    controls: { [key in keyof T]: AbstractControl },
    validatorOrOpts?: ValidatorFn | Array<ValidatorFn> | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | Array<AsyncValidatorFn> | null
  ) {
    super(controls, validatorOrOpts, asyncValidator);
  }

  // @ts-ignore
  patchValue(
    value: Partial<T> | T,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
    }
  ): void {
    // @ts-ignore
    super.patchValue(value, options);
  }

  override get(path: Array<Extract<keyof T, string>> | Extract<keyof T, string>): AbstractControl | never {
    return super.get(path) as AbstractControl | never;
  }

  override getRawValue(): T {
    return super.getRawValue();
  }
}
