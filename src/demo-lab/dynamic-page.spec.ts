import {TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {schema, required} from '@angular/forms/signals';
import {DynamicPage} from './dynamic-page';
import {GeneratedForm} from './generated-form';

describe('Reusable dynamic form',()=>{
 it('uses supplied defaults and renders select options, then submits the live model',async()=>{
  const fixture=TestBed.createComponent(DynamicPage);fixture.detectChanges();
  const renderer=fixture.debugElement.query(By.directive(GeneratedForm)).componentInstance as GeneratedForm;
  expect(renderer.model()['city']).toBe('Skopje');
  await renderer.actions.save(new Event('submit'),renderer.fields,renderer.model);fixture.detectChanges();
  expect(renderer.actions.saved()).toBeNull();
  expect(fixture.nativeElement.textContent).toContain('Choose a topic.');
  for(const [key,value] of [['name','Elena'],['email','elena@example.com'],['topic','speaking']]){
   const control=fixture.nativeElement.querySelector('#generated-'+key);control.value=value;control.dispatchEvent(new Event('input'));control.dispatchEvent(new Event('change'));
  }
  fixture.detectChanges();await renderer.actions.save(new Event('submit'),renderer.fields,renderer.model);
  expect(renderer.actions.saved()).toEqual({name:'Elena',email:'elena@example.com',city:'Skopje',topic:'speaking',notes:''});
 });
 it('honors an injected schema rather than silently replacing it with generated rules',()=>{
  const fixture=TestBed.createComponent(GeneratedForm);
  fixture.componentRef.setInput('definition',{fields:[{key:'code',label:'Code',kind:'text',required:true}]});
  fixture.componentRef.setInput('validationSchema',schema<Record<string,string>>(p=>required(p['code'],{message:'A custom schema message.'})));
  fixture.detectChanges();
  expect(fixture.componentInstance.fields['code']().errors()[0].message).toBe('A custom schema message.');
 });
});
