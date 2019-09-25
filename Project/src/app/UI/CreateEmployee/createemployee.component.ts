import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, FormArray } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from 'src/Services/employee.service';
import { IEmployee } from 'src/Models/IEmployee';
import { ISkill } from 'src/Models/ISkills';

@Component({
  selector: 'app-createemployee',
  templateUrl: './createemployee.component.html',
  styleUrls: ['./createemployee.component.sass']
})

// FORMBUILDER EXAMPLE
export class CreateEmployeeComponent implements OnInit {

  employeeForm: FormGroup;
  // This object will hold the messages to be displayed to the user
  // Notice, each key in this object has the same name as the
  // corresponding form control
  formErrors = {
    'fullName': '',
    'email': '',
    'phone': '',
    'skillName': '',
    'experienceInYears': '',
    'proficiency': ''
  };

  // This object contains all the validation messages for this form
  validationMessages = {
    'fullName': {
      'required': 'Full Name is required.',
      'minlength': 'Full Name must be greater than 2 characters.',
      'maxlength': 'Full Name must be less than 10 characters.'
    },
    'email': {
      'required': 'Email is required.',
      'emailDomain': 'only gmail domain is required.'
    },
    'phone': {
      'required': 'Phone is required.'
    },
    'skillName': {
      'required': 'Skill Name is required.',
    },
    'experienceInYears': {
      'required': 'Experience is required.',
    },
    'proficiency': {
      'required': 'Proficiency is required.',
    },
  };

//Inject the FormBuilder Service
  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private employeeService: EmployeeService) { }


ngOnInit() {

  //Instantite employeeForm FormBuilder object
  this.employeeForm = this.fb.group({
    fullName: ['',[Validators.required,Validators.minLength(2),Validators.maxLength(10)]],
    email: ['', [Validators.required,emailDomainValidator]],
    contactPreference:['email'],
    phone: [''],
    skills: this.fb.group({
      skillName: ['', Validators.required],
      experienceInYears: ['', Validators.required],
      proficiency: ['beginner', Validators.required]
    }),
  });


  //Value Changes observable
  this.employeeForm.get('contactPreference').valueChanges.subscribe((contactPreferenceValue: string) => {
    this.onContactPrefernceChange(contactPreferenceValue);
  });
  this.employeeForm.valueChanges.subscribe((fullFormValue:any) => {
    //console.log(JSON.stringify(fullFormValue));
    this.logValidationErrors(this.employeeForm);
  });

  //Get the employee id parameter from EmployeeList component using Activated Route
  this.route.paramMap.subscribe(params => {
    const empId = +params.get('id');
    if (empId) {
      this.getEmployee(empId);
    }
  });

}

//  VALIDATION METHODS/UI EVENTS START
//  Loop through form controls for controls validation
logValidationErrors(group: FormGroup): void {
    // Loop through each control key in the FormGroup
    Object.keys(group.controls).forEach((key: string) => {
      // Get the control. The control can be a nested form group
      const abstractControl = group.get(key);
      // If the control is nested form group, recursively call
      // this same method
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
        // If the control is a FormControl
      } else {

        //abstractControl.disable();       

        // Clear the existing validation errors
        this.formErrors[key] = '';
        //Control fails to pass the validation
        if (abstractControl && !abstractControl.valid &&
          (abstractControl.touched || abstractControl.dirty)

        ) {         
          // Get all the validation messages of the form control
          // that has failed the validation
          const messages = this.validationMessages[key];
          // Find which validation has failed. For example required,
          // minlength or maxlength. Store that error message in the
          // formErrors object. The UI will bind to this object to
          // display the validation errors
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.formErrors[key] += messages[errorKey] + ' ';
            }
          }
        }
      }
    });
  }
  onSubmit(): void {
    console.log('submit');
    //employeeForm.controls.fullName.value
    ////OR
    //employeeForm.get('fullName').value
  }

// If the Selected Radio Button value is "phone", then add the
// required validator function otherwise remove it
onContactPrefernceChange(selectedValue: string) {
  const phoneFormControl = this.employeeForm.get('phone');
  const emailFormControl = this.employeeForm.get('email');
  if (selectedValue === 'phone') {
    phoneFormControl.setValidators(Validators.required);
    emailFormControl.clearValidators();
  } else {
    emailFormControl.setValidators(Validators.required);
    phoneFormControl.clearValidators();
  }
  phoneFormControl.updateValueAndValidity();
  emailFormControl.updateValueAndValidity();
  }  

onLoadDataClick(): void {
    this.logValidationErrors(this.employeeForm);
    console.log(this.formErrors);
  }

//  VALIDATION METHODS/UI EVENTS END


//SERVICE OPERATIONS START
  getEmployee(id: number) {
    this.employeeService.getEmployee(id)
      .subscribe(
        (employee: IEmployee) => this.editEmployee(employee),
        (err: any) => console.log(err)
      );
  }

  editEmployee(employee: IEmployee) {
    this.employeeForm.patchValue({
      fullName: employee.fullName,
      contactPreference: employee.contactPreference,
      emailGroup: {
        email: employee.email,
        confirmEmail: employee.email
      },
      phone: employee.phone
    });

    this.employeeForm.setControl('skills', this.setExistingSkills(employee.skills));

  }
  setExistingSkills(skillSets: ISkill[]): FormArray {
    const formArray = new FormArray([]);
    skillSets.forEach(s => {
      formArray.push(this.fb.group({
        skillName: s.skillName,
        experienceInYears: s.experienceInYears,
        proficiency: s.proficiency
      }));
    });

    return formArray;
  }

  removeSkillButtonClick(skillGroupIndex: number): void {
    const skillsFormArray = <FormArray>this.employeeForm.get('skills');
    skillsFormArray.removeAt(skillGroupIndex);
    skillsFormArray.markAsDirty();
    skillsFormArray.markAsTouched();
  }
//SERVICE OPERATIONS END

}

//CUSTOM VALIDATOR: Create Function
function emailDomainValidator(control: AbstractControl): { [key: string]: any } | null {
  const email: string = control.value;
  const domain = email.substring(email.lastIndexOf('@') + 1);
  if (email === '' || domain.toLowerCase() === 'gmail.com') {
    return null;
  } else {
    return { 'emailDomain': true };
  }
}

/*
//FORM GROUP EXAMPLE
export class HomeComponent implements OnInit {

  employeeForm: FormGroup;

  constructor() { }

  // Initialise the FormGroup with the 2 FormControls we need.
  // ngOnInit ensures the FormGroup and it's form controls are
  // created when the component is initialised

  ngOnInit() {
    this.employeeForm = new FormGroup({
      fullName: new FormControl(),
      email: new FormControl(),
      // Create skills form group
      SkillFormGroup: new FormGroup({
        skillName: new FormControl(),
        experienceInYears: new FormControl(),
        proficiency: new FormControl()
      })
    });
  }

  onSubmit(): void {
    console.log(this.employeeForm.value);
    employeeForm.controls.fullName.value
    //OR
    employeeForm.get('fullName').value
  }
}

*/


