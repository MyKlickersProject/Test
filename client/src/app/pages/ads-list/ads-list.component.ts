import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdsService } from '../../services/ads.service';
import { Ad } from '../../models/ad.model';

@Component({
  selector: 'app-ads-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './ads-list.component.html',
  styleUrls: ['./ads-list.component.scss']
})
export class AdsListComponent implements OnInit {

  ads: Ad[] = [];
  filterText: string = "";
  showSearchPopup: boolean = false;

  filter: any = {
    TitleContains: "",
    DescriptionContains: "",
    ContactName: "",
    Category: "",
    MinPrice: null,
    MaxPrice: null,
    CreatedFrom: null,
    CreatedTo: null
  };

  constructor(private adsService: AdsService) {}

  ngOnInit(): void {
    this.loadAds();
  }

  loadAds() {
    this.adsService.getAll().subscribe(data => {
      this.ads = data.map((ad: Ad) => ({
        ...ad,
        imagePath: ad.imagePath
          ? 'https://localhost:44316' + ad.imagePath
          : undefined
      }));
      
      
    });
  }

  
  
  deleteAd(id: number) {
    this.adsService.delete(id).subscribe(() => {
      this.ads = this.ads.filter(a => a.id !== id);
    });
  }

  openSearchPopup() {
    this.showSearchPopup = true;
  }

  closeSearchPopup() {
    this.showSearchPopup = false;
  }

  runAdvancedSearch() {
    this.adsService.search(this.filter).subscribe(data => {
      this.ads = data.map((ad: Ad) => ({
        ...ad,
        imagePath: ad.imagePath
          ? 'https://localhost:44316' + ad.imagePath
          : undefined
      }));
      this.closeSearchPopup();
    });
  }

  searchSimple() {
    if (!this.filterText.trim()) {
      this.loadAds();
      return;
    }

    const filter = { titleContains: this.filterText };
    this.adsService.search(filter).subscribe(data => {
      this.ads = data.map((ad: Ad) => ({
        ...ad,
        imagePath: ad.imagePath
          ? 'https://localhost:44316' + ad.imagePath
          : undefined
      }));
    });
  }

  clearSearch() {
    this.filter = {
      TitleContains: "",
      DescriptionContains: "",
      ContactName: "",
      Category: "",
      MinPrice: null,
      MaxPrice: null,
      CreatedFrom: null,
      CreatedTo: null
    };
  
    this.loadAds();
  }
  
}
