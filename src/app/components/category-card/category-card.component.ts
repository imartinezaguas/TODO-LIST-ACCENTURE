import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output,EventEmitter  } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-category-card',
  templateUrl: './category-card.component.html',
  imports: [IonicModule, CommonModule],
  styleUrls: ['./category-card.component.scss'],
})
export class CategoryCardComponent implements OnInit {

  constructor() {}

  ngOnInit() {}

  @Input() title!: string;
  @Input() tasks!: number; // total de tareas
  @Input() completed!: number; // tareas completadas
  @Input() color!: string;
  @Input() icon!: string;

   @Output() edit = new EventEmitter<void>();


  get progress(): number {
      return this.tasks > 0 ? this.completed / this.tasks : 0;
  }

    onEdit(event: Event) {
    event.stopPropagation(); // evita que abra la categoría
    this.edit.emit();
  }



}
