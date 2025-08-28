import { Component, effect } from '@angular/core';
import { ZoomService } from '../../services/zoom.service';
import { UtilityService } from '../../services/utility.service';
import { Batch } from '../../interfaces/batch.interface';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, ɵInternalFormsSharedModule } from '@angular/forms';
import { MosService } from '../../services/mos.service';
import { BatchDto } from '../../Dtos/Batch.dto';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-mos-toolbar',
  imports: [CommonModule, ɵInternalFormsSharedModule, ReactiveFormsModule, FormsModule],
  templateUrl: './mos-toolbar.component.html',
  styleUrl: './mos-toolbar.component.scss'
})
export class MosToolbarComponent {

  pxPerHour = environment.pxPerHour; // Default value, will be updated by ZoomService
  batches: BatchDto[] = [];
  clonedBatches: BatchDto[] = [];
  private isFirstBatchLoad = true;

  selectedBatch: FormControl<BatchDto | null> = new FormControl(null);
  startDate: FormControl<Date | null> = new FormControl(null)
  endDate: FormControl<Date | null> = new FormControl(null)

  // startDate = new Date()
  // endDate = new Date()

  constructor(
    private zoomService: ZoomService,
    private utilityService: UtilityService,
    protected mosService: MosService
  ) {
    effect(() => {
      this.batches = [...mosService.batches()];
      if (this.isFirstBatchLoad && this.batches.length > 0) {
        this.clonedBatches = structuredClone(this.batches);
        this.isFirstBatchLoad = false;

        // Initialize all batches as selected
        this.selectedBatches.clear();
        this.clonedBatches.forEach(batch => {
          this.selectedBatches.add(batch.batchId);
        });
        this.updateSelectAllState();
      }
      this.pxPerHour = this.zoomService.pxPerHour();
      if (this.utilityService.isValidDate(this.mosService.startDate()) && utilityService.isValidDate(this.mosService.endDate())) {

        let _startDate = this.mosService.startDate().toISOString()
        let _endDate = this.mosService.endDate().toISOString()

        console.log(_startDate)
        console.log(_endDate)

        this.startDate.setValue(new Date(_startDate))
        this.endDate.setValue(new Date(_endDate))
      }
    });
  }


  zoomIn() { this.zoomService.zoomIn(); }
  zoomOut() { this.zoomService.zoomOut(); }
  zoomReset() { this.zoomService.reset(); }

  toggleGridLineHours() {
    // this.showGridLineHours = !this.showGridLineHours;
    this.mosService.showGridLineHours.set(!this.mosService.showGridLineHours());
  }

  onSelectedBatchChange() {
    if (this.selectedBatch.value !== null) {

      this.mosService.batches.set([])
      this.mosService.batches.set([this.selectedBatch.value!])
    }
    else {
      this.mosService.batches.set(this.clonedBatches);
    }

  }

  selectedBatches: Set<string> = new Set(); // Store selected batch IDs
  isSelectAllChecked = false;
  isIndeterminate = false;

  onSelectAllBatch(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.isSelectAllChecked = checkbox.checked;

    if (checkbox.checked) {
      // Select all batches
      this.selectedBatches.clear();
      this.clonedBatches.forEach(batch => {
        this.selectedBatches.add(batch.batchId);
      });
    } else {
      // Deselect all batches
      this.selectedBatches.clear();
    }

    this.updateSelectAllState();
    this.onBatchSelectionChange();
  }
  onSelectBatch(event: Event, batch: BatchDto) {
    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {
      this.selectedBatches.add(batch.batchId);
    } else {
      this.selectedBatches.delete(batch.batchId);
    }
    this.updateSelectAllState();
    this.onBatchSelectionChange();
  }
  private updateSelectAllState() {
    const totalBatches = this.clonedBatches.length;
    const selectedCount = this.selectedBatches.size;

    this.isSelectAllChecked = selectedCount === totalBatches && totalBatches > 0;
    this.isIndeterminate = selectedCount > 0 && selectedCount < totalBatches;

    // Update the select all checkbox state
    const selectAllCheckbox = document.getElementById('selectAllCheckbox') as HTMLInputElement;
    if (selectAllCheckbox) {
      selectAllCheckbox.checked = this.isSelectAllChecked;
      selectAllCheckbox.indeterminate = this.isIndeterminate;
    }
  }

  private onBatchSelectionChange() {
    // Emit or handle the selection change

    // Get the actual batch objects if needed
    const selectedBatchObjects = this.clonedBatches.filter(batch =>
      this.selectedBatches.has(batch.batchId)
    );

    // You can emit an event or call other methods here
    // this.batchSelectionChanged.emit(selectedBatchObjects);
  }

  // Helper method to check if a batch is selected
  isBatchSelected(batchId: string): boolean {
    return this.selectedBatches.has(batchId);
  }

  // Helper method to get selected batches
  getSelectedBatches(): BatchDto[] {
    return this.clonedBatches.filter(batch =>
      this.selectedBatches.has(batch.batchId)
    );
  }
  // Clear all selections
  clearBatchSelection() {
    this.selectedBatches.clear();
    this.updateSelectAllState();
    this.onBatchSelectionChange();

    this.mosService.batches.set(this.clonedBatches)
  }

  // Apply the filter (example implementation)
  applyBatchFilter() {
    const selectedBatches = this.getSelectedBatches();
    console.log('Applying filter with batches:', selectedBatches);

    this.mosService.batches.set([])
    this.mosService.batches.set(selectedBatches)

    // Example: Filter your data based on selected batches
    // this.filteredData = this.allData.filter(item =>
    //   this.selectedBatches.has(item.batchId)
    // );

    // Or emit the selection to parent component
    // this.batchFilterApplied.emit(selectedBatches);
  }

  // Initialize with some batches pre-selected (optional)
  initializeSelectedBatches(batchIds: string[]) {
    this.selectedBatches.clear();
    batchIds.forEach(id => {
      if (this.clonedBatches.some(batch => batch.batchId === id)) {
        this.selectedBatches.add(id);
      }
    });
    this.updateSelectAllState();
  }

  // Get selection summary
  getSelectionSummary(): string {
    const total = this.clonedBatches.length;
    const selected = this.selectedBatches.size;

    if (selected === 0) return 'None selected';
    if (selected === total) return 'All selected';
    return `${selected} of ${total} selected`;
  }

  // Getters for template
  get startDateString(): string {
    const date = this.startDate.value;
    return date ? this.formatDateForInput(date.toISOString()) : '';
  }

  get endDateString(): string {
    const date = this.endDate.value;
    return date ? this.formatDateForInput(date.toISOString()) : '';
  }

  private formatDateForInput(isoDate: string): string {
    return isoDate.split('T')[0];
  }

  onStartDateChange(event: any) {
    const dateString = event.target.value;
    this.startDate.setValue(dateString ? new Date(dateString + 'T00:00:00.000Z') : null);
    this.mosService.startDate.set(this.startDate.value!)
    console.log()
  }

  onEndDateChange(event: any) {
    const dateString = event.target.value;
    this.endDate.setValue(dateString ? new Date(dateString + 'T23:59:59.000Z') : null);
    this.mosService.endDate.set(this.endDate.value!)
  }

}
