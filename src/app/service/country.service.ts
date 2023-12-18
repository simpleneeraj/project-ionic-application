import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { CountryResponse } from '../typings/country';

@Injectable({ providedIn: 'root' })
export class CountryService {
  private countryBaseUrl = 'https://restcountries.com/v3.1';
  private loadingSubject = new Subject<boolean>();
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  private setLoading(loading: boolean) {
    this.loadingSubject.next(loading);
  }

  getCountries(): Observable<CountryResponse[]> {
    this.setLoading(true);

    const url = `${this.countryBaseUrl}/all?fields=flags,name,ccn3`;

    return this.http.get<CountryResponse[]>(url).pipe(
      tap(() => this.setLoading(false)),
      finalize(() => this.setLoading(false))
    );
  }

  getCountryDetails(countryCode: string): Observable<CountryResponse> {
    this.setLoading(true);

    const url = `${this.countryBaseUrl}/alpha/${countryCode}?fields=flags,name,capital,languages,population,currencies,ccn3,capitalInfo,latlng`;

    return this.http.get<CountryResponse>(url).pipe(
      tap(() => this.setLoading(false)),
      finalize(() => this.setLoading(false))
    );
  }
}
