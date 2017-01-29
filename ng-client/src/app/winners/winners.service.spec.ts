/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WinnersService } from './winners.service';

describe('WinnersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WinnersService
      ]
    });
  });

  it('should ...', inject([WinnersService], (service: WinnersService) => {
    expect(service).toBeTruthy();
  }));
});
