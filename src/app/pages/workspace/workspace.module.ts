import { NgModule } from '@angular/core';

import { WorkspaceRoutingModule } from './workspace-routing.module';
import { WorkspaceComponent } from './workspace.component';

import { FormsModule } from '@angular/forms';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzSelectModule } from 'ng-zorro-antd/select';

@NgModule({
  imports: [
    FormsModule,
    WorkspaceRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    NzGridModule,
    NzTableModule,
    NzInputModule,
    NzButtonModule,
    NzDescriptionsModule,
    NzSpaceModule,
    NzStatisticModule,
    NzSelectModule
  ],
  declarations: [WorkspaceComponent],
  exports: [WorkspaceComponent]
})
export class WorkspaceModule { }
