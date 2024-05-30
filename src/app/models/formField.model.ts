export interface AuthFormValue {
  id: number;
  label: string;
  name: string;
}

export interface AuthFormField {
  id: number;
  isRequired: boolean;
  label: string;
  maxLength: number;
  minLength: number;
  name: string;
  type: string;
  value: string;
  values: AuthFormValue[];
}
