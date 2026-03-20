import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cta-banner',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cta-banner.html',
  styleUrl: './cta-banner.css',
})
export class CtaBanner {}
