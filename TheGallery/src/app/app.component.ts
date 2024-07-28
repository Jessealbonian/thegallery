// app.component.ts
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
  standalone: true,
  imports: [RouterModule]
})
export class AppComponent  {
  constructor(private router: Router) {
    // Redirect to login if not logged in
    if (!this.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  private isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }
}
