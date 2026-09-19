import {Injectable, signal} from '@angular/core';
@Injectable({providedIn:'root'})
export class ThemeService {
 readonly current=signal<'light'|'dark'>('dark');
 constructor(){
  let saved: string | null=null;
  try {saved=localStorage.getItem('signal-forms-demo-theme');} catch {/* Storage can be unavailable. */}
  this.applyTheme(saved==='light'||saved==='dark' ? saved : (matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'));
 }
 toggle(){this.applyTheme(this.current()==='dark'?'light':'dark');try {localStorage.setItem('signal-forms-demo-theme',this.current());} catch {/* The current session still works. */}}
 private applyTheme(theme:'light'|'dark'){this.current.set(theme);document.documentElement.dataset['theme']=theme;}
}
