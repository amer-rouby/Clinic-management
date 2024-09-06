import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { FirebaseService } from './Firebase.service';
import { DentalClinic } from '../Models/DentalClinic.module';

@Injectable({
    providedIn: 'root'
})
export class DentalClinicService extends FirebaseService {
    getAllDentalClinic(): Observable<DentalClinic[]> {
        return this.get<{ [key: string]: any }>('dental-clinic').pipe(
            map(data => {
                if (data && Object.keys(data).length) {
                    return Object.keys(data).map(key => {
                        let dental = data[key];
                        dental.id = key;
                        return dental;
                    });
                }
                return [];
            })
        );
    }

    addDentalClinic(dental: DentalClinic): Observable<DentalClinic> {
        return this.post<DentalClinic>('dental-clinic', dental);
    }

    deleteDentalClinic(dentalId: string): Observable<void> {
        return this.delete(`dental-clinic/${dentalId}`);
    }

    updateDentalClinic(dentalId: string, dental: DentalClinic): Observable<void> {
        return this.put(`dental-clinic/${dentalId}`, dental);
    }
}
