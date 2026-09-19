import {TestBed} from '@angular/core/testing';
import {TeamBookingForm} from './team-booking-form';
import {RegistrationApi} from './registration-api';
import {initialRegistration, newAttendee, toPayload} from './registration';

const validBooking = () => ({...initialRegistration(), organizer: {name: 'Kiril', email: 'kiril@example.com'}, attendees: [
  {...newAttendee('a'), name: 'Elena', email: 'elena@example.com'},
  {...newAttendee('b'), name: 'Marko', email: 'marko@example.com'},
]});
const event = () => new Event('submit', {cancelable: true});
describe('Team booking behavior', () => {
  async function setup() {
    await TestBed.configureTestingModule({imports: [TeamBookingForm]}).compileComponents();
    const fixture = TestBed.createComponent(TeamBookingForm); fixture.detectChanges();
    return {fixture, app: fixture.componentInstance, api: TestBed.inject(RegistrationApi)};
  }
  it('blocks invalid submit and focuses the nested organizer name', async () => {
    const {fixture,app,api}=await setup();
    const save=vi.spyOn(api,'save'); const focus=vi.spyOn(fixture.nativeElement.querySelector('#organizer-name'),'focus');
    await app.actions.save(event()); fixture.detectChanges();
    expect(save).not.toHaveBeenCalled(); expect(focus).toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('#organizer-name-errors').textContent).toContain('Enter the organizer name');
  });
  it('binds a native input into the nested model', async () => {
    const {fixture,app}=await setup(); const input=fixture.nativeElement.querySelector('#organizer-name');
    input.value='Kiril'; input.dispatchEvent(new Event('input')); fixture.detectChanges();
    expect(app.model().organizer.name).toBe('Kiril');
  });
  it('applies attendee rules to newly added rows and prevents removing the last row', async () => {
    const {fixture,app}=await setup(); app.model.set(validBooking()); fixture.detectChanges();
    expect(app.registration().valid()).toBe(true); app.actions.addAttendee(); fixture.detectChanges();
    expect(app.registration().invalid()).toBe(true);
    expect(app.registration.attendees[2].email().errors().some(e=>e.kind==='required')).toBe(true);
    app.actions.removeAttendee(app.model().attendees[2].id); app.actions.removeAttendee('b'); app.actions.removeAttendee('a'); fixture.detectChanges();
    expect(app.model().attendees.length).toBe(1); expect(app.registration().valid()).toBe(true);
  });
  it('keeps the remaining row field state and DOM identity after removing an earlier row', async () => {
    const {fixture,app}=await setup(); app.model.set(validBooking()); fixture.detectChanges();
    const field=app.registration.attendees[1]; const element=fixture.nativeElement.querySelector('#b-email');
    field.email().markAsTouched(); app.actions.removeAttendee('a'); fixture.detectChanges();
    expect(app.registration.attendees[0]).toBe(field);
    expect(app.registration.attendees[0].email().touched()).toBe(true);
    expect(fixture.nativeElement.querySelector('#b-email')).toBe(element);
  });
  it('maps a server error by attendee ID and preserves its target after row removal', async () => {
    const {fixture,app,api}=await setup(); app.model.set(validBooking()); fixture.detectChanges();
    vi.spyOn(api,'save').mockResolvedValue({kind:'rejected',attendeeId:'b',message:'Already reserved.'});
    const focus=vi.spyOn(fixture.nativeElement.querySelector('#b-email'),'focus');
    await app.actions.save(event()); fixture.detectChanges();
    expect(app.registration.attendees[0].email().errors()).toEqual([]);
    expect(app.registration.attendees[1].email().errors()[0].kind).toBe('duplicate'); expect(focus).toHaveBeenCalled();
    app.actions.removeAttendee('a'); fixture.detectChanges();
    expect(app.registration.attendees[0].email().errors()[0].kind).toBe('duplicate');
    app.registration.attendees[0].email().value.set('new@example.com'); fixture.detectChanges();
    expect(app.registration.attendees[0].email().errors()).toEqual([]);
  });
  it('locks structure and avoids concurrent requests while submitting', async () => {
    const {fixture,app,api}=await setup(); app.model.set(validBooking()); fixture.detectChanges();
    let finish!: (v:{kind:'saved';reference:string})=>void;
    const save=vi.spyOn(api,'save').mockImplementation(()=>new Promise(resolve=>{finish=resolve;}));
    const first=app.actions.save(event()); await Promise.resolve(); fixture.detectChanges();
    expect(app.registration().submitting()).toBe(true); expect(fixture.nativeElement.querySelector('.submission-fields').disabled).toBe(true);
    app.actions.addAttendee(); app.actions.removeAttendee('a'); await app.actions.save(event());
    expect(app.model().attendees.length).toBe(2); expect(save).toHaveBeenCalledTimes(1);
    finish({kind:'saved',reference:'AM-TEST'}); await first;
    expect(app.registration().submitting()).toBe(false);
  });
  it('preserves nested data after transport failure and retries unchanged', async () => {
    const {fixture,app,api}=await setup(); app.model.set(validBooking()); fixture.detectChanges();
    const save=vi.spyOn(api,'save').mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce({kind:'saved',reference:'AM-RETRY'});
    const before=structuredClone(app.model()); await app.actions.save(event());
    expect(app.actions.outcome().kind).toBe('failed'); expect(structuredClone(app.model())).toEqual(before);
    await app.actions.save(event()); expect(save).toHaveBeenCalledTimes(2); expect(app.actions.outcome().kind).toBe('saved');
  });
  it('distinguishes confirmed data from later nested preference edits', async () => {
    const {fixture,app,api}=await setup(); app.model.set(validBooking()); fixture.detectChanges();
    vi.spyOn(api,'save').mockResolvedValue({kind:'saved',reference:'AM-OK'}); await app.actions.save(event());
    app.registration.attendees[0].preferences.meal().value.set('vegan');
    expect(app.actions.message()).toContain('current edits have not been saved');
  });
});
