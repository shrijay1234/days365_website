import { Component, ChangeDetectorRef, ElementRef, ViewChild  } from '@angular/core';
import { FormBuilder, FormArray, Validators } from "@angular/forms";
import {  FormGroup, FormControl} from '@angular/forms';



@Component({
  selector: 'app-listing-product-listing',
  templateUrl: './listing-product-listing.component.html',
  styleUrls: ['./listing-product-listing.component.css']
})
export class ListingProductListingComponent {
 

  submitted:true;
  formGroup: FormGroup;
 /* form validation */
  titleAlert: string = 'This field is required';
  post: any = '';

  constructor(private formBuilder: FormBuilder,
    public fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) {}





  ngOnInit() {
    this.createForm();
    this.setChangeValidate()
  }
 
  createForm() {
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.formGroup = this.formBuilder.group({
        'title': [null, Validators.required],
      'name': [null, Validators.required],
      'price': [null, [Validators.required,]],
      'description': [null, [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
      'validate': ''
    });
  }

  setChangeValidate() {
    this.formGroup.get('validate').valueChanges.subscribe(
      (validate) => {
        if (validate == '1') {
          this.formGroup.get('name').setValidators([Validators.required, Validators.minLength(3)]);
          this.titleAlert = "You need to specify at least 3 characters";
        } else {
          this.formGroup.get('name').setValidators(Validators.required);
        }
        this.formGroup.get('name').updateValueAndValidity();
      }
    )
  }

  get name() {
    return this.formGroup.get('name') as FormControl
  }

  get title() {
    return this.formGroup.get('title') as FormControl
  }
  checkPrice(control) {
    let enteredPrice = control.value
    let priceCheck = /([0-9])/;
    return (!priceCheck.test(enteredPrice) && enteredPrice) ? { 'requirements': true } : null;
  }

  getErrorPrice() {
    return this.formGroup.get('price').hasError('required') ? 'Field is required (at least 200 price)' :
      this.formGroup.get('price').hasError('requirements') ? 'Price needs to be at least 200' : '';
  }
  anSubmit(post) {
    this.post = post;
  }

 

/* upload image */
  /*##################### Registration Form #####################*/
  registrationForm = this.fb.group({
    file: [null]
  })  

  /*########################## File Upload ########################*/
  @ViewChild('fileInput') el: ElementRef;
  imageUrl: any = "https://i.ibb.co/fDWsn3G/buck.jpg";
  editFile: boolean = true;
  removeUpload: boolean = false;

  uploadFile(event) {
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);

      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.imageUrl = reader.result;
        this.registrationForm.patchValue({
          file: reader.result
        });
        this.editFile = false;
        this.removeUpload = true;
      }
      // ChangeDetectorRef since file is loading outside the zone
      this.cd.markForCheck();        
    }
  }

  // Function to remove uploaded file
  removeUploadedFile() {
    let newFileList = Array.from(this.el.nativeElement.files);
    this.imageUrl = 'https://i.pinimg.com/236x/d6/27/d9/d627d9cda385317de4812a4f7bd922e9--man--iron-man.jpg';
    this.editFile = true;
    this.removeUpload = false;
    this.registrationForm.patchValue({
      file: [null]
    });
  }
  
  // Submit Registration Form
  onSubmit() {
    this.submitted = true;
    if(!this.registrationForm.valid) {
      alert('Please fill all the required fields to create a super hero!')
      return false;
    } else {
      console.log(this.registrationForm.value)
    }
  }


}
