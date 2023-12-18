import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonButton,
  IonSkeletonText,
  IonSearchbar,
  IonAvatar,
  IonIcon,
  IonProgressBar,
} from '@ionic/angular/standalone';
import { CountryService } from '../service/country.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CountryResponse } from '../typings/country';
import { addIcons } from 'ionicons';
import { chevronForwardOutline } from 'ionicons/icons';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonSkeletonText,
    IonSearchbar,
    IonAvatar,
    IonIcon,
    IonProgressBar,
    RouterModule,
    CommonModule,
    FormsModule,
  ],
})
export class HomePage implements OnInit {
  data: CountryResponse[] = [];
  isLoading: boolean = false;
  counterArray: number[] = Array.from({ length: 20 }, (_, index) => index + 1);
  filteredData: CountryResponse[] = [];
  constructor(private countryService: CountryService) {
    addIcons({ chevronForwardOutline });
  }
  ngOnInit() {
    this.countryService.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });
    this.countryService.getCountries().subscribe((response) => {
      this.data = response as CountryResponse[];
      this.data.sort((a: any, b: any) => {
        const nameA = a?.name?.common?.toUpperCase();
        const nameB = b?.name?.common?.toUpperCase();
        return nameA?.localeCompare(nameB);
      });
      this.filteredData = [...this.data];
    });
  }

  onSearchInput(event: any) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    if (query.trim() === '') {
      this.filteredData = [...this.data];
    } else {
      this.filteredData = this?.data?.filter((country) =>
        country?.name?.common?.toLowerCase()?.includes(query)
      );
    }
  }
}
