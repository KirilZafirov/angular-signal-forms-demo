import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
// Teaching reference for the same booking shape, independent of the live checkpoint.
// Request lifecycle, API calls and UI focus remain feature responsibilities.
const text=(value='',required=false)=>new FormControl(value,{nonNullable:true,validators:required?[Validators.required]:[]});
export function reactiveAttendee(id:string) {
  return new FormGroup({
    id:text(id), name:text('',true),
    email:new FormControl('',{nonNullable:true,validators:[Validators.required,Validators.email]}),
    preferences:new FormGroup({meal:text('standard'),accessibilityNotes:text()}),
  });
}
export function reactiveBooking() {
  const company=new FormGroup({name:text('',true),address:new FormGroup({
    street:text('',true),city:text('',true),postalCode:text('',true),country:text('',true),
  })});
  company.disable({emitEvent:false});
  return new FormGroup({
    organizer:new FormGroup({name:text('',true),email:new FormControl('',{nonNullable:true,validators:[Validators.required,Validators.email]})}),
    attendees:new FormArray([reactiveAttendee('attendee-1')],Validators.minLength(1)),
    billing:new FormGroup({companyInvoice:new FormControl(false,{nonNullable:true}),company}),
  });
}
export function setReactiveInvoice(booking:ReturnType<typeof reactiveBooking>,enabled:boolean) {
  booking.controls.billing.controls.companyInvoice.setValue(enabled);
  const company=booking.controls.billing.controls.company;
  enabled ? company.enable() : company.disable();
  // getRawValue() retains this draft; the shared payload policy still omits inactive invoice data.
}
export function removeReactiveAttendee(booking:ReturnType<typeof reactiveBooking>,id:string) {
  const attendees=booking.controls.attendees;
  const index=attendees.controls.findIndex(a=>a.controls.id.value===id);
  if (index>=0 && attendees.length>1) attendees.removeAt(index);
}
