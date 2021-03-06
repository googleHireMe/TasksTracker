import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Task } from 'src/app/core/models/task';
import { Priority } from 'src/app/core/models/priority';
import { distinctUntilChanged, debounceTime, tap, takeUntil, withLatestFrom } from 'rxjs/operators';
import { BaseDestroyableComponent } from 'src/app/core/base-classes/base-destroyable';
import { pipe, of } from 'rxjs';

@Component({
  selector: 'app-task-edit-form',
  templateUrl: './task-edit-form.component.html',
  styleUrls: ['./task-edit-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskEditFormComponent extends BaseDestroyableComponent implements OnChanges, AfterViewInit {

  @Input() task: Task;
  @Input() priorities: Priority[];
  @Input() isInEditMode: boolean;

  @Output() fieldUpdated = new EventEmitter<{ [key: string]: any }>();
  @Output() formSubmitted = new EventEmitter<Task>();

  @ViewChild('stickyHeader') stickyHeader: ElementRef;
  @ViewChild('scrollableContent') scrollableContent: ElementRef;

  taskForm: FormGroup;

  ngAfterViewInit(): void {
    this.calculateViewPortHeight();
  }

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.task?.firstChange) {
      this.createForm();
    }
    if (changes.task?.currentValue) {
      this.taskForm.patchValue(changes.task.currentValue, { emitEvent: false });
    }
  }

  submit(): void {
    this.formSubmitted.next(this.taskForm.value);
  }

  private createForm(): void {
    this.taskForm = this.fb.group({
      title: '',
      status: '',
      dueDate: '',
      description: '',
      priority: ''
    });
    this.taskForm.get('status').patchValue(false, { emitEvent: false });
    if (this.isInEditMode) {
      this.trackFieldsChanges();
    }
  }

  // TODO: move to directive
  private trackFieldsChanges(): void {
    Object.keys(this.taskForm.controls)
      .forEach(formControlName => {
        this.taskForm.get(formControlName).valueChanges
          .pipe(this.getPipeForFormControl(formControlName))
          .subscribe();
      });
  }

  // TODO: move to directive
  private getPipeForFormControl(fieldName: string) {
    return pipe(
      withLatestFrom(of(fieldName)),
      distinctUntilChanged(),
      debounceTime(500),
      tap(([value, key]) => this.fieldUpdated.next({ [key]: value })),
      takeUntil(this.componentAlive$));
  }

  private calculateViewPortHeight(): void {
    const documentHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    const stickyHeader = (this.stickyHeader.nativeElement as HTMLDivElement);
    const scrollableContent = (this.scrollableContent.nativeElement as HTMLDivElement);
    scrollableContent.style.height = documentHeight - stickyHeader.offsetHeight + 'px';
  }

}
