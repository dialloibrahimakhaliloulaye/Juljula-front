import { Component, OnInit } from '@angular/core';
import {CatalogueService} from "../catalogue.service";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {HttpEventType, HttpResponse} from "@angular/common/http";
import {AuthenticationService} from "../services/authentication.service";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
   products:any;
  public editPhoto: any ;
  public currentProducts: any;
  private selectedFiles: any;
  public progess: number=0;
  public currentFileUpload: any;
  public title:string='';
  public timestamp: number=0;

  constructor(
    public catService:CatalogueService,
    private route:ActivatedRoute,
    private router:Router,
    public authService:AuthenticationService) {}

  ngOnInit(): void {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd){
        let url=val.url;
        let p1=this.route.snapshot.params.p1;
        if (p1==1){
          this.title='Produits séléctionnés';
          this.getProducts('/products/search/selectedProducts');
        }else if (p1==2){
          let idCategorie=this.route.snapshot.params.p2;
          this.title='Produits de la catégorie '+idCategorie;
          this.getProducts('/categories/'+idCategorie+'/products');
        }else if (p1==3){
          this.title='Produits en Promotion';
          this.getProducts('/products/search/promoProducts');
        }else if (p1==4){
          this.title='Produits Disponibles';
          this.getProducts('/products/search/dispoProducts');
        }else if (p1==5){
          this.title='Produits Recherchés';
          this.getProducts('/products/search/dispoProducts');
        }

      }
    });
    let p1=this.route.snapshot.params.p1;
    if(p1==1){
      this.getProducts('products/search/selectedProducts');
    }

  }

  private getProducts(url:string) {
    this.catService.getResource(url)
      .subscribe(data=>{
        this.products=data;
      },err=>{
        console.log(err);
      })
  }

  onEditPhoto(p:any) {
    this.currentProducts=p;
    this.editPhoto=true;
  }

  onSelectedFile(event:any) {
    this.selectedFiles=event.target.files;
  }

  uploadPhoto() {
    this.progess=0;
    this.currentFileUpload=this.selectedFiles.item(0);
    this.catService.uploadPhotoProduct(this.currentFileUpload, this.currentProducts.id).subscribe(event=>{
      if(event.type===HttpEventType.UploadProgress){
        // @ts-ignore

        this.progess=Math.round(100 * event.loaded / event.total);
        console.log(this.progess);
      } else if (event instanceof HttpResponse) {
        this.timestamp=Date.now();
        //alert("Fichier bien chargé")
       }
      }, err=>{
        alert("problème de chargement");
    })
    this.selectedFiles=undefined;
  }

  getTS() {
    return this.timestamp;
  }

  onAddProductToCaddy(p: any) {
    
  }

  onProductDetails(p: any) {
    
  }
}
