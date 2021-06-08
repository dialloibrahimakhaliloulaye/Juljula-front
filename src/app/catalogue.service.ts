import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpEventType, HttpRequest} from "@angular/common/http";
import {File} from "@angular/compiler-cli/src/ngtsc/file_system/testing/src/mock_file_system";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CatalogueService {

  public host:string="http://localhost:8080"

  constructor(private http:HttpClient) { }

  public getResource(url:string){
    return this.http.get(this.host+url);
  }

  uploadPhotoProduct(file: File, idProducts:any):Observable<HttpEvent<{}>> {
    let formadata: FormData=new FormData();
    formadata.append('file', file as any);
    const req=new HttpRequest('POST', this.host+'/uploadPhoto'+idProducts, formadata, {
      reportProgress:true,
      responseType: 'text'
    });

    return this.http.request(req);
  }
}
