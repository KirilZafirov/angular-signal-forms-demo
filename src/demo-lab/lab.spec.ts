import {TestBed} from '@angular/core/testing';
import {GeneratedForm} from './generated-form';
import {Builder} from './builder';
import {interpretDescription} from './description';
import {reactiveBooking, reactiveAttendee, setReactiveInvoice, removeReactiveAttendee} from './reactive-booking';

describe('Description-to-form demo',()=>{
 it('interprets supported fields and scopes optional to its phrase',()=>{
  const definition=interpretDescription('A signup with name, email, optional company, and optional notes.');
  expect(definition.fields.map(f=>[f.key,f.required])).toEqual([['name',true],['email',true],['company',false],['notes',false]]);
  expect(()=>interpretDescription('')).toThrow(); expect(()=>interpretDescription('An appointment date')).toThrow();
 });
 it('renders the definition and validates actual signal controls before local submit',async()=>{
  const fixture=TestBed.createComponent(GeneratedForm);
  fixture.componentRef.setInput('definition',interpretDescription('name, email, optional notes'));
  fixture.detectChanges(); const app=fixture.componentInstance;
  await app.actions.save(new Event('submit'), app.fields, app.model);fixture.detectChanges();
  expect(app.actions.saved()).toBeNull(); expect(fixture.nativeElement.textContent).toContain('Enter full name');
  for(const [key,value] of [['name','Elena'],['email','bad']]){
   const input=fixture.nativeElement.querySelector('#generated-'+key);input.value=value;input.dispatchEvent(new Event('input'));
  }
  fixture.detectChanges();expect(app.model()['name']).toBe('Elena');expect(app.fields().invalid()).toBe(true);
  app.fields['email']().value.set('elena@example.com');await app.actions.save(new Event('submit'), app.fields, app.model);fixture.detectChanges();
  expect(app.actions.saved()).toEqual({name:'Elena',email:'elena@example.com',notes:''});
 });
 it('replaces the form on regeneration and keeps a working preview on interpretation failure',()=>{
  const fixture=TestBed.createComponent(Builder);fixture.detectChanges();const app=fixture.componentInstance;
  app.actions.generate(app.description());fixture.detectChanges();const first=fixture.nativeElement.querySelector('#generated-name');
  first.value='Elena';first.dispatchEvent(new Event('input'));fixture.detectChanges();
  app.description.set('email, city');app.actions.generate(app.description());fixture.detectChanges();
  expect(fixture.nativeElement.querySelector('#generated-name')).toBeNull();
  expect(fixture.nativeElement.querySelector('#generated-city')).not.toBeNull();
  expect(fixture.nativeElement.querySelector('#generated-email').value).toBe('');
  app.description.set('');app.actions.generate(app.description());fixture.detectChanges();expect(app.actions.error()).toBeTruthy();
  expect(fixture.nativeElement.querySelector('#generated-city')).not.toBeNull();
 });
});
describe('Reactive Forms booking reference',()=>{
 it('keeps surviving controls and their state when removing a preceding row',()=>{
  const form=reactiveBooking();const second=reactiveAttendee('two');form.controls.attendees.push(second);
  second.controls.email.markAsTouched();second.controls.email.setErrors({duplicate:'Already reserved'});
  removeReactiveAttendee(form,'attendee-1');expect(form.controls.attendees.at(0)).toBe(second);
  expect(second.controls.email.touched).toBe(true);expect(second.controls.email.hasError('duplicate')).toBe(true);
  removeReactiveAttendee(form,'two');expect(form.controls.attendees.length).toBe(1);
 });
 it('retains the deep invoice draft while excluding inactive fields from group value',()=>{
  const form=reactiveBooking();const company=form.controls.billing.controls.company;
  setReactiveInvoice(form,true);expect(company.invalid).toBe(true);
  company.controls.address.controls.city.setValue('Skopje');setReactiveInvoice(form,false);
  expect(company.disabled).toBe(true);expect(form.getRawValue().billing.company.address.city).toBe('Skopje');
  expect(form.value.billing).not.toHaveProperty('company');setReactiveInvoice(form,true);expect(company.invalid).toBe(true);
 });
});
