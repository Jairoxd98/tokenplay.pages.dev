import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ListResponse } from '../models/api.model';
import { Game } from '../models/games.model';
import { Gender } from '../models/gender.model';

@Injectable({
  providedIn: 'root'
})
export class GamesService {

  private urlApi:string = 'https://api.rawg.io/api/';
  private apiKey = environment.apiKey;

  constructor(private http: HttpClient) { }

  getGenders(page: number = 1): Observable<ListResponse<Gender>>{
    const pageSize = 3;
    return this.http.get<ListResponse<Gender>>(`${this.urlApi}genres?key=${this.apiKey}&page=${page}&page_size=${pageSize}`);
  }

  getGames(page: number = 1, ordering: string = '-metacritic'): Observable<ListResponse<Game>>{
    const pageSize = 10;
    return this.http.get<ListResponse<Game>>(`${this.urlApi}games?key=${this.apiKey}&page=${page}&page_size=${pageSize}&ordering=${ordering}`);
  }


}
