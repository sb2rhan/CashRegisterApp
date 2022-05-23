import { NgModule } from '@angular/core';

import { WorkspaceRoutingModule } from './workspace-routing.module';

import { WorkspaceComponent } from './workspace.component';


@NgModule({
  imports: [WorkspaceRoutingModule],
  declarations: [WorkspaceComponent],
  exports: [WorkspaceComponent]
})
export class WorkspaceModule { }
