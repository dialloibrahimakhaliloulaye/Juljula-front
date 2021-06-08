import { Component, OnInit } from '@angular/core';
import {CatalogueService} from "../catalogue.service";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {HttpEventType, HttpResponse} from "@angular/common/http";

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
  private progess: any;
  private currentFileUpload: any;

  constructor(
    public catService:CatalogueService,
    private route:ActivatedRoute,
    private router:Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd){
        let url=val.url;
        let p1=this.route.snapshot.params.p1;
        if (p1==1){
          this.getProducts('/products/search/selectedProducts');
        }else if (p1==2){
          let idCategorie=this.route.snapshot.params.p2;
          this.getProducts('/categories/'+idCategorie+'/products');
        }
        console.log(url);
      }
    });

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
        this.progess.pourcentage=Math.round(100 * event.loaded / event.total);
      } else if (event instanceof HttpResponse) {
        alert("Fichier bien chargé")
       }
      }, err=>{
        alert("problème de chargement");
    })
    this.selectedFiles=undefined;
  }
}
