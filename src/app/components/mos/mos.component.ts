import { Component, effect } from '@angular/core';
import { MosContainerComponent } from '../../widgets/mos-container/mos-container.component';
import { Batch } from '../../interfaces/batch.interface';
import { Resource } from '../../interfaces/resource.interface';
import { ResourceService } from '../../services/resource.service';

@Component({
  selector: 'app-mos',
  imports: [MosContainerComponent],
  templateUrl: './mos.component.html',
  styleUrl: './mos.component.scss'
})
export class MosComponent {



  batches: Batch[] = [
    { batchId: '1', label: 'Batch 1', color: '#ff0000' },
    { batchId: '2', label: 'Batch 2', color: '#5d8ebbff' },
    { batchId: '3', label: 'Batch 3', color: '#0000ff' },
    { batchId: '4', label: 'Batch 4', color: '#ffff00' },
    { batchId: '5', label: 'Batch 5', color: '#ff00ff' },
    { batchId: '6', label: 'Batch 6', color: '#00ffff' },
  ]

  resources: Resource[] = [
    {
      resourceId: 'M1',
      name: 'Machine A',
      tasks: [
        {
          taskId: 'A1', batchId: '1', label: 'Task A1',
          start: '2025-08-18T01:00:00',
          end: '2025-08-18T12:00:00', // 11h
          color: '#ff0000', successors: ['B1']
        },
        {
          taskId: 'A2', batchId: '2', label: 'Task A2',
          start: '2025-08-18T12:30:00',
          end: '2025-08-19T01:30:00', // 27h
          color: '#5d8ebbff', successors: ['B2', 'A3']
        },
        {
          taskId: 'A3', batchId: '3', label: 'Task A3',
          start: '2025-08-19T04:00:00',
          end: '2025-08-20T02:00:00', // 28h
          color: '#0000ff', successors: ['B3']
        }
      ]
    },
    {
      resourceId: 'M2',
      name: 'Machine B',
      tasks: [
        {
          taskId: 'B1', batchId: '1', label: 'Task B1',
          start: '2025-08-18T06:00:00',  // starts when A1 ends
          end: '2025-08-19T04:00:00',  // 16h
          color: '#ff0000'
        },
        {
          taskId: 'B2', batchId: '2', label: 'Task B2',
          start: '2025-08-19T05:30:00',  // starts when A2 ends
          end: '2025-08-19T14:30:00',  // 23h
          color: '#5d8ebbff'
        },
        {
          taskId: 'B3', batchId: '3', label: 'Task B3',
          start: '2025-08-20T05:00:00',  // starts when A3 ends
          end: '2025-08-21T00:00:00',  // 12h
          color: '#0000ff'
        }
      ]
    },
    {
      resourceId: 'M3',
      name: 'Machine C',
      tasks: []
    },
    {
      resourceId: 'M4',
      name: 'Machine D',
      tasks: []
    },
    {
      resourceId: 'M5',
      name: 'Machine E',
      tasks: []
    },
    {
      resourceId: 'M6',
      name: 'Machine F',
      tasks: []
    },
    {
      resourceId: 'M7',
      name: 'Machine G',
      tasks: []
    },
    {
      resourceId: 'M8',
      name: 'Machine H',
      tasks: []
    }
  ];

  constructor(
    private resourceService: ResourceService
  ) {
    this.resourceService.batches.set(this.batches);
    this.resourceService.resources.set(this.resources);
  }

  ngOnInit() { }



}
