import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import 'rxjs/Rx';

import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { AuthService } from '../auth/auth.service';
import { makeDecorator } from '@angular/core/src/util/decorators';
import { read } from 'fs';

@Injectable()
export class DataStorageService {
  constructor(private http: HttpClient,
              private recipeService: RecipeService,
              private authService: AuthService) {
  }

  storeRecipes() {
    const token = this.authService.getToken();

    // return this.http.put('https://udemy-test-6546f.firebaseio.com/recipes.json', this.recipeService.getRecipes(), {
    //   observe: 'body',
    //   params: new HttpParams().set('auth', token)
    // });

    const req = new HttpRequest('PUT', 'https://udemy-test-6546f.firebaseio.com/recipes.json', this.recipeService.getRecipes(), { reportProgress: true })

    return this.http.request(req);
  }

  getRecipes() {
    const token = this.authService.getToken();

    this.http.get<Recipe[]>('https://udemy-test-6546f.firebaseio.com/recipes.json')
    // this.http.get('https://udemy-test-6546f.firebaseio.com/recipes.json?auth=' + token, {
    //   observe: 'response',
    //   responseType: 'text'
    // })
      .map(
        (recipes) => {
          // console.log(recipes);
          for (let recipe of recipes) {
            if (!recipe['ingredients']) {
              recipe['ingredients'] = [];
            }
          }
          return recipes;
        }
      )
      .subscribe(
        (recipes: Recipe[]) => {
          this.recipeService.setRecipes(recipes);
        }
      );
  }
}
