import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit, OnDestroy {
  public items: any[] = [];
  public filteredItems: any[] = [];
  public selectedItem: any = null;
  selectedPriceRange = 'all';
  searchQuery: string = '';
  private autoScrollInterval: any;

  constructor(private http: HttpClient, private router: Router, private renderer: Renderer2) {}

  ngOnInit() {
    this.retrieveItems();
    this.initializeAdScroll();
  }

  ngOnDestroy() {
    this.stopAutoScroll();
  }

  retrieveItems() {
    this.http.get('http://localhost/ecomm_api/ecomm_api/shopfyAPI/api/items').subscribe(
      (resp: any) => {
        this.items = resp.data;
        this.filterItems();
      },
      (error) => {
        console.error('Error fetching items:', error);
      }
    );
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


  previewItem(item: any) {
    this.selectedItem = item;
  }

  closePreview() {
    this.selectedItem = null;
  }

  payoutOrder(item: any) {
    const orderItem = {
      item_id: item.item_id,
      item_name: item.item_name,
      item_price: item.item_price,
      quantity: item.item_quantity,
    };

    const orderData = {
      orders: [orderItem]
    };

    this.http.post('http://localhost/shopfyAPI/shopfyAPI/api/add_order', orderData).subscribe(
      (response) => {
        console.log('Order submitted successfully:', response);
        Swal.fire({
          icon: 'success',
          title: 'Added to cart successfully',
          text: 'Your order has been added to cart.',
          confirmButtonText: 'OK'
        });
      },
      (error) => {
        console.error('Error submitting order:', error);
        Swal.fire({
          icon: 'error',
          title: 'Order Submission Failed',
          text: 'There was an error submitting your order. Please try again later.',
          confirmButtonText: 'OK'
        });
      }
    );
  }

  private initializeAdScroll(): void {
    const adContainer = document.getElementById('adContainer');

    if (adContainer) {
      this.startAutoScroll(adContainer);

      this.renderer.listen(adContainer, 'mouseover', () => this.stopAutoScroll());
      this.renderer.listen(adContainer, 'mouseout', () => this.startAutoScroll(adContainer));
    }
  }

  private startAutoScroll(adContainer: HTMLElement): void {
    this.autoScrollInterval = setInterval(() => {
      adContainer.scrollBy({ left: adContainer.clientWidth, behavior: 'smooth' });
      if (adContainer.scrollLeft + adContainer.clientWidth >= adContainer.scrollWidth) {
        setTimeout(() => {
          adContainer.scrollTo({ left: 0, behavior: 'smooth' });
        }, 1000); // Wait for 1 second before resetting to the start
      }
    }, 3000); // Change interval time as needed
  }

  private stopAutoScroll(): void {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
    }
  }
}
