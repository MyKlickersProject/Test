import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ad } from '../models/ad.model';

@Injectable({
  providedIn: 'root'
})
export class AdsService {

  private apiUrl = 'https://localhost:44316/api/ads';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Ad[]> {
    return this.http.get<Ad[]>(this.apiUrl);
  }

  getById(id: number): Observable<Ad> {
    return this.http.get<Ad>(`${this.apiUrl}/${id}`);
  }

  create(ad: FormData): Observable<Ad> {
    return this.http.post<Ad>(this.apiUrl, ad);
  }

  update(id: number, ad: FormData): Observable<Ad> {
    return this.http.put<Ad>(`${this.apiUrl}/${id}`, ad);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  search(filter: any): Observable<Ad[]> {
    return this.http.post<Ad[]>(`${this.apiUrl}/search`, filter);
  }
}
