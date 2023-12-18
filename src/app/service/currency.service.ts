import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ExchangeRateApiResponse } from '../typings/currency';

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private ACCESS_KEY = '94b87cf0587b0b70c258d6b6';
  private currencyBaseUrl = `https://v6.exchangerate-api.com/v6/${this.ACCESS_KEY}`;
  private loadingSubject = new Subject<boolean>();
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  private setLoading(loading: boolean) {
    this.loadingSubject.next(loading);
  }

  convertToEUR(baseCurrencyCode: string): Observable<ExchangeRateApiResponse> {
    this.setLoading(true);

    const url = `${this.currencyBaseUrl}/pair/${baseCurrencyCode}/EUR`;

    return this.http.get<ExchangeRateApiResponse>(url).pipe(
      tap(() => this.setLoading(false)),
      finalize(() => this.setLoading(false))
    );
  }
}
