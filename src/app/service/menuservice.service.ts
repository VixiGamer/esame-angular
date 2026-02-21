import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { pizza } from '../models/pizza_model';
import { Observable } from 'rxjs';

interface CartItem {
  id: number;
  pizza: pizza;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  carrello = signal<CartItem[]>([]);

  constructor(private http: HttpClient) {}

  getPizzas(): Observable<pizza[]> {
    return this.http.get<pizza[]>(
      'https://my-json-server.typicode.com/zoelounge/menupizza/cards'
    );
  }

  addPizzaToCart(p: pizza) {
    this.carrello.update(items => {
      const existing = items.find(i => i.id === p.id);
      if (existing) {
        return items.map(item =>
          item.id === p.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...items, { id: p.id, pizza: p, quantity: 1 }];
    });
  }

  removePizzaFromCart(id: number): void {
    this.carrello.update(items => {
      const existing = items.find(i => i.id === id);
      if (!existing) return items;

      if (existing.quantity > 1) {
        return items.map(item =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return items.filter(item => item.id !== id);
    });
  }

  clearCart(): void {
    this.carrello.set([]);
  }
}