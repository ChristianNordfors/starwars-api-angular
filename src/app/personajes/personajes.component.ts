import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Personaje } from './personaje';
import { PersonajesService } from './personajes.service';

@Component({
  selector: 'app-personajes',
  templateUrl: './personajes.component.html',
  styleUrls: ['./personajes.component.css']
})
export class PersonajesComponent implements OnInit {

  public personaje: Personaje = new Personaje();
  public personajeComparacion: Personaje = new Personaje();
  public personajes: Personaje[] = [];

  valor: number;

  loading: boolean = false;

  titulo = 'Realice una búsqueda';

  mensaje: string;
  error: string;

  constructor(private personajesService: PersonajesService,
              private router: Router) { }



  ngOnInit(): void {
    this.listarPersonajes();

  }

  buscarPersonaje(id): void {

    this.loading = true;
    this.mensaje = null;
    this.error = null;
    

    this.personajesService.getPersonaje(id).subscribe( pj =>{
      this.personaje.id = id;
      this.personaje.nombre = pj.name;
      this.personaje.altura = pj.height;
      this.personaje.peso = pj.mass!='unknown'&&pj.mass!='n/a'?pj.mass:'';
      this.personaje.pelo = pj.hair_color!='n/a'&&pj.hair_color!='none'?pj.hair_color:'';
      this.personaje.piel = pj.skin_color;
      this.personaje.ojos = pj.eye_color;
      this.personaje.fechaNacimiento = pj.birth_year!='unknown'?pj.birth_year:'';
      this.personaje.genero = pj.gender!='n/a'&&pj.gender!='unknown'?pj.gender:'';
      this.personajesService.getPlaneta(pj.homeworld).subscribe( (planeta) =>{
        this.personaje.planeta = planeta.name!='unknown'?planeta.name:'';
        this.personajeComparacion.planeta = planeta.name;
        // console.log(planeta)
      });

      this.titulo = pj.name;

      this.personajeComparacion.id = id;
      this.personajeComparacion.nombre = pj.name;
      this.personajeComparacion.altura = pj.height;
      this.personajeComparacion.peso = pj.mass;
      this.personajeComparacion.pelo = pj.hair_color;
      this.personajeComparacion.piel = pj.skin_color;
      this.personajeComparacion.ojos = pj.eye_color;
      this.personajeComparacion.fechaNacimiento = pj.birth_year;
      this.personajeComparacion.genero = pj.gender;


      this.loading = false;




    }, err => {
      if(err.status == 404){
        this.error = 'No existe un personaje con el Id indicado.';
        this.personaje = new Personaje();
        this.titulo = 'Realice una nueva búsqueda';
        this.loading = false;
        // console.log(err.error.message);
      }
    }
  )
  }


  public crearPersonaje(): void {

    this.personajes.forEach(p => {
      if(p.id === this.valor){
        this.error = 'Ya existe un personaje con ese ID.';
        this.personaje = new Personaje();
        throw new Error('Ya existe un personaje con ese ID.').message;
      }
    } )

        this.personajesService.crear(this.personaje).subscribe( pj =>{

          this.mensaje = `El personaje ${this.personaje.nombre} se ha creado con éxito.`;

          this.ngOnInit();
          // this.listarPersonajes();
          // this.router.navigateByUrl('/personajes');
          this.personaje = new Personaje();
          this.titulo = 'Realice una nueva búsqueda';
        });
        // console.log(this.personaje);


  }


  public listarPersonajes(): void{
    this.personajesService.listar().pipe().subscribe( personajes => {
        this.personajes = personajes.personajes;
    });
  }


}
