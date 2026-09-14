export class CreateMonitorDto {
  name!: string;
  url!: string;
  intervalSeconds?: number;
  timeoutMs?: number;
}
