import { IDateTimeService } from './idate-time-service';

export class DateTimeService implements IDateTimeService {
  nowUTC(): Date {
    return new Date();
  }
}
