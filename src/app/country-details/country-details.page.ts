import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CountryResponse } from '../typings/country';
import { CountryService } from '../service/country.service';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonSkeletonText,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WeatherApiResponse } from '../typings/weather';
import { WeatherService } from '../service/weather.service';
import { CurrencyService } from '../service/currency.service';
import { addIcons } from 'ionicons';
import {
  people,
  language,
  location,
  snow,
  thunderstorm,
  rainy,
  cloudy,
  sunny,
  moon,
  partlySunny,
  cloudyNight,
  thermometer,
  umbrella,
  leaf,
} from 'ionicons/icons';

@Component({
  selector: 'app-country-details',
  templateUrl: './country-details.page.html',
  styleUrls: ['./country-details.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    IonBackButton,
    IonButtons,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonItem,
    IonLabel,
    IonList,
    IonInput,
    IonSkeletonText,
    IonListHeader,
    IonSpinner,
    IonText,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class CountryDetailsPage implements OnInit {
  isLoading: boolean = false;
  isConverting: boolean = false;
  isWeatherLoading: boolean = false;
  conversionRate: number | undefined;
  countryDetails: CountryResponse | undefined;
  weatherInfo: WeatherApiResponse | undefined;
  conversionForm: FormGroup | any;
  isInverse: boolean = false;
  baseCurrencySymbol: string = 'EUR';
  currentCurrencySymbol: string = 'EUR';
  weatherIcons = {
    snow: 'snow',
    'snow-showers-day': 'snow',
    'snow-showers-night': 'snow',
    'thunder-rain': 'thunderstorm',
    'thunder-showers-day': 'thunderstorm',
    'thunder-showers-night': 'thunderstorm',
    rain: 'rainy',
    'showers-day': 'umbrella',
    'showers-night': 'umbrella',
    fog: 'cloudy',
    wind: 'leaf',
    cloudy: 'cloudy',
    'partly-cloudy-day': 'partly-sunny',
    'partly-cloudy-night': 'cloudy-night',
    'clear-day': 'sunny',
    'clear-night': 'moon',
  };

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private countryService: CountryService,
    private currencyService: CurrencyService,
    private weatherService: WeatherService
  ) {
    addIcons({
      people,
      language,
      location,
      snow,
      thunderstorm,
      rainy,
      cloudy,
      sunny,
      moon,
      partlySunny,
      cloudyNight,
      thermometer,
      umbrella,
      leaf,
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const countryCode = params.get('countryCode');
      this.loadCountryDetails(countryCode as string);
    });
    this.conversionForm = this.formBuilder.group({
      enteredAmount: ['', [Validators.required, Validators.min(0)]],
    });
  }

  loadCountryDetails(countryCode: string) {
    this.countryService.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });
    this.countryService.getCountryDetails(countryCode).subscribe((details) => {
      this.countryDetails = details;
      const latlng = details?.capitalInfo?.latlng?.join(',');
      this.currentCurrencySymbol = Object.keys(details?.currencies)[0];
      if (latlng) {
        this.loadWeatherDetails(latlng);
      }
    });
  }

  loadWeatherDetails(latlng: string) {
    this.weatherService.loading$.subscribe((loading) => {
      this.isWeatherLoading = loading;
    });
    if (latlng) {
      this.weatherService.getWeatherInfo(latlng).subscribe((details) => {
        this.weatherInfo = details;
      });
    }
  }

  getWeatherIcon(condition: any): string {
    // @ts-expect-error
    return (this.weatherIcons[condition] || 'cloud') as any;
  }

  convertToEUR() {
    this.currencyService.loading$.subscribe((loading) => {
      this.isConverting = loading;
    });
    if (this.currentCurrencySymbol) {
      try {
        this.currencyService
          .convertToEUR(this.currentCurrencySymbol)
          .subscribe((details) => {
            this.conversionRate = details?.conversion_rate;
            console.log('Converted EUR', details);
          });
      } catch (error) {
        console.error('Error converting to EUR:', error);
      }
    }
  }
}
