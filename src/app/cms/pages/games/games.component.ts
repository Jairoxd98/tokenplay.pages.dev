import { Component, OnInit } from '@angular/core';
import { Game } from 'src/app/models/games.model';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
})
export class GamesComponent  implements OnInit {

  gamesInProperty: Game[] = [
    {
      id: 0,
      slug: '',
      name: 'Grand Theft Auto V',
      released: '',
      background_image: 'https://media.rawg.io/media/games/20a/20aa03a10cda45239fe22d035c0ebe64.jpg',
      rating: 0,
      added: 0
    },
    {
      id: 1,
      slug: '',
      name: 'he Witcher 3: Wild Hunt',
      released: '',
      background_image: 'https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg',
      rating: 0,
      added: 0
    },
]

  constructor() { }

  ngOnInit() {}

}
