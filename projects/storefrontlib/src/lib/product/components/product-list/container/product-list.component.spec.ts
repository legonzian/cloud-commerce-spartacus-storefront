import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListComponent } from './product-list.component';
import { ProductFacetNavigationComponent } from '../product-facet-navigation/product-facet-navigation.component';
import { ProductGridItemComponent } from '../product-grid-item/product-grid-item.component';
import { AddToCartComponent } from '../../../../cart/components/add-to-cart/add-to-cart.component';
import { PictureComponent } from '../../../../ui/components/media/picture/picture.component';
import { RouterTestingModule } from '@angular/router/testing';

import {
  ProductViewComponent,
  ViewModes
} from '../product-view/product-view.component';
import {
  NgbCollapseModule,
  NgbPaginationModule,
  NgbRatingModule
} from '@ng-bootstrap/ng-bootstrap';
import { StarRatingComponent } from '../../../../ui';
import { FormsModule } from '@angular/forms';
import { PaginationAndSortingModule } from '../../../../ui/components/pagination-and-sorting/pagination-and-sorting.module';
import { PaginationComponent } from '../../../../ui/components/pagination-and-sorting/pagination/pagination.component';
import { SortingComponent } from '../../../../ui/components/pagination-and-sorting/sorting/sorting.component';
import { Component, Input } from '@angular/core';
import { ProductSearchService } from '@spartacus/core';

class MockProductSearchService {
  search() {}
}

@Component({
  template: '',
  selector: 'cx-product-list-item'
})
class MockProductListItemComponent {
  @Input()
  product;
}

describe('ProductListComponent in product-list', () => {
  let service: ProductSearchService;
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbPaginationModule,
        NgbCollapseModule,
        NgbRatingModule,
        PaginationAndSortingModule,
        FormsModule,
        RouterTestingModule
      ],
      providers: [
        {
          provide: ProductSearchService,
          useClass: MockProductSearchService
        }
      ],
      declarations: [
        ProductListComponent,
        ProductFacetNavigationComponent,
        ProductGridItemComponent,
        AddToCartComponent,
        PictureComponent,
        ProductViewComponent,
        StarRatingComponent,
        MockProductListItemComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    service = TestBed.get(ProductSearchService);
    spyOn(service, 'search').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnChanges and get search results with category code', () => {
    component.categoryCode = 'mockCategoryCode';
    component.ngOnInit();
    component.ngOnChanges();
    expect(service.search).toHaveBeenCalledWith(
      ':relevance:category:mockCategoryCode',
      { pageSize: 10 }
    );
  });

  it('should call ngOnChanges get search results with brand code', () => {
    component.brandCode = 'mockBrandCode';
    component.ngOnInit();
    component.ngOnChanges();
    expect(service.search).toHaveBeenCalledWith(
      ':relevance:brand:mockBrandCode',
      { pageSize: 10 }
    );
  });

  it('should call onFilter', () => {
    component.onFilter('mockQuery');
    expect(service.search).toHaveBeenCalledWith('mockQuery', {});
  });

  it('should change pages', done => {
    const pagination = new PaginationComponent();
    pagination.viewPageEvent.subscribe(event => {
      expect(event).toEqual(1);
      component.viewPage(event);
      expect(component.searchConfig.currentPage).toBe(event);
      done();
    });

    pagination.pageChange(2);
  });

  it('should change sortings', done => {
    const pagination = new SortingComponent();
    pagination.sortListEvent.subscribe(event => {
      expect(event).toEqual('sortCode');
      component.viewPage(event);
      expect(component.searchConfig.currentPage).toBe(event);
      done();
    });

    pagination.sortList('sortCode');
  });

  it('should change view mode to grid from default list', done => {
    const viewMode = new ProductViewComponent();
    viewMode.modeChange.subscribe(event => {
      expect(event).toEqual(ViewModes.Grid);
      done();
    });

    viewMode.changeMode();
  });
});
