import { Component, OnInit, inject } from '@angular/core';
import { Navbar }       from '../../componentes-lading/navbar/navbar';
import { Hero }         from '../../componentes-lading/hero/hero';
import { Features }     from '../../componentes-lading/features/features';
import { Demo }         from '../../componentes-lading/demo/demo';
import { HowItWorks }   from '../../componentes-lading/how-it-works/how-it-works';
import { Pricing }      from '../../componentes-lading/pricing/pricing';
import { Testimonials } from '../../componentes-lading/testimonials/testimonials';
import { CtaBanner }    from '../../componentes-lading/cta-banner/cta-banner';
import { AppFooter }    from '../../componentes-lading/footer/footer';
import { Title, Meta }  from '@angular/platform-browser';

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
export class Landing implements OnInit {
  private titleService = inject(Title);
  private metaService = inject(Meta);

  ngOnInit() {
    this.titleService.setTitle('ProjecT - Software Moderno de Gestión de Proyectos Kanban');
    
    this.metaService.updateTag({ 
      name: 'description', 
      content: 'ProjecT es la herramienta definitiva para gestionar equipos y tareas de forma visual. Usa nuestros tableros integrados con tiempo real.' 
    });

    this.metaService.updateTag({ 
      name: 'keywords', 
      content: 'kanban, gestion de proyectos, trello clone, tableros colaborativos, productividad' 
    });
  }
}
