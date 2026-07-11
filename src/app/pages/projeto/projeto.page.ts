import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-projeto.page',
  imports: [],
  templateUrl: './projeto.page.html',
  styleUrl: './projeto.page.css',
})
export class ProjetoPage {                                                                                                                           
  constructor(private route: ActivatedRoute) {}                                                                             

  id: string | null = "";

  ngOnInit() {                                                                                                              
    this.id = this.route.snapshot.paramMap.get('id');                                                                      
  }
}
