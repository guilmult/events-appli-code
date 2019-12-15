import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Evenement } from 'src/app/models/evenement';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styles: ['.form-container {display: flex; flex-direction: column;}']
})
export class EventFormComponent implements OnInit {

  constructor(private formBuilder: FormBuilder) {
   }

   startDate: Date = new Date();
  checkoutForm : FormGroup;

  @Input()
  event: Evenement;

  @Output() 
  submitForm = new EventEmitter<Evenement>();
  @Output() 
  cancelForm = new EventEmitter<any>();

  ngOnInit() {
    this.checkoutForm = this.formBuilder
    .group({
      titre:[this.event && this.event.titre ? this.event.titre : null, Validators.required], 
      description: this.event && this.event.description  ? this.event.description : '', 
      date:[ this.event && this.event.date ? this.event.date: '', Validators.required], 
      lienSiteWeb:[ this.event ? this.event.lienSiteWeb : '', Validators.pattern('(https?://){1}([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]
   })
  }

  get f() { return this.checkoutForm.controls; }

  submit(formValue) {
    
    if (this.checkoutForm.invalid) {
      return;
    }

    if (!(formValue.date instanceof Date)) {
      formValue.date = formValue.date.toDate();
    }

    this.submitForm.emit(
      {
        titre:formValue.titre,
        description:formValue.description, 
        date:formValue.date, 
        lienSiteWeb: formValue.lienSiteWeb
    });
    
   
  }

  cancel() {
    this.cancelForm.emit();
  }
}
