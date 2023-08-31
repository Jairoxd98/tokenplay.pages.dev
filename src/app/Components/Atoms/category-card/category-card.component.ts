import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Gender } from 'src/app/models/gender.model';

@Component({
  selector: 'app-category-card',
  templateUrl: './category-card.component.html',
  styleUrls: ['./category-card.component.scss'],
})
export class CategoryCardComponent  implements OnInit {

  @Input() index: number = 0;
  @Input() category: Gender = {
    id: 0,
    name: '',
    slug: '',
    games_count: 0,
    image_background: ''
  };

  bgColors = [
    'bg-red-500',
    'bg-rose-500',
    'bg-lime-500',
    'bg-yellow-500'
  ]

  constructor(private router: Router) { }

  ngOnInit() {}

  navegarACatlaogo(){
    this.router.navigate([`catalogo`]);
  }

}
