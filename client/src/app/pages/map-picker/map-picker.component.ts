import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';

import * as L from 'leaflet';

@Component({
  selector: 'app-map-picker',
  standalone: true,
  templateUrl: './map-picker.component.html',
  styleUrls: ['./map-picker.component.scss']
})
export class MapPickerComponent implements AfterViewInit {

  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  @Input() initialLat?: number;
  @Input() initialLng?: number;

  @Output() locationSelected = new EventEmitter<{ lat: number; lng: number }>();
  @Output() cancel = new EventEmitter<void>();

  private map!: L.Map;
  private marker?: L.Marker;

  ngAfterViewInit(): void {

    const lat = this.initialLat ?? 32.0853;
    const lng = this.initialLng ?? 34.7818;

    this.map = L.map(this.mapContainer.nativeElement).setView(
      [lat, lng],
      13
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    if (this.initialLat && this.initialLng) {
      this.marker = L.marker([this.initialLat, this.initialLng]).addTo(this.map);
    }

    this.map.on('click', (e: any) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      if (this.marker) this.marker.setLatLng([lat, lng]);
      else this.marker = L.marker([lat, lng]).addTo(this.map);

      this.locationSelected.emit({ lat, lng });
    });
  }

  onCancel() {
    this.cancel.emit();
  }
}
