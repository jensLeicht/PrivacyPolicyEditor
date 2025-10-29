import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ObservedValueOf } from 'rxjs';
import { LayeredPrivacyPolicy } from '../model/lpl/layered-privacy-policy';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  herokuApiUrl = "http://localhost:5002";

  constructor(private httpClient: HttpClient) {
  }

  download(data: LayeredPrivacyPolicy): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.httpClient.post(this.herokuApiUrl + '/save', data, { headers, responseType: 'text'});
  }

  downloadAsJSON(data: LayeredPrivacyPolicy): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.httpClient.post(this.herokuApiUrl + '/saveJSON', data, { headers, responseType: 'text'});
  }

  downloadAsProlog(data: LayeredPrivacyPolicy): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.httpClient.post(this.herokuApiUrl + '/saveAsProlog', data, { headers, responseType: 'text'});
  }

  downloadAsText(data: LayeredPrivacyPolicy): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.httpClient.post(this.herokuApiUrl + '/saveAsText', data, { headers, responseType: 'text'});
  }

  downloadPrologResponse(data: LayeredPrivacyPolicy): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.httpClient.post(this.herokuApiUrl + '/gdprCompliance', data, { headers, responseType: 'text'});
  }

  upload(data: any): Observable<any> {
    return this.httpClient.post(this.herokuApiUrl + '/upload', data);
  }

  uploadDFD(data: any): Observable<any> {
    return this.httpClient.post(this.herokuApiUrl + '/uploadDFD', data);
  }

  getCountryList(): Observable<any> {
    return this.httpClient.get(this.herokuApiUrl + '/countryCode');
  }

  getLanguageList(): Observable<any> {
    return this.httpClient.get(this.herokuApiUrl + '/languageCode');
  }
}