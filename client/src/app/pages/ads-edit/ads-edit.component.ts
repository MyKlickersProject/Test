import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdsService } from '../../services/ads.service';
import { Ad } from '../../models/ad.model';
import { MapPickerComponent } from '../map-picker/map-picker.component';
import { GeocodingService } from '../../services/geocoding.service';


@Component({
  selector: 'app-ads-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MapPickerComponent],
  templateUrl: './ads-edit.component.html',
  styleUrls: ['./ads-edit.component.scss']
})
export class AdsEditComponent implements OnInit {

  ad: Ad = {
    id: 0,
    title: '',
    description: '',
    price: 0
  };

  isEdit = false;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  showMap = false;
  locationName: string | null = null;


  constructor(
    private route: ActivatedRoute,
    private adsService: AdsService,
    private router: Router,
    private geocodingService: GeocodingService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.isEdit = true;
      this.adsService.getById(id).subscribe(ad => {
        this.ad = ad;

        if (ad.imagePath) {
          this.previewUrl = 'https://localhost:44316' + ad.imagePath;
        }

        if (ad.locationName) {
          this.locationName = ad.locationName;
        } else if (ad.latitude && ad.longitude) {
          this.fetchLocationName(ad.latitude, ad.longitude);
        }

      });
    }
  }

  private fetchLocationName(lat: number, lng: number) {
    this.geocodingService.reverseGeocode(lat, lng).subscribe({
      next: (res) => {
        this.locationName = res.display_name || null;
        if (this.locationName) {
          this.ad.locationName = this.locationName;
        }
      },
      error: (err) => {
        console.error('Reverse geocoding failed', err);
        this.locationName = null;
      }
    });
  }
  

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => (this.previewUrl = reader.result as string);
    reader.readAsDataURL(file);
  }

  openMap() {
    this.showMap = true;
  }

  onLocationSelected(coords: { lat: number; lng: number }) {
    this.ad.latitude = coords.lat;
    this.ad.longitude = coords.lng;
    this.showMap = false;

    this.fetchLocationName(coords.lat, coords.lng);
  }

  onMapCancel() {
    this.showMap = false;
  }

  save() {
    const formData = new FormData();

    formData.append("title", this.ad.title);
    formData.append("description", this.ad.description);
    formData.append("price", String(this.ad.price));
    formData.append("latitude", String(this.ad.latitude ?? 0));
    formData.append("longitude", String(this.ad.longitude ?? 0));

    if (this.selectedFile) {
      formData.append("imageFile", this.selectedFile);
    }
    else if (this.ad.imagePath) {
      formData.append("imagePath", this.ad.imagePath);
    }

    if (this.isEdit) {
      this.adsService.update(this.ad.id, formData)
        .subscribe(() => this.router.navigate(['/ads']));
    } else {
      this.adsService.create(formData)
        .subscribe(() => this.router.navigate(['/ads']));
    }
  }

  cancel() {
    this.router.navigate(['/ads']);
  }
}
