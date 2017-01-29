/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PrizesService } from './prizes.service';

describe('PrizesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PrizesService
      ]
    });
  });

  it('should ...', inject([PrizesService], (service: PrizesService) => {
    expect(service).toBeTruthy();
  }));
});
