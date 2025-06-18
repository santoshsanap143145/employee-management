export interface Iemployee {
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  dob: string;
  gender: string;
  education: string;
  company: string;
  experience: number;
  id: string;
  isEditMode?: boolean;
}

export interface IempRef {
  [key: string]: Iemployee;
}
