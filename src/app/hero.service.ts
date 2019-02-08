import { Injectable } from '@angular/core';
import { Observable, of }from 'rxjs';

import { Hero } from './hero';
import {  MessageService } from './message.service';
import { HEROES } from './test-heroes';

@Injectable({
  providedIn: 'root',
})
export class HeroService {

  constructor(private messageService: MessageService) { }
  
  getHeroes(): Observable<Hero[]> {
    this.messageService.add('HeroService: Heroes fetched.');
    return of(HEROES);
  }
}
