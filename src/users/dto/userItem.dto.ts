export class UserItemDto {
  id: number;
  name: string;
  email: string;
  phoneNumber: string; // Added phone number
  role: string; // Added role

  constructor(partial: Partial<UserItemDto>) {
    Object.assign(this, partial);
  }
}
