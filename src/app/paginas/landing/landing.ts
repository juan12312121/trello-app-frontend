import { Component } from '@angular/core';
import { Navbar }       from '../../componentes-lading/navbar/navbar';
import { Hero }         from '../../componentes-lading/hero/hero';
import { Features }     from '../../componentes-lading/features/features';
import { Demo }         from '../../componentes-lading/demo/demo';
import { HowItWorks }   from '../../componentes-lading/how-it-works/how-it-works';
import { Pricing }      from '../../componentes-lading/pricing/pricing';
import { Testimonials } from '../../componentes-lading/testimonials/testimonials';
import { CtaBanner }    from '../../componentes-lading/cta-banner/cta-banner';
import { AppFooter }    from '../../componentes-lading/footer/footer';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    Navbar,
    Hero,
    Features,
    Demo,
    HowItWorks,
    Pricing,
    Testimonials,
    CtaBanner,
    AppFooter,
  ],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {}
