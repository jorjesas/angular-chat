import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatThreadSearchComponent } from './chat-thread-search.component';

describe('ChatThreadSearchComponent', () => {
  let component: ChatThreadSearchComponent;
  let fixture: ComponentFixture<ChatThreadSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatThreadSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatThreadSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
