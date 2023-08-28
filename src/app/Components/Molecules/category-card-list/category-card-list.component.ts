import { Component, Input, OnInit } from '@angular/core';
import { Gender } from 'src/app/models/gender.model';

@Component({
  selector: 'app-category-card-list',
  templateUrl: './category-card-list.component.html',
  styleUrls: ['./category-card-list.component.scss'],
})
export class CategoryCardListComponent  implements OnInit {

  @Input() categories: Gender[] = [];
  @Input() numberCategories: number = 0;

  constructor() { }

  ngOnInit() {}

}
