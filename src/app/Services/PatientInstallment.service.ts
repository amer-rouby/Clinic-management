import { Injectable } from '@angular/core';
import { map, Observable, catchError, of } from 'rxjs';
import { FirebaseService } from './Firebase.service';
import { Installment } from '../Models/Installment.module';

interface FirebaseAddResponse {
  name: string; // ID of the newly created record
}

@Injectable({
  providedIn: 'root'
})
export class PatientInstallmentService extends FirebaseService {

  getAllInstallments(): Observable<Installment[]> {
    return this.get<{ [key: string]: Installment }>('patient-installment').pipe(
      map(data => {
        if (data && Object.keys(data).length) {
          return Object.keys(data).map(key => {
            const installment = data[key];
            installment.id = key;
            return installment;
          });
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
    return this.post<FirebaseAddResponse>('patient-installment', data).pipe(
      map(response => {
        return { ...data, id: response.name };
      }),
      catchError(error => {
        console.error('Error adding installment', error);
        return of({ ...data, id: 'default-id' }); // Return a default Installment object on error
      })
    );
  }

  updateInstallment(id: string, data: Installment): Observable<Installment | null> {
    return this.put<Installment>(`patient-installment/${id}`, data).pipe(
      map(() => data),
      catchError(error => {
        console.error('Error updating installment', error);
        return of(null); // Return null on error
      })
    );
  }

  deleteInstallment(id: string): Observable<void> {
    return this.delete(`patient-installment/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting installment', error);
        return of(); // Return an empty observable on error
      })
    );
  }
}
