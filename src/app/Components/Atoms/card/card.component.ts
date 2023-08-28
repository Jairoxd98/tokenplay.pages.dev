import { Component, Input, OnInit } from '@angular/core';
import { Game } from 'src/app/models/games.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent  implements OnInit {
  
  @Input() game: Game = {
    id: 0,
    slug: '',
    name: '',
    released: '',
    background_image: '',
    rating: 0,
    added: 0
  };

  constructor() { }

  ngOnInit() {}

}
