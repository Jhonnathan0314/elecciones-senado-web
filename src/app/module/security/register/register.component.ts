import { Component } from '@angular/core';
import { RegisterRequest } from 'src/app/core/models/authentication.model';
import { DocumentType } from 'src/app/core/models/document-type.model';
import { AuthenticationService } from 'src/app/core/services/security/authentication/authentication.service';
import { SessionService } from 'src/app/core/services/security/session/session.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  documentTypes: DocumentType[] = [
    {
      id: 1,
      prefix: 'CC',
      name: 'Cédula de ciudadania'
    },
    {
      id: 2,
      prefix: 'CE',
      name: 'Cédula de extranjeria'
    }
  ]

  documentType = '';
  documentNumber: number;
  name = '';
  lastName = '';
  username = '';
  password = '';
  confirmPassword = '';

  request: RegisterRequest = new RegisterRequest();

  constructor(private authenticationService: AuthenticationService, private sessionService: SessionService) { }

  register() {
    this.request = {
      documentType: this.documentTypes.find(docType => docType.prefix == this.documentType) || this.documentTypes[0],
      documentNumber: this.documentNumber,
      name: this.name,
      lastName: this.lastName,
      username: this.username,
      password: this.password
    }
    
    this.authenticationService.register(this.request).subscribe({
      next: (response) => {
        this.sessionService.saveSession(this.request, response.data.token);
        console.log("response: ", response);
      },
      error: (error) => {
        console.log("error: ", error);
      }
    })
  }

}
