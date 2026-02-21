import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { pizza } from '../../models/pizza_model';
import { MenuService } from '../../service/menuservice.service';

@Component({
  selector: 'app-menupage',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&display=swap" rel="stylesheet">
    
    <div class="text-center my-5">
      <h2 style="
          font-family: 'Playfair Display', serif; 
          font-weight: 700; 
          font-size: clamp(2rem, 5vw, 3rem); 
          color: #3A3535;
          letter-spacing: 1px;
          text-transform: uppercase;
      ">
        Our Menu
      </h2>
      <p style="
          font-family: 'Playfair Display', serif; 
          font-size: 1.2rem; 
          color: #495057;
          margin-top: 0.5rem;
      ">
        Discover our delicious pizzas, handcrafted with love and fresh ingredients
      </p>
    </div>

    <div *ngIf="pizzas().length === 0" class="text-center my-5 p-5 shadow-sm rounded-4 bg-light w-50 mx-auto">
      <p style="font-family: 'Playfair Display', serif; font-size: 1.5rem; color: #6c757d;">
        The menu is currently unavailable. Please check back later or explore our home page!
      </p>
      <button class="btn btn-outline-secondary mt-3" style="font-family: 'Playfair Display'" routerLink="/home">
        Go to Home
      </button>
    </div>

    <div class="row justify-content-around mt-5 mb-5 g-4 w-75 mx-auto">
      <div class="col-md-4" *ngFor="let p of pizzas()">
        <div class="card h-100 shadow-sm border-0 rounded-4" style="background-color:#f8f9fa;">
          
          <img [src]="p.image" class="card-img-top rounded-top-4" alt="{{p.name}}" style="height:200px; object-fit:cover;" [routerLink]="['/pizze', p.id]">
          
          <div class="card-body text-center">
            <h4 class="card-title fw-bold" style="font-family: 'Playfair Display', serif; color:#3A3535;" [routerLink]="['/pizze', p.id]">
              {{ p.name }}
            </h4>
            <p class="card-text" style="font-family: 'Playfair Display', serif; color:#495057;" [routerLink]="['/pizze', p.id]">
              {{ p.description }}
            </p>
            <p class="card-text fw-bold" style="font-family: 'Playfair Display', serif; color:#28a745;" [routerLink]="['/pizze', p.id]">
              €{{ p.price }}
            </p>

            <!-- Quantity Controls -->
            <div class="d-flex justify-content-center gap-4 align-items-center mt-2">
              <button class="btn btn-sm text-light" style="font-weight: bold; background-color: #dc3545;"
                      (click)="decreaseQuantity(p)">-</button>
              <span style="font-family: 'Playfair Display'">{{ getQuantity(p.id) }}</span>
              <button class="btn btn-sm text-light" style="font-weight: bold; background-color: #28a745;"
                      (click)="increaseQuantity(p)">+</button>
            </div>
            <button class="btn btn-sm btn-outline-danger mt-3" (click)="removePizza(p)" style="font-family: 'Playfair Display'">Remove Pizza</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class MenupageComponent {
pizzas = signal<pizza[]>([]);

  constructor(private menuService: MenuService) {
    this.loadPizzas();
  }

  loadPizzas() {
    this.menuService.getPizzas().subscribe((data: pizza[]) => {
      // 5. Aggiorna il signal usando .set()
      this.pizzas.set(data);
    });
  }

  getQuantity(id: number) {
    // Legge dal signal globale nel service
    const item = this.menuService.carrello().find(i => i.id === id);
    return item ? item.quantity : 0;
  }

  increaseQuantity(p: pizza) {
    this.menuService.addPizzaToCart(p);
  }

  decreaseQuantity(p: pizza) {
    this.menuService.removePizzaFromCart(p.id);
  }

  removePizza(p: pizza) {
    this.pizzas.update(items => items.filter(item => item.id !== p.id));
  }
}

