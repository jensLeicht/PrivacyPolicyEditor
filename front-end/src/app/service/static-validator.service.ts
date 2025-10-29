import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StaticValidatorService {

  constructor() { }

  static stringNotEmpty(x: string): boolean {
    return (/\S/.test(x));
  }

  static validateEmail(email: string): boolean {
    const regularExpression = /(^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)|^$/;
    return this.stringNotEmpty(email) && regularExpression.test(String(email).toLowerCase());
  }

  static validatePhoneNumber(number: string): boolean {
    var regularExpression = /^[+]*[(]{0,1}[0-9]{1,5}[)]{0,1}[-\s\./0-9]{4,}$|^$/;
    return this.stringNotEmpty(number) && regularExpression.test(String(number).toLowerCase());
  }

  static validateURL(url: string): boolean {
    var empty = url === '';
    var regularExpression = /(http[s]{0,1}:\/\/){0,1}(www\.)?(([-a-zA-Z0-9@:%_\+~#=]{2,256}\.)+)[a-z]{2,}([:]{1}[0-9]{1,5}){0,1}((\/[-a-zA-Z0-9%_\+.~#?&=]*)*)$/gi;
    return regularExpression.test(String(url)) || empty;
  }

}