import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
@Component({
  selector: 'app-users-c',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-c.component.html',
  styleUrl: './users-c.component.scss'
})
export class UsersCComponent {
  data: any;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.dataService.getData().subscribe(
      (response) => {
        this.data = response.data;
        console.log('Fetched data:', this.data); // Add this line
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }
}
