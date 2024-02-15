import { IsNotEmpty } from 'class-validator';

export class AddAdminDTO {
  readonly firstName?: string;

  @IsNotEmpty()
  readonly mobile: string;
}
