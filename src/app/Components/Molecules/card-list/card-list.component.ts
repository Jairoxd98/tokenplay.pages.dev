import { Component, OnInit, Input } from '@angular/core';
import { Game } from 'src/app/models/games.model';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
})
export class CardListComponent  implements OnInit {

  @Input() games: Game[] = [];
  
  constructor() { }

  ngOnInit() {}

}
