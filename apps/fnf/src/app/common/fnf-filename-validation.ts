import { AbstractControl, ValidationErrors } from "@angular/forms";

/**
 * Validation functions for file and folder names
 */
export class FnfFilenameValidation {
  
  /**
   * List of reserved Windows device names that cannot be used as file or folder names
   */
  private static readonly RESERVED_NAMES = [
    'CON', 'PRN', 'AUX', 'NUL',
    'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9',
    'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'
  ];

  /**
   * Validates that the filename is not one of the reserved Windows device names
   */
  static validateReservedNames(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    // Extract the base name without extension
    const value = control.value.toString();
    const baseName = value.split('.')[0].toUpperCase();
    
    if (FnfFilenameValidation.RESERVED_NAMES.includes(baseName)) {
      return { 'reserved_name': true };
    }
    
    return null;
  }

  /**
   * Validates that the filename doesn't start or end with space, period, hyphen, or underscore
   */
  static validateStartEndChars(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const value = control.value.toString();
    // const invalidStartEndChars = /^[\s._\-]|[\s._\-]$/;
    const invalidStartEndChars = /^[\s.\-]|[\s.\-]$/;

    if (invalidStartEndChars.test(value)) {
      return { 'invalid_start_end': true };
    }
    
    return null;
  }

  /**
   * Validates that the filename contains only valid characters
   * Allow letters, numbers, spaces, and common special characters like ._-()[]{}
   */
  static validateChars(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const validFilenameRegex = /^[a-zA-Z0-9\s._\-()[\]{}]+$/;
    if (!validFilenameRegex.test(control.value)) {
      return { 'invalid_chars': true };
    }
    
    return null;
  }

  /**
   * Validates that the filename is not '..'
   */
  static validateSpecialNames(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    if (control.value === '..') {
      return { 'invalid_name': true };
    }
    
    return null;
  }

  /**
   * Checks if the filename contains spaces or underscores (which are discouraged)
   */
  static checkSpacesUnderscores(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const value = control.value.toString();
    
    if (value.includes(' ') || value.includes('_')) {
      return { 'has_spaces_underscores': true };
    }
    
    return null;
  }

  /**
   * Gets a descriptive error message based on the validation errors
   */
  static getErrorMessage(errors: ValidationErrors | null, isFolder: boolean = false): string {
    if (!errors) return '';
    
    const itemType = isFolder ? 'Folder' : 'File';
    
    if (errors['required']) {
      return `${itemType} name is required`;
    }
    if (errors['minlength']) {
      return `${itemType} name must be at least 2 characters long`;
    }
    if (errors['maxlength']) {
      return `${itemType} name cannot exceed 255 characters`;
    }
    if (errors['is_same']) {
      return `The new ${itemType.toLowerCase()} name must be different`;
    }
    if (errors['invalid_chars']) {
      return `${itemType} name contains invalid characters. Use only letters, numbers, spaces, and ._-()[]{}`;
    }
    if (errors['invalid_name']) {
      return `${itemType} name contains an invalid name`;
    }
    if (errors['reserved_name']) {
      return `${itemType} name cannot be a reserved Windows device name (CON, PRN, AUX, NUL, COM1-9, LPT1-9)`;
    }
    if (errors['invalid_start_end']) {
      return `${itemType} name cannot start or end with a space, period, hyphen, or underscore`;
    }
    if (errors['has_spaces_underscores']) {
      return `${itemType} name contains spaces or underscores. Consider using hyphens instead.`;
    }
    
    return `Invalid ${itemType.toLowerCase()} name`;
  }
}