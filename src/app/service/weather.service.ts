import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { WeatherApiResponse } from '../typings/weather';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private API_KEY = '339D4AJW2DESQBW7S9FZTLHX2';
  private baseUrl = `https://weather.visualcrossing.com`;

  private loadingSubject = new Subject<boolean>();
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  private setLoading(loading: boolean) {
    this.loadingSubject.next(loading);
  }

  getWeatherInfo(latlng: string): Observable<WeatherApiResponse> {
    this.setLoading(true);

    const url = `${this.baseUrl}/VisualCrossingWebServices/rest/services/timeline/${latlng}?key=${this.API_KEY}&iconSet=icons2`;

    return this.http.get<WeatherApiResponse>(url).pipe(
      tap(() => this.setLoading(false)),
      finalize(() => this.setLoading(false))
    );
  }
}
