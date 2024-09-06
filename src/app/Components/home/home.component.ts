import { Component } from '@angular/core';
import { SharedMaterialModule } from '../../../Shared/modules/shared.material.module';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SharedMaterialModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
