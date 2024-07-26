import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  public items: any = [];
  public orders: any = [];
  public totalOrderPrice: number = 0;

  constructor(private http: HttpClient, private router: Router, private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.retrieveOrders();
    this.retrieveItems();
  }

  retrieveOrders() {
    this.http.get('http://localhost/ecomm_api/ecomm_api/shopfyAPI/api/orders').subscribe(
      (resp: any) => {
        console.log(resp);
        this.orders = resp.data.map((order: any) => ({
          ...order,
          selectedQuantity: order.item_quantity, // Initialize selectedQuantity with item_quantity
          total_price: order.item_price * order.item_quantity // Calculate initial total price
        }));
        this.calculateTotalOrderPrice(); // Calculate total order price after retrieving orders
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );
}



  retrieveItems() {
    this.http.get('http://localhost/ecomm_api/ecomm_api/shopfyAPI/api/items').subscribe(
      (resp: any) => {
        this.items = resp.data;
      },
      (error) => {
        console.error('Error fetching items:', error);
      }
    );
  }

  updateOrderTotalPrice(order: any) {
    order.total_price = order.selectedQuantity * order.item_price;
    this.calculateTotalOrderPrice();
  }

  calculateTotalOrderPrice() {
    this.totalOrderPrice = this.orders.reduce((sum: number, order: any) => sum + order.total_price, 0);
  }

  payout(order: any) {
    const data = { orderId: order.order_id };

    this.http.post('http://localhost/ecomm_api/ecomm_api/shopfyAPI/api/pay_order', data).subscribe(
      (response: any) => {
        console.log('Paid out:', response);
        this._snackBar.open('Wait for Order to Arrive :>', 'close', {
          duration: 3000
        });
        this.orders = this.orders.filter((o: any) => o.order_id !== order.order_id);
        this.calculateTotalOrderPrice();
      },
      (error) => {
        console.error('Error payout order:', error);
        alert('There was an error paying out the order.');
      }
    );
  }

  cancelAllOrder(order: any) {
    const data = { orderId: order.order_id };

    this.http.post('http://localhost/ecomm_api/ecomm_api/shopfyAPI/api/delete_order', data).subscribe(
      (response: any) => {
        console.log('Order cancelled successfully:', response);
        this._snackBar.open('Order has been Cancelled :>', 'close', {
          duration: 3000
        });
        this.orders = this.orders.filter((o: any) => o.order_id !== order.order_id);
        this.calculateTotalOrderPrice();
      },
      (error) => {
        console.error('Error cancelling order:', error);
        alert('There was an error cancelling the order.');
      }
    );
  }
}
