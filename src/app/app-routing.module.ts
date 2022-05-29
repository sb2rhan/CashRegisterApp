import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './services/authguard.service';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/workspace' },
  { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule),
                        canActivate: [AuthGuardService] },
  { path: 'workspace', loadChildren: () => import('./pages/workspace/workspace.module')
                        .then(m => m.WorkspaceModule), canActivate: [AuthGuardService] },
  // otherwise redirect to home
  { path: '**', redirectTo: '/workspace' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
