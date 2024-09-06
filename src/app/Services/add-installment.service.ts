import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FirebaseService } from './Firebase.service';
import { Installment } from '../Models/Installment.module';

interface FirebaseAddResponse {
  name: string; // ID of the newly created record
}

@Injectable({
  providedIn: 'root'
})
export class AddInstallmentService extends FirebaseService {

  getInstallmentsByPatient(patientName: string): Observable<Installment[]> {
    return this.get<{ [key: string]: Installment }>('add-installment').pipe(
      map(data => {
        if (data && Object.keys(data).length) {
          return Object.keys(data).map(key => {
            const installment = data[key];
            installment.id = key;
            return installment;
          }).filter(installment => installment.patientName === patientName);
        }
        return [];
      }),
      catchError(error => {
        console.error('Error fetching installments', error);
        return of([]); // Return an empty array on error
      })
    );
  }

  addInstallment(data: any): Observable<Installment> {
    return this.post<FirebaseAddResponse>('add-installment', data).pipe(
      map(response => {
        return { ...data, id: response.name };
      }),
      catchError(error => {
        console.error('Error adding installment', error);
        return of({ ...data, id: 'default-id' }); // Return a default Installment object on error
      })
    );
  }

  updateInstallment(id: string, data: any): Observable<void> {
    return this.put(`add-installment/${id}`, data).pipe(
      catchError(error => {
        console.error('Error updating installment', error);
        return of(); // Return an empty observable on error
      })
    );
  }

  deleteInstallment(id: string): Observable<void> {
    return this.delete(`add-installment/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting installment', error);
        return of(); // Return an empty observable on error
      })
    );
  }
}
