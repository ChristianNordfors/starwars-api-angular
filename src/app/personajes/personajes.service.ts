import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Personaje } from './personaje';

@Injectable({
  providedIn: 'root'
})
export class PersonajesService {

  private URL: string = 'http://localhost:8080/api/personajes';

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }


  getPersonaje(id): Observable<any> {

    return this.http.get<any>(`https://swapi.dev/api/people/${id}/`).pipe(
      catchError( e => {
        return throwError(e);
      })
    );
  }

  getPlaneta(planetaUrl): Observable<any>{
    return this.http.get<any>(planetaUrl);
  }

  crear(personaje: Personaje): Observable<Personaje> {
    return this.http.post<Personaje>(this.URL, personaje, {headers: this.httpHeaders});
  }

  listar(): Observable<any> {
    return this.http.get<any>(this.URL);
  }


}
