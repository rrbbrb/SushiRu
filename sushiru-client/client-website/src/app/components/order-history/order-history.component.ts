import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  expand: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  showOrderDetails() {
    this.expand = !this.expand;
  }

}
