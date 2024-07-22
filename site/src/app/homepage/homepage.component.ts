import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  public items: any[] = [];
  public filteredItems: any[] = [];
  cart: any[] = [];
  showCart = false;
  showOrderSummary = false;
  orderSummary: any[] = [];
  selectedPriceRange = 'all';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.retrieveItems();
  }

  retrieveItems() {
    this.http.get('http://localhost/shopfyAPI/shopfyAPI/api/items').subscribe(
      (resp: any) => {
        console.log(resp);
        this.items = resp.data;
        console.log(this.items);
        this.filterItems();
      },
      (error) => {
        console.error('Error fetching items:', error);
      }
    );
  }

  toggleCart() {
    this.showCart = !this.showCart;
  }

  addToCart(item: any) {
    const existingItem = this.cart.find(cartItem => cartItem.item_name === item.item_name);
    if (!existingItem) {
      this.cart.push({ ...item, quantity: 1 });
      console.log(this.cart);
      Swal.fire('Success', 'Item added to cart', 'success');
    } else {
      console.log('Item already in cart:', item.item_name);
      Swal.fire('Info', 'This item is already in your cart.', 'info');
    }
  }

  removeFromCart(cartItem: any) {
    const index = this.cart.indexOf(cartItem);
    if (index > -1) {
      this.cart.splice(index, 1);
    }
    console.log(this.cart);
  }

  addToOrder() {
    this.orderSummary = this.cart.map(item => ({
      item_name: item.item_name,
      item_price: item.item_price,
      quantity: item.quantity,
      total_price: item.item_price * item.quantity
    }));
    this.showOrderSummary = true;
  }

  closeOrderSummary() {
    this.showOrderSummary = false;
  }

  getTotalAmount() {
    return this.orderSummary.reduce((total, item) => total + item.total_price, 0);
  }

  filterItems() {
    switch (this.selectedPriceRange) {
      case 'below500':
        this.filteredItems = this.items.filter(item => item.item_price < 500);
        break;
      case '500to1000':
        this.filteredItems = this.items.filter(item => item.item_price >= 500 && item.item_price <= 1000);
        break;
      case 'above1000':
        this.filteredItems = this.items.filter(item => item.item_price > 1000);
        break;
      default:
        this.filteredItems = this.items;
        break;
    }
  }

  cancelOrder() {
    this.orderSummary = [];
    this.showOrderSummary = false;
    Swal.fire('Cancelled', 'Order has been cancelled.', 'error');
  }

  payoutOrder() {
    const orderData = this.orderSummary.map(orderItem => ({
      item_id: this.items.find(item => item.item_name === orderItem.item_name)?.item_id,
      item_name: orderItem.item_name,
      item_price: orderItem.item_price,
      quantity: orderItem.quantity,
      total_price: orderItem.total_price,
    }));

    this.http.post('http://localhost/shoppingAPI/ShopShopApi/api/add_order', { orders: orderData }).subscribe(
      (response) => {
        console.log('Order submitted successfully:', response);
        Swal.fire('Success', 'Order submitted, wait for the order to arrive.', 'success');
        this.cart = [];
        this.orderSummary = [];
        this.showOrderSummary = false;
        this.filterItems();
      },
      (error) => {
        console.error('Error submitting order:', error);
        Swal.fire('Error', 'There was an error submitting your order.', 'error');
      }
    );
  }
}
