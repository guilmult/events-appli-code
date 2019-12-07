import { Groupe } from './groupe';

export interface User {
    email: string;
    groups?: Groupe[];
}
