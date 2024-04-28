import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {FormGroup,FormBuilder, Validators, FormControl} from '@angular/forms';
import { ITask } from '../model/task';
import {  startWith, map } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TaskService } from '../task.service';
//import { EmployeeJobTitle } from '../model/employeejobtitle';
import { EmployeeName } from '../model/employeename';
import { HttpErrorResponse } from '@angular/common/http';
import { EmployeeJobTitle } from '../model/employeejobtitle';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  todoForm !: FormGroup;
  tasks : ITask [] = [];
  inprogress : ITask [] = [];
  done : ITask [] = [];
  taskId : number = 0
  updateIndex!: any;
  isEditEnabled : boolean = false
  myControl = new FormControl();
  myJobTControl = new FormControl();
  employeeJobTitle: EmployeeJobTitle[]=[];
  employeeJobTitleNew: any[]=[];
  employeeName: EmployeeName[]=[];
  employeeNameNew: any[]=[];
  filteredOptionsJobT!: Observable<EmployeeJobTitle[]>;
  filteredOptionsName!: Observable<EmployeeName[]>;
  newemployeejobtitle: any;
  newemployeeName: any;


  constructor(private taskservice: TaskService, private fb: FormBuilder){
     this.filteredOptionsJobT = this.taskservice.getEmployeesJobTitle();
 //   this.filteredOptionsName = this.taskservice.getEmployees();
  }


  ngOnInit(): void {
  this.filteredOptionsJobT = this.taskservice.getEmployeesJobTitle();
  this.getEmployeesJobTitles();

    this.todoForm = this.fb.group({
      item : ["", Validators.required] 
    })
    // this.taskservice.getEmployeesJobTitle().subscribe(
    //   (result) => {
    //     this.newemployeejobtitle = result;
    //     for(let i=0; i<this.employeeJobTitle.length; i++){
    //            this.employeeJobTitleNew.push(this.employeeJobTitle[i].jobTitle);
    //          //  console.log(this.employeeJobTitleNew)
    //            }
    //   },
    //   (error) => {
    //     console.error('Error fetching employee job titles:', error);
    //   }
    // );

     this.taskservice.getEmployees().subscribe(
      (result) => {
        this.newemployeeName = result;
        for(let i=0; i<this.employeeName.length; i++){
               this.employeeNameNew.push(this.employeeName[i].name);
               }
      },
      (error) => {
        console.error('Error fetching employee name:', error);
      }
    );

      this.filteredOptionsJobT = this.myJobTControl.valueChanges
      .pipe(
        startWith(''),
        map((value) => this._filter(value))
      );

      this.filteredOptionsName = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter2(value))
      );
  }
  
  private _filter(value: string): EmployeeJobTitle[] {
    const searchValue = value.toLowerCase();

    return this.employeeJobTitle.filter((option) => option.jobTitle.toLowerCase().includes(searchValue));
  }

    private _filter2(value: string): EmployeeName[] {
      const searchValue = value.toLowerCase();
  
      return this.employeeNameNew.filter(option => option.name.toLowerCase().includes(searchValue));
    }

    public getEmployeesJobTitles(){
      this.taskservice.getEmployeesJobTitle().subscribe(
        (response: EmployeeJobTitle[]) => {
          this.employeeJobTitle = response;
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
        );
    }

    // Inside the AutocompleteComponent class...
// onOptionSelected(event: MatAutocompleteSelectedEvent): void {
//   const selectedValue = event.option.viewValue;
//   console.log('Selected Value:', selectedValue);

//   // Perform additional actions with the selected value as needed
// }

  addTask(){
  this.tasks.push({
    taskId: this.todoForm.value.item,
    description: this.todoForm.value.item,
    done: false
  })
  this.todoForm.reset()
  }

  onEdit(item:ITask, taskId:number){
    this.todoForm.controls['item'].setValue(item.description);
    this.updateIndex = taskId;
    this.isEditEnabled = true;
  }

  updateTask(){
    this.tasks[this.updateIndex].description = this.todoForm.value.item;
    this.tasks[this.updateIndex].done = false;
    this.todoForm.reset();
    this.updateIndex = undefined;
    this.isEditEnabled = false;
  }

  deleteTask(taskId: number){
    this.tasks.splice(taskId,1)
  }

  deleteInProgressTask(taskId: number){
    this.inprogress.splice(taskId,1)
  }

  deleteDoneTask(taskId: number){
    this.done.splice(taskId,1)
  }


  drop(event: CdkDragDrop<ITask[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

}

