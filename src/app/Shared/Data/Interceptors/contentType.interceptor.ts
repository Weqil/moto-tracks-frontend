import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpParams,
  HttpEvent,
  HttpHandlerFn
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { SportTypesService } from '../Services/sport-types.service';


export const contentTypeInterceptorFn: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const sportTypesService = inject(SportTypesService);
  const contentType = sportTypesService.getContentTypeInLocalStorage();

  if (!contentType || !contentType.id) {
    return next(req);
  }

  const contentTypeId = contentType.id;

  if (req.method === 'GET') {
    let updatedParams = req.params || new HttpParams();
    updatedParams = updatedParams.append('contentTypeIds[]', contentTypeId);
    const modifiedReq = req.clone({ params: updatedParams });
    return next(modifiedReq);
  }

  const bodyMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
  if (bodyMethods.includes(req.method)) {
    let updatedBody = req.body;

    if (!updatedBody) {
      // Если тело пустое — создаём объект с нужным полем
      updatedBody = { contentTypeIds: [contentTypeId] };
    } else if (updatedBody instanceof FormData) {
      // Если FormData — добавляем поле в неё
      updatedBody = updatedBody;
      updatedBody.append('contentTypeIds[]', contentTypeId);
    } else if (typeof updatedBody === 'object') {
      // Если объект — копируем и добавляем поле
      updatedBody = { ...updatedBody, contentTypeIds: [contentTypeId] };
    } else {
      // Если тело строка, Blob и т.п. — лучше не трогать
      // Можно либо оставить без изменений, либо логировать/кинуть ошибку
      return next(req);
    }

    const modifiedReq = req.clone({ body: updatedBody });
    return next(modifiedReq);
  }

  return next(req);
};
