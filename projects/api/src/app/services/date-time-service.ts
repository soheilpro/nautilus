import { IDateTimeService } from './idate-time-service';

export class DateTimeService implements IDateTimeService {
  nowUTC() {
    return new Date();
  }
}
