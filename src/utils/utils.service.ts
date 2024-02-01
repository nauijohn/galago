import * as moment from 'moment';

import { Injectable } from '@nestjs/common';

const DATE_FORMAT = 'YYYY-MM-DD';
const YEARS = 'years';
const SPACE = ' ';

@Injectable()
export class UtilsService {
  pascalize(word: string) {
    if (!word) return word;
    return word
      .trim()
      .split(SPACE)
      .map((word) =>
        (word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()).trim(),
      )
      .join(SPACE);
  }

  determineAgeByBirthDate(birthDate: string) {
    return moment(moment().format(DATE_FORMAT)).diff(
      moment(moment(birthDate).format(DATE_FORMAT)),
      YEARS,
    );
  }

  calcAgeByBirthDate(birthDate: string) {
    const now = moment();
    const nowDay = +now.format('DD');
    const nowMonth = +now.format('MM');
    const nowYear = +now.format('YYYY');
    const birth = moment(birthDate);
    const birthDay = +birth.format('DD');
    const birthMonth = +birth.format('MM');
    const birthYear = +birth.format('YYYY');

    let age = nowYear - birthYear;
    if (nowMonth > birthMonth) age += (nowMonth - birthMonth) * (1 / 12);
    if (nowDay > birthDay) age += (nowDay - birthDay) * (1 / 30) * (1 / 12);

    return age;
  }

  determineNumberOfNights(checkInDate: string, checkOutDate: string) {
    const checkInDateTemp = moment(checkInDate);
    const checkOutDateTemp = moment(checkOutDate);
    return checkOutDateTemp.diff(checkInDateTemp, 'days');
  }

  isUndefinedOrNullOrEmptyString(input: string) {
    if (!input) return true;
    return false;
  }

  isNotUndefinedOrNullOrEmptyString(input: string) {
    if (!input) return false;
    return true;
  }

  timeForHumans(seconds: number) {
    const hours = seconds / 3600;
    const _hours = hours.toString().split('.');
    if (_hours.length == 1) return `${_hours[0]}h`;
    let minutes = _hours[1] !== undefined ? Number('.' + _hours[1]) : 0;
    minutes = minutes * 60;
    const roundedMinutes = Math.round(minutes);
    return `${_hours[0]}h ${roundedMinutes}min`;
  }
}
